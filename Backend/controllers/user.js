const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const resourceModel = require('../models/resource');
const responder = require('../util/responder');
const preferences = require('../util/available_preferences');
const inputValidator = require('../util/input_validator');
const adminUtil = require('../util/admin');
const cookieParser = require('../util/cookie_parser');
const httpErrorView = require('../views/http_error');

function register(data, response) {
    if (adminUtil.usables.usableRegister === false) {
        httpErrorView.serviceUnavailable(data, response);
        return;
    }

    if (data.method === 'POST') {
        try {
            const values = JSON.parse(data.payload);
            const username = values.username;
            const password = values.password;
            const confirm_password = values.confirm_password;

            if (inputValidator.username(username) === false ||
                inputValidator.password(password) === false || inputValidator.password(confirm_password)) {
                responder.status(response, 400);
                return;
            }

            if (password !== confirm_password) {
                responder.status(response, 400);
                return;
            }

            userModel.findOne( // check if username is already used
                { username: username }, 'username',
                (err, user) => {
                    if (err) { // something went wrong, perhaps an internal error
                        responder.status(response, 500);
                    } else {
                        if (user) { // username is already used
                            responder.status(response, 409);
                        } else { // username is available
                            const saltRounds = 13;

                            bcrypt.hash(password, saltRounds, (err, hash) => { // encrypt the password
                                if (err) {
                                    responder.status(response, 500); // something went wrong, perhaps an internal error
                                } else {
                                    userModel.create( // create and store a new user
                                        {
                                            _id: mongoose.Types.ObjectId(),
                                            username: username,
                                            password: hash,
                                            preferredDomains: preferences.default_domains,
                                            preferredSites: preferences.default_websites
                                        },
                                        err => {
                                            if (err) {
                                                responder.status(response, 500);
                                            } else {
                                                responder.status(response, 200);
                                            }
                                        }
                                    );
                                }
                            });
                        }
                    }
                });
        } catch { // payload is not a valid json
            responder.status(response, 400);
        }
    } else { // not a valid method, bad request
        responder.status(response, 400);
    }
}

function login(data, response) {
    if (adminUtil.usables.usableLogin === false) {
        httpErrorView.serviceUnavailable(data, response);
        return;
    }

    if (data.method === 'POST') {
        try {
            const values = JSON.parse(data.payload);
            const username = values.username;
            const password = values.password;

            userModel.findOne({ username: username }, '_id username password', (err, user) => {
                if (err) {
                    responder.status(response, 500);
                } else {
                    if (user) {
                        bcrypt.compare(password, user.password, (err, result) => {
                            if (err) {
                                responder.status(response, 500);
                            } else {
                                if (result) {
                                    const token = jwt.sign({
                                        userId: user._id,
                                        userName: user.username
                                    },
                                        process.env.AUTH_TOKEN,
                                        {
                                            expiresIn: "1h"
                                        }
                                    );

                                    response.setHeader('set-cookie', `token=${token}`);
                                    responder.status(response, 200);
                                } else {
                                    responder.status(response, 401);
                                }
                            }
                        });
                    } else {
                        responder.status(response, 401);
                    }
                }
            });
        } catch{
            responder.status(response, 400);
        }
    } else {
        responder.status(response, 400);
    }
}

function deleteAccount(data, response) {
    if (adminUtil.usables.usableDeleteAccount === false) {
        httpErrorView.serviceUnavailable(data, response);
        return;
    }

    if (data.method === 'DELETE') {
        try {
            const values = JSON.parse(data.payload);
            const token = cookieParser.parse(data).token;
            const password = values.password;

            jwt.verify(token, process.env.AUTH_TOKEN, (err, decoded) => {
                if (err) {
                    responder.status(response, 401);
                } else {
                    if (decoded) {
                        const username = decoded.userName;
                        userModel.findOne({ username: username }, 'password', (err, user) => {
                            if (err) {
                                responder.status(response, 500);
                            } else {
                                if (user) {
                                    bcrypt.compare(password, user.password, (err, result) => {
                                        if (err) {
                                            responder.status(response, 500);
                                        } else {
                                            if (result) {
                                                user.deleteOne({ username: username }, (err) => {
                                                    if (err) {
                                                        responder.status(response, 500);
                                                    } else {
                                                        responder.status(response, 200);
                                                    }
                                                })
                                            } else {
                                                responder.status(response, 401);
                                            }
                                        }
                                    });
                                } else {
                                    responder.status(response, 401);
                                }
                            }
                        });
                    } else {
                        responder.status(response, 401);
                    }
                }
            });
        } catch{
            responder.status(response, 400);
        }
    } else {
        responder.status(response, 400);
    }
}

