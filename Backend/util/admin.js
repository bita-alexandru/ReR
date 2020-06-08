const fs = require('fs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const resourceModel = require('../models/resource');
const responder = require('./responder');
const preferences = require('../util/available_preferences')
const parser = require('./parser');

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
            if (data.method !== 'POST') {
                responder.status(response, 400);
                return;
            }
            if (result === 200) {
                try {
                    const option = JSON.parse(data.queryString).option.toLowerCase();
                    if (option === '1' || option === 'yes' || option === 'true') {
                        usables.usableFeed = true;
                    } else if (option === '0' || option === 'no' || option === 'false') {
                        usables.usableFeed = false;
                    }
                    responder.status(response, result);
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
            if (data.method !== 'POST') {
                responder.status(response, 400);
                return;
            }
            if (result === 200) {
                try {
                    const option = JSON.parse(data.queryString).option.toLowerCase();
                    if (option === '1' || option === 'yes' || option === 'true') {
                        usables.usablePreferences = true;
                    } else if (option === '0' || option === 'no' || option === 'false') {
                        usables.usablePreferences = false;
                    }
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
            if (data.method !== 'POST') {
                responder.status(response, 400);
                return;
            }
            if (result === 200) {
                try {
                    const option = JSON.parse(data.queryString).option.toLowerCase();
                    if (option === '1' || option === 'yes' || option === 'true') {
                        usables.usableAccount = true;
                    } else if (option === '0' || option === 'no' || option === 'false') {
                        usables.usableAccount = false;
                    }
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
            if (data.method !== 'POST') {
                responder.status(response, 400);
                return;
            }
            if (result === 200) {
                try {
                    const option = JSON.parse(data.queryString).option.toLowerCase();
                    if (option === '1' || option === 'yes' || option === 'true') {
                        usables.usableLogin = true;
                    } else if (option === '0' || option === 'no' || option === 'false') {
                        usables.usableLogin = false;
                    }
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
            if (data.method !== 'POST') {
                responder.status(response, 400);
                return;
            }
            if (result === 200) {
                try {
                    const option = JSON.parse(data.queryString).option.toLowerCase();
                    if (option === '1' || option === 'yes' || option === 'true') {
                        usables.usableRegister = true;
                    } else if (option === '0' || option === 'no' || option === 'false') {
                        usables.usableRegister = false;
                    }
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
            if (data.method !== 'POST') {
                responder.status(response, 400);
                return;
            }
            if (result === 200) {
                try {
                    const option = JSON.parse(data.queryString).option.toLowerCase();
                    if (option === '1' || option === 'yes' || option === 'true') {
                        usables.usableDeleteAccount = true;
                    } else if (option === '0' || option === 'no' || option === 'false') {
                        usables.usableDeleteAccount = false;
                    }
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
            if (data.method !== 'POST') {
                responder.status(response, 400);
                return;
            }
            if (result === 200) {
                try {
                    const option = JSON.parse(data.queryString).option.toLowerCase();
                    if (option === '1' || option === 'yes' || option === 'true') {
                        usables.usableGetFeed = true;
                    } else if (option === '0' || option === 'no' || option === 'false') {
                        usables.usableGetFeed = false;
                    }
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
            if (data.method !== 'POST') {
                responder.status(response, 400);
                return;
            }
            if (result === 200) {
                try {
                    const option = JSON.parse(data.queryString).option.toLowerCase();
                    if (option === '1' || option === 'yes' || option === 'true') {
                        usables.usableGetPreferences = true;
                    } else if (option === '0' || option === 'no' || option === 'false') {
                        usables.usableGetPreferences = false;
                    }
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
            if (data.method !== 'POST') {
                responder.status(response, 400);
                return;
            }
            if (result === 200) {
                try {
                    const option = JSON.parse(data.queryString).option.toLowerCase();
                    if (option === '1' || option === 'yes' || option === 'true') {
                        usables.usableSetPreferences = true;
                    } else if (option === '0' || option === 'no' || option === 'false') {
                        usables.usableSetPreferences = false;
                    }
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
        const token = parser.parseCookie(data)['token'];

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
        callback(400);
    }
}

function exportUsers(data, response) {
    isAdmin(data, result => {
        if (data.method !== 'GET') {
            responder.status(response, 400);
            return;
        }
        if (result === 200) {
            userModel.find( // get all users
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
            responder.status(response, result);
        }
    });
}

function exportResources(data, response) {
    isAdmin(data, result => {
        if (data.method !== 'GET') {
            responder.status(response, 400);
            return;
        }
        if (result === 200) {
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
            responder.status(response, result);
        }
    });
}

function manageUser(data, response) {
    isAdmin(data, result => {
        if (result === 200) {
            if (data.method === 'POST') {
                try {
                    const values = JSON.parse(data.queryString);
                    const password = values.password;
                    const saltRounds = 13;

                    bcrypt.hash(password, saltRounds, (err, hash) => { // encrypt the password
                        if (err) {
                            responder.status(response, 500); // something went wrong, perhaps an internal error
                        } else {
                            const date = new Date();
                            const today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

                            userModel.create( // create and store a new user
                                {
                                    _id: mongoose.Types.ObjectId(),
                                    username: values.username,
                                    password: hash,
                                    preferredDomains: preferences.default_domains,
                                    preferredSites: preferences.default_websites,
                                    date: today
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
                    const values = JSON.parse(data.queryString);
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
                    const values = JSON.parse(data.queryString);
                    const username = values.username;

                    userModel.deleteOne({ username: username }, err => {
                        if (err) {
                            responder.status(response, 500);
                        } else {
                            responder.status(response, 200);
                        }
                    }
                    );
                } catch{
                    responder.status(response, 400);
                }
            } else if (data.method === 'PATCH') {
                try {
                    const values = JSON.parse(data.queryString);
                    const username = values.username;

                    userModel.updateOne(
                        { username: username },
                        {
                            preferredDomains: typeof (values.preferredDomains) ? values.preferredDomains : preferredDomains,
                            preferredSites: typeof (values.preferredSites) ? values.preferredSites : preferredSites
                        },
                        err => {
                            if (err) {
                                responder.status(response, 500);
                            } else {
                                responder.status(response, 200);
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
                    const values = JSON.parse(data.queryString);

                    resourceModel.create( // create and store a new resource
                        {
                            _id: mongoose.Types.ObjectId(),
                            title: typeof (values.title) ? values.title : title,
                            description: typeof (values.description) ? values.description : description,
                            domains: typeof (values.domains) ? values.domains.split(',') : domains,
                            url: typeof (values.url) ? values.url : source,
                            website: typeof (values.website) ? values.website : website,
                            image: typeof (values.image) ? values.image : image,
                            date: typeof (values.date) ? values.date : date
                        },
                        (err, resource) => {
                            if (err) { // something went wrong, perhaps an internal error
                                responder.status(response, 400);
                            } else { // resource created & stored successfully
                                responder.content(response, resource);
                            }
                        }
                    );
                } catch {
                    responder.status(response, 400);
                }
            } else if (data.method === 'GET') {
                try {
                    const values = JSON.parse(data.queryString);
                    let domains;
                    let website;

                    if (typeof (values.url)) {
                        const source = values.url;

                        resourceModel.findOne(
                            { url: source },
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

                    if (typeof (values.domains)) {
                        domains = preferences.all_domains;
                    } else {
                        domains.split(',');
                    }
                    if (typeof (values.website)) {
                        website = preferences.all_websites;
                    } else {
                        domains.split(',');
                    }

                    resourceModel.find(
                        {
                            domains: { $in: preferences.all_domains },
                            website: { $in: preferences.all_websites }
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
            } else if (data.method == 'PATCH') {
                try {
                    const values = JSON.parse(data.queryString)
                    const source = values.url;
                    const newUrl = values.newUrl;

                    resourceModel.updateOne(
                        { url: source },
                        {
                            url: typeof (newUrl) ? newUrl : source,
                            title: typeof (values.title) ? values.title : title,
                            description: typeof (values.description) ? values.description : description,
                            domains: typeof (values.domains) ? values.domains.split(',') : domains,
                            website: typeof (values.website) ? values.website : website,
                            image: typeof (values.image) ? values.image : image,
                            date: typeof (values.date) ? values.date : date
                        },
                        err => {
                            console.log(1);
                            if (err) {
                                responder.status(repsonse, 500);
                            } else {
                                responder.status(response, 200);
                            }
                        }
                    );
                } catch {
                    responder.status(response, status);
                }
            } else if (data.method == 'DELETE') {
                try {
                    const values = JSON.parse(data.queryString)
                    const source = values.url;

                    resourceModel.deleteOne(
                        { url: source },
                        err => {
                            if (err) {
                                responder.status(repsonse, 500);
                            } else {
                                responder.status(response, 200);
                            }
                        }
                    );
                } catch {
                    responder.status(response, status);
                }
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