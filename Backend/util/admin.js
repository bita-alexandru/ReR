const fs = require('fs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const resourceModel = require('../models/resource');
const responder = require('./responder');
const preferences = require('../util/available_preferences')
const cookieParser = require('../util/cookie_parser');

let usables = {
    usableFeed: true,
    usablePreferences: true,
    usableAccount: true,
    usableGetFeed: true,
    usableGetPreferences: true,
    usableSetPreferences: true,
    usableRegister: true,
    usableLogin: true,
    usableDeleteAccount: true,

    toggleFeed: function (data, response) {
        isAdmin(data, result => {
            if (result === 200) {
                try {
                    const option = JSON.parse(data.payload).option;
                    usables.usableFeed = typeof (option) === 'boolean' ? option : (result = 400);
                    responder.status(response, result);
                    console.log('admin' + usables.usableFeed);
                } catch {
                    responder.status(response, 400);
                }
            } else {
                responder.status(response, result);
            }
        });
    },

    togglePreferences: function (data, response) {
        isAdmin(data, result => {
            if (result === 200) {
                try {
                    const option = JSON.parse(data.payload).option;
                    usables.usablePreference = typeof (option) === 'boolean' ? option : (result = 400);
                    responder.status(response, result);
                } catch {
                    responder.status(response, 400);
                }
            } else {
                responder.status(response, result);
            }
        });
    },

    toggleAccount: function (data, response) {
        isAdmin(data, result => {
            if (result === 200) {
                try {
                    const option = JSON.parse(data.payload).option;
                    usables.usableAccount = typeof (option) === 'boolean' ? option : (result = 400);
                    responder.status(response, result);
                } catch {
                    responder.status(response, 400);
                }
            } else {
                responder.status(response, result);
            }
        });
    },

    toggleLogin: function (data, response) {
        isAdmin(data, result => {
            if (result === 200) {
                try {
                    const option = JSON.parse(data.payload).option;
                    usables.usableLogin = typeof (option) === 'boolean' ? option : (result = 400);
                    responder.status(response, result);
                } catch {
                    responder.status(response, 400);
                }
            } else {
                responder.status(response, result);
            }
        });
    },

    toggleRegister: function (data, response) {
        isAdmin(data, result => {
            if (result === 200) {
                try {
                    const option = JSON.parse(data.payload).option;
                    usables.usableRegister = typeof (option) === 'boolean' ? option : (result = 400);
                    responder.status(response, result);
                } catch {
                    responder.status(response, 400);
                }
            } else {
                responder.status(response, result);
            }
        });
    },

    toggleDeleteAccount: function (data, response) {
        isAdmin(data, result => {
            if (result === 200) {
                try {
                    const option = JSON.parse(data.payload).option;
                    usables.usableDeleteAccount = typeof (option) === 'boolean' ? option : (result = 400);
                    responder.status(response, result);
                } catch {
                    responder.status(response, 400);
                }
            } else {
                responder.status(response, result);
            }
        });
    },

    toggleGetFeed: function (data, response) {
        isAdmin(data, result => {
            if (result === 200) {
                try {
                    const option = JSON.parse(data.payload).option;
                    usables.usableGetFeed = typeof (option) === 'boolean' ? option : (result = 400);
                    responder.status(response, result);
                } catch {
                    responder.status(response, 400);
                }
            } else {
                responder.status(response, result);
            }
        });
    },

    toggleGetPreferences: function (data, response) {
        isAdmin(data, result => {
            if (result === 200) {
                try {
                    const option = JSON.parse(data.payload).option;
                    usables.usableGetPreferences = typeof (option) === 'boolean' ? option : (result = 400);
                    responder.status(response, result);
                } catch {
                    responder.status(response, 400);
                }
            } else {
                responder.status(response, result);
            }
        });
    },

    toggleSetPreferences: function (data, response) {
        isAdmin(data, result => {
            if (result === 200) {
                try {
                    const option = JSON.parse(data.payload).option;
                    usables.usableSetPreferences = typeof (option) === 'boolean' ? option : (result = 400);
                    responder.status(response, result);
                } catch {
                    responder.status(response, 400);
                }
            } else {
                responder.status(response, result);
            }
        });
    }
};

function isAdmin(data, callback) {
    try {
        const token = cookieParser.parse(data)['token'];
        
        jwt.verify(token, process.env.AUTH_TOKEN, (err, decoded) => {
            if (err) {
                callback(401);
            } else {
                if (!decoded) {
                    callback(500);
                } else {
                    if (decoded.userName === 'admin') {
                        callback(200);
                    } else {
                        callback(401);
                    }
                }
            }
        });
    } catch {
        console.log(3);
        callback(400);
    }
}

function exportUsers(data, response) {
    isAdmin(data, result => {
        if (result === 200) {
            if (data.method === 'GET') {
                userModel.find( // get all user
                    null,
                    { password: 0 },
                    (err, resources) => {
                        if (err) { // something went wrong, perhaps an internal error
                            responder.status(response, 500);
                        } else {
                            const date = new Date();
                            const file = 'User_' + date.getFullYear() + '_' + (date.getMonth() + 1) + '_' + date.getDate() + '.json';

                            fs.writeFile(
                                file,
                                JSON.stringify(resources, null, " "), err => {
                                    if (err) {
                                        responder.status(response, 500);
                                    } else {
                                        responder.status(response, 200);
                                    }
                                });
                        }
                    }
                );
            } else {
                responder.status(response, 400);
            }
        } else {
            responder.status(response, result);
        }
    });
}

function exportResources(data, response) {
    isAdmin(data, result => {
        if (result === 200) {
            if (data.method === 'GET') {
                resourceModel.find( // get all resources
                    (err, resources) => {
                        if (err) { // something went wrong, perhaps an internal error
                            responder.status(response, 500);
                        } else {
                            const date = new Date();
                            const file = 'Resources_' + date.getFullYear() + '_' + (date.getMonth() + 1) + '_' + date.getDate() + '.json';

                            fs.writeFile(
                                file,
                                JSON.stringify(resources, null, " "), err => {
                                    if (err) {
                                        responder.status(response, 500);
                                    } else {
                                        responder.status(response, 200);
                                    }
                                });
                        }
                    }
                );
            } else {
                responder.status(response, 400);
            }
        } else {
            responder.status(response, result);
        }
    });
}

function manageUser(data, response) {
    isAdmin(data, result => {
        if (result === 200) {
            if (data.method === 'POST') {
                try {
                    const values = JSON.parse(data.payload);
                    const password = values.password;
                    const saltRounds = 13;

                    bcrypt.hash(password, saltRounds, (err, hash) => { // encrypt the password
                        if (err) {
                            responder.status(response, 500); // something went wrong, perhaps an internal error
                        } else {
                            userModel.create( // create and store a new user
                                {
                                    _id: mongoose.Types.ObjectId(),
                                    username: values.username,
                                    password: hash,
                                    preferredDomains: preferences.default_domains,
                                    preferredSites: preferences.default_websites
                                },
                                (err, user) => {
                                    if (err) {
                                        responder.status(response, 500);
                                    } else {
                                        responder.content(response, user);
                                    }
                                }
                            );
                        }
                    });
                } catch {
                    responder.status(response, 400);
                }
            } else if (data.method === 'GET') {
                try {
                    const values = JSON.parse(data.payload);
                    const username = values.username;

                    userModel.find({ username: username }, (err, user) => {
                        if (err) {
                            responder.status(response, 500);
                        }
                        else {
                            if (user) {
                                userModel.find(
                                    { username: username },
                                    { password: 0 },
                                    (err, users) => {
                                        if (err) { // something went wrong, perhaps an internal error
                                            responder.status(response, 500);
                                        } else {
                                            responder.content(response, users);
                                        }
                                    }
                                );
                            } else {
                                responder.status(response, 401);
                            }
                        }
                    });

                } catch{
                    responder.status(response, 400)
                }
            } else if (data.method === 'DELETE') {
                try {
                    const values = JSON.parse(data.payload);
                    const username = values.username;

                    userModel.find({ username: username }, (err, user) => {
                        if (err) {
                            responder.status(response, 500);
                        } else {
                            if (user) {
                                userModel.deleteOne({ username: username }, (err) => {
                                    if (err) {
                                        responder.status(response, 500);
                                    } else {
                                        responder.status(response, 200);
                                    }
                                });
                            } else {
                                responder.status(response, 500);
                            }
                        }
                    });
                } catch{
                    responder.status(response, 400);
                }
            } else if (data.method === 'PUT') {
                try {
                    const values = JSON.parse(data.payload);
                    const username = values.username;

                    userModel.findOne({ username: username }, 'username preferredDomains preferredSites', (err, user) => {
                        if (err) {
                            responder.status(response, 500);
                        } else {
                            if (user) {
                                if (values.preferredDomains !== 'undefined') {
                                    user.preferredDomains = values.preferredDomains;
                                }
                                if (values.preferredSites !== 'undefined') {
                                    user.preferredSites = values.preferredSites;
                                }
                                user.save();
                                responder.content(response, user);
                            }
                            else {
                                responder.status(response, 500);
                            }
                        }
                    });
                } catch{
                    responder.status(response, 400);
                }
            } else {
                responder.status(response, 400);
            }
        } else {
            responder.status(response, result);
        }
    });
}

function manageResource(data, response) {
    isAdmin(data, result => {
        if (result === 200) {
            if (data.method === 'POST') {
                try {
                    const values = JSON.parse(data.payload);

                    resourceModel.create( // create and store a new resource
                        {
                            _id: mongoose.Types.ObjectId(),
                            title: values.title,
                            description: values.description,
                            domains: values.domains,
                            source: values.source,
                            website: values.website,
                            date: values.date,
                            image: values.image
                        },
                        err => {
                            if (err) { // something went wrong, perhaps an internal error
                                responder.status(response, 400);
                            } else { // resource created & stored successfully
                                responder.status(response, result);
                            }
                        }
                    );
                } catch {
                    responder.status(response, 400);
                }
            } else if (data.method === 'GET') {
                try {
                    const values = JSON.parse(data.payload);
                    let domains = values.domains;
                    let website = values.website;
                    const source = values.source;

                    if (source) {
                        resourceModel.findOne(
                            { source: source },
                            (err, resource) => {
                                if (err) {
                                    responder.status(repsonse, 500);
                                } else {
                                    responder.content(response, resource);
                                }
                            }
                        );

                        return;
                    }

                    if (!domains) {
                        domains = preferences.all_domains;
                    }
                    if (!websites) {
                        website = preferences.all_websites;
                    }

                    resourceModel.find(
                        {
                            domains: { $in: domains },
                            website: { $in: website }
                        },
                        (err, resources) => {
                            if (err) {
                                responder.status(response, 500);
                            } else {
                                responder.content(response, resources);
                            }
                        }
                    );
                } catch {
                    responder.status(responder, 400);
                }
            } else if (data.method == 'PUT') {

            } else if (data.method == 'DELETE') {

            } else {
                responder.status(response, 400);
            }
        } else {
            responder.status(response, result);
        }
    });
}

module.exports = {
    usables,
    exportUsers, exportResources,
    manageUser, manageResource,
};