function getFeed(data, response) {
    if (adminUtil.usables.usableGetFeed === false) {
        httpErrorView.serviceUnavailable(data, response);
        return;
    }

    if (data.method === 'GET') {
        const token = cookieParser.parse(data).token;

        jwt.verify(token, process.env.AUTH_TOKEN, (err, decoded) => { // check if user is authenticated or not
            if (err) { // user is anonymous
                resourceModel.find( // get resources based on the default domains and websites
                    { domains: { $in: preferences.default_domains }, website: { $in: preferences.default_websites } },
                    (err, resources) => {
                        if (err) { // something went wrong, perhaps an internal error
                            responder.status(response, 500);
                        } else { // found the requested resources
                            responder.content(response, resources);
                        }
                    }
                );
            } else { // user is authenticated
                userModel.findOne( // get user's preferred domains and websites
                    { username: decoded.userName }, 'preferredDomains preferredSites', (err, user) => {
                        if (err) { // something went wrong, perhaps an internal error
                            responder.status(response, 500);
                        } else { // found the requested domains and websites
                            resourceModel.find( // get resources 
                                { domains: { $in: user.preferredDomains }, website: { $in: user.preferredSites } },
                                (err, resources) => { // get resources based on their selection of domains and websites
                                    if (err) { // something went wrong, perhaps an internal error
                                        responder.status(response, 500);
                                    } else { // found the requested resources
                                        responder.content(response, resources); 
                                    }
                                }
                            );
                        }
                    }
                );
            }
        });
    } else { // not a valid method, bad request
        responder.status(response, 400);
    }
}

function getPreferences(data, response) {
    if (adminUtil.usables.usableGetPreferences === false) {
        httpErrorView.serviceUnavailable(data, response);
        return;
    }

    if (data.method === 'GET') {
        const token = cookieParser.parse(data).token

        jwt.verify(token, process.env.AUTH_TOKEN, (err, decoded) => {
            if (err) { // user is anonymous
                const default_domains = preferences.default_domains;
                const default_websites = preferences.default_websites;
                const content = {
                    'websites': default_websites,
                    'domains': default_domains
                };

                responder.content(response, content);
            } else { // user is authenticated
                if (decoded) {
                    const username = decoded.userName;

                    userModel.findOne({ username: username }, 'preferredSites preferredDomains', (err, user) => {
                        if (err) {
                            responder.status(response, 500);
                        } else {
                            if (user) {
                                const websites = user.preferredSites;
                                const domains = user.preferredDomains;
                                const content = {
                                    'websites': websites,
                                    'domains': domains
                                };

                                responder.content(response, content);
                            } else {
                                responder.status(response, 401);
                            }
                        }
                    })
                } else {
                    responder.status(response, 500);
                }
            }
        });
    } else {
        responder.status(response, 400);
    }
}

function setPreferences(data, response) {
    if (adminUtil.usables.usableSetPreferences === false) {
        httpErrorView.serviceUnavailable(data, response);
        return;
    }

    if (data.method === 'PUT') {
        try {
            const token = cookieParser.parse(data).token
            const values = JSON.parse(data.payload);
            const websites = values.websites;
            const domains = values.domains;

            jwt.verify(token, process.env.AUTH_TOKEN, (err, decoded) => {
                if (err) {
                    responder.status(response, 401);
                }
                else {
                    if (decoded) {
                        const username = decoded.userName;

                        userModel.findOne(
                            { username: username },
                            (err, user) => {
                                if (err) {
                                    responder.status(response, 500);
                                } else {
                                    if (user) {
                                        user.preferredDomains = inputValidator.domains(domains);
                                        user.preferredSites = inputValidator.websites(websites);

                                        user.save(err => {
                                            if (err) {
                                                responder.status(response, 500);
                                            } else {
                                                responder.status(response, 200);
                                            }
                                        });
                                    } else {
                                        responder.status(response, 401);
                                    }
                                }
                            }
                        );
                    } else {
                        responder.status(response, 401);
                    }
                }
            });
        } catch {
            responder.status(response, 400);
        }

    } else {
        responder.status(response, 400);
    }
}

module.exports = { register, login, deleteAccount, getFeed, getPreferences, setPreferences };
