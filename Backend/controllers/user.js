const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const rss = require('rss');
const userModel = require('../models/user');
const resourceModel = require('../models/resource');
const responder = require('../util/responder');
const preferences = require('../util/available_preferences');
const inputValidator = require('../util/input_validator');
const adminUtil = require('../util/admin');
const parser = require('../util/parser');
const indexView = require('../views/index');
const httpErrorView = require('../views/http_error');

function isAuthenticated(data, response) { // check if user is authenticated
    if (data.method === 'GET') {
        const token = parser.parseCookie(data).token;

        jwt.verify(token, process.env.AUTH_TOKEN, (err, decoded) => {
            if (err) {
                responder.failure(response);
            } else {
                const content = {
                    'success': true,
                    'username': decoded.userName
                };

                responder.content(response, content);
            }
        });
    } else {
        responder.status(response, 400);
    }
}

function register(data, response) {
    if (adminUtil.usables.usableRegister === false) {
        httpErrorView.serviceUnavailable(data, response);
        return;
    }

    if (data.method === 'POST') {
        try {
            const values = JSON.parse(data.payload);

            if (inputValidator.badStrings(values, ['username', 'password', 'confirmPassword'])) {
                responder.status(response, 400);
                return;
            }

            const username = values.username;
            const password = values.password;
            const confirmPassword = values.confirmPassword;

            if (inputValidator.username(username) === false ||
                inputValidator.password(password) === false ||
                confirmPassword !== password) {
                responder.status(response, 400);
                return;
            }
            if (password !== confirmPassword) {
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
                                            created: new Date()
                                        },
                                        err => {
                                            if (err) { // something went wrong, perhaps an internal error
                                                responder.status(response, 500);
                                            } else { // all good
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

            if (inputValidator.badStrings(values, ['username', 'password'])) {
                responder.status(response, 400);
                return;
            }

            const username = values.username;
            const password = values.password;

            userModel.findOne({ username: username }, '_id username password', (err, user) => { // check if the username is in the database
                if (err) { // // something went wrong, perhaps an internal error 
                    responder.status(response, 500);
                } else {
                    if (user) { // found a user with the username
                        bcrypt.compare(password, user.password, (err, result) => {  /// check if the password matches the password from database
                            if (err) { // something went wrong, perhaps an internal error 
                                responder.status(response, 500);
                            } else {
                                if (result) { // password and username matches
                                    const token = jwt.sign({ //create an auth-token
                                        userId: user._id,
                                        userName: user.username
                                    },
                                        process.env.AUTH_TOKEN,
                                        {
                                            expiresIn: '2d'
                                        }
                                    );
                                    // all god, user is logged in
                                    response.setHeader('set-cookie', `token=${token}; HttpOnly; Secure`);
                                    responder.status(response, 200);
                                } else { // password  doesn't match, unauthorized 
                                    responder.status(response, 401);
                                }
                            }
                        });
                    } else { // username doesn't match, unauthorized 
                        responder.status(response, 401);
                    }
                }
            });
        } catch{ // payload is not a valid json
            responder.status(response, 400);
        }
    } else { // not a valid method , bad request
        responder.status(response, 400);
    }
}

function logout(data, response) { // unset users' cookie
    if (adminUtil.usables.usableLogout === false) {
        httpErrorView.serviceUnavailable(data, response);
        return;
    }

    if (data.method === 'GET') {
        response.setHeader('set-cookie', `token=null; HttpOnly; Secure`);
        indexView.feed(data, response);
    } else {
        responder.status(response, 400);
    }
}

function deleteAccount(data, response) {
    if (adminUtil.usables.usableDeleteAccount === false) {
        httpErrorView.serviceUnavailable(data, response);
        return;
    }

    if (data.method === 'POST') {
        try {
            const values = JSON.parse(data.payload);

            if (inputValidator.badStrings(values, ['password'])) {
                responder.status(response, 400);
                return;
            }

            const token = parser.parseCookie(data).token;
            const password = values.password;

            jwt.verify(token, process.env.AUTH_TOKEN, (err, decoded) => { // check if user is authenticated or not
                if (err) { // user is not authenticated 
                    responder.status(response, 401);
                } else { // user is authenticated
                    if (decoded) {
                        const username = decoded.userName;
                        userModel.findOne({ username: username }, 'password', (err, user) => { // check if the username is in the database
                            if (err) { // something went wrong, perhaps an internal error
                                responder.status(response, 500);
                            } else {
                                if (user) { // username is in the database
                                    bcrypt.compare(password, user.password, (err, result) => { // check if the password matches the password from database 
                                        if (err) { // something went wrong, perhaps an internal error
                                            responder.status(response, 500);
                                        } else {
                                            if (result) { // passwords matches
                                                user.deleteOne({ username: username }, (err) => {
                                                    if (err) { // something went wrong, perhaps an internal error
                                                        responder.status(response, 500);
                                                    } else {
                                                        response.setHeader('set-cookie', `token=null; HttpOnly; Secure`);
                                                        responder.status(response, 200);
                                                    }
                                                })
                                            } else { // password is wrong, unauthorized
                                                responder.status(response, 401);
                                            }
                                        }
                                    });
                                } else { // username is wrong, unauthorized
                                    responder.status(response, 401);
                                }
                            }
                        });
                    } else { // decodation failed(unprobable)
                        responder.status(response, 401);
                    }
                }
            });
        } catch{ // payload is not a valid json
            responder.status(response, 400);
        }
    } else { // not a valid method, bad request
        responder.status(response, 400);
    }
}

function getFeed(data, response) {
    if (adminUtil.usables.usableGetFeed === false) {
        httpErrorView.serviceUnavailable(data, response);
        return;
    }

    if (data.method === 'GET') {
        const token = parser.parseCookie(data).token;

        jwt.verify(token, process.env.AUTH_TOKEN, (err, decoded) => { // check if user is authenticated or not
            if (err) { // user is anonymous
                resourceModel.find( // get resources based on the default domains and websites
                    { domains: { $in: preferences.default_domains } },
                    null,
                    { limit: 30, sort: { published: -1 } },
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
                    { username: decoded.userName }, 'preferredDomains excludedSites', (err, user) => {
                        if (err) { // something went wrong, perhaps an internal error
                            responder.status(response, 500);
                        } else { // found the requested domains and websites
                            if (user) {
                                resourceModel.find( // get resources 
                                    { domains: { $in: user.preferredDomains }, website: { $nin: user.excludedSites } },
                                    null,
                                    { limit: 30, sort: { published: -1 } },
                                    (err, resources) => { // get resources based on their selection of domains and websites
                                        if (err) { // something went wrong, perhaps an internal error
                                            responder.status(response, 500);
                                        } else { // found the requested resources
                                            responder.content(response, resources);
                                        }
                                    }
                                );
                            } else {
                                responder.status(response, 401);
                            }
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
        const token = parser.parseCookie(data).token

        jwt.verify(token, process.env.AUTH_TOKEN, (err, decoded) => { // check if user is authenticated or not
            if (err) { // user is anonymous

                const content = {
                    'domains': preferences.default_domains,
                    'allDomains': preferences.all_domains
                };

                responder.content(response, content);
            } else { // user is authenticated
                if (decoded) {
                    const username = decoded.userName;

                    userModel.findOne({ username: username }, 'preferredDomains excludedSites', (err, user) => { // search in the database preferredDomains and excludedSites for username
                        if (err) { // something went wrong, perhaps an internal error
                            responder.status(response, 500);
                        } else {
                            if (user) {
                                const content = {
                                    'domains': user.preferredDomains,
                                    'allDomains': preferences.all_domains,
                                    'websites': user.excludedSites
                                };

                                responder.content(response, content);
                            } else { // unauthorized 
                                responder.status(response, 401);
                            }
                        }
                    })
                } else { // something went wrong, perhaps an internal error
                    responder.status(response, 500);
                }
            }
        });
    } else { // not a valid method, bad request
        responder.status(response, 400);
    }
}

function setPreferences(data, response) {
    if (adminUtil.usables.usableSetPreferences === false) {
        httpErrorView.serviceUnavailable(data, response);
        return;
    }

    if (data.method === 'POST') {
        try {
            const token = parser.parseCookie(data).token
            const values = JSON.parse(data.payload);

            if (inputValidator.badStrings(values, ['domains', 'websites'])) {
                responder.status(response, 400);
                return;
            }

            let domains = domains = values.domains.split('_');
            let websites = websites = values.websites.split('_');

            jwt.verify(token, process.env.AUTH_TOKEN, (err, decoded) => { // check if user is authenticated or not
                if (err) { // user is not authenticated, unauthorized
                    responder.status(response, 401);
                }
                else {
                    if (decoded) {
                        const username = decoded.userName;

                        userModel.updateOne( // update the database with the new domains and website for the user 
                            { username: username },
                            {
                                preferredDomains: inputValidator.domains(domains),
                                excludedSites: websites
                            },
                            err => {
                                if (err) { // something went wrong, perhaps an internal error 
                                    responder.status(response, 500);
                                } else { // all good
                                    responder.status(response, 200);
                                };
                            }
                        );
                    } else { // unauthorized
                        responder.status(response, 401);
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

function makeRSS(response, resources) {
    let feed = new rss({
        'title': 'TITLU',
        'description': 'DESCRIERE',
        'feed_url': 'https://site.com/rss',
        'site_url': 'https://site.com',
        'image_url': 'https://img.icons8.com/officel/80/000000/rss.png',
        'pubDate': new Date(),
        'ttl': 1
    });

    for (let i = 0; i < resources.length; i++) {
        const resource = resources[i];

        feed.item({
            title: resource.title,
            description: resource.description,
            url: resource.url,
            guid: resource._id.toHexString(),
            categories: resource.categories,
            author: resource.website,
            date: resource.published
        });
    }

    const xml = feed.xml({ indent: true });

    responder.rss(response, xml);
}

function getRSS(data, response) {
    if (adminUtil.usables.usableGetFeed === false) {
        httpErrorView.serviceUnavailable(data, response);
        return;
    }

    if (data.method === 'GET') {
        const token = parser.parseCookie(data).token;

        jwt.verify(token, process.env.AUTH_TOKEN, (err, decoded) => { // check if user is authenticated or not
            if (err) { // user is anonymous
                resourceModel.find( // get resources based on the default domains and websites
                    { domains: { $in: preferences.default_domains } },
                    null,
                    { limit: 30, sort: { published: -1 } },
                    (err, resources) => {
                        if (err) { // something went wrong, perhaps an internal error
                            responder.status(response, 500);
                        } else { // found the requested resources
                            makeRSS(response, resources);
                        }
                    }
                );
            } else { // user is authenticated
                userModel.findOne( // get user's preferred domains and websites
                    { username: decoded.userName }, 'preferredDomains excludedSites', (err, user) => {
                        if (err) { // something went wrong, perhaps an internal error
                            responder.status(response, 500);
                        } else { // found the requested domains and websites
                            resourceModel.find( // get resources 
                                { domains: { $in: user.preferredDomains }, website: { $nin: user.excludedSites } },
                                null,
                                { sort: { published: -1 } },
                                (err, resources) => { // get resources based on their selection of domains and websites
                                    if (err) { // something went wrong, perhaps an internal error
                                        responder.status(response, 500);
                                    } else { // found the requested resources
                                        makeRSS(response, resources);
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

module.exports = { isAuthenticated, register, login, logout, deleteAccount, getFeed, getPreferences, setPreferences, getRSS };