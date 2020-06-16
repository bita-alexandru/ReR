const fs = require('fs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const resourceModel = require('../models/resource');
const responder = require('./responder');
const parser = require('./parser');
const inputValidator = require('./input_validator');

let usables = {
    // these variables indicate if the corresponding endpoints are avaiable to the client
    usableFeed: true,
    usablePreferences: true,
    usableAccount: true,
    usableGetFeed: true,
    usableGetPreferences: true,
    usableSetPreferences: true,
    usableRegister: true,
    usableLogin: true,
    usableDeleteAccount: true,
    usableLogout: true,
    usableGetRSS: true,
    
    // these functions set the variables above according to data.payload.option
    toggleFeed: function (data, response) {
        isAdmin(data, result => {
            if (data.method !== 'POST') {
                responder.status(response, 400);
                return;
            }
            if (result === 200) {
                try {
                    const values = JSON.parse(data.payload);

                    if (inputValidator.badStrings(values, ['option'])) {
                        responder.status(response, 400);
                        return;
                    }

                    const option = values.option.toLowerCase();
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
                    const values = JSON.parse(data.payload);

                    if (inputValidator.badStrings(values, ['option'])) {
                        responder.status(response, 400);
                        return;
                    }

                    const option = values.option.toLowerCase();
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
                    const values = JSON.parse(data.payload);

                    if (inputValidator.badStrings(values, ['option'])) {
                        responder.status(response, 400);
                        return;
                    }

                    const option = values.option.toLowerCase();
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
                    const values = JSON.parse(data.payload);

                    if (inputValidator.badStrings(values, ['option'])) {
                        responder.status(response, 400);
                        return;
                    }

                    const option = values.option.toLowerCase();
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
                    const values = JSON.parse(data.payload);

                    if (inputValidator.badStrings(values, ['option'])) {
                        responder.status(response, 400);
                        return;
                    }

                    const option = values.option.toLowerCase();
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
                    const values = JSON.parse(data.payload);

                    if (inputValidator.badStrings(values, ['option'])) {
                        responder.status(response, 400);
                        return;
                    }

                    const option = values.option.toLowerCase();
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
                    const values = JSON.parse(data.payload);

                    if (inputValidator.badStrings(values, ['option'])) {
                        responder.status(response, 400);
                        return;
                    }

                    const option = values.option.toLowerCase();
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
                    const values = JSON.parse(data.payload);

                    if (inputValidator.badStrings(values, ['option'])) {
                        responder.status(response, 400);
                        return;
                    }

                    const option = values.option.toLowerCase();
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
                    const values = JSON.parse(data.payload);

                    if (inputValidator.badStrings(values, ['option'])) {
                        responder.status(response, 400);
                        return;
                    }

                    const option = values.option.toLowerCase();
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
    },

    toggleLogout: function (data, response) {
        isAdmin(data, result => {
            if (data.method !== 'POST') {
                responder.status(response, 400);
                return;
            }
            if (result === 200) {
                try {
                    const values = JSON.parse(data.payload);

                    if (inputValidator.badStrings(values, ['option'])) {
                        responder.status(response, 400);
                        return;
                    }

                    const option = values.option.toLowerCase();
                    if (option === '1' || option === 'yes' || option === 'true') {
                        usables.usableLogout = true;
                    } else if (option === '0' || option === 'no' || option === 'false') {
                        usables.usableLogout = false;
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

    toggleGetRSS: function (data, response) {
        isAdmin(data, result => {
            if (data.method !== 'POST') {
                responder.status(response, 400);
                return;
            }
            if (result === 200) {
                try {
                    const values = JSON.parse(data.payload);

                    if (inputValidator.badStrings(values, ['option'])) {
                        responder.status(response, 400);
                        return;
                    }

                    const option = values.option.toLowerCase();
                    if (option === '1' || option === 'yes' || option === 'true') {
                        usables.usableGetRSS = true;
                    } else if (option === '0' || option === 'no' || option === 'false') {
                        usables.usableGetRSS = false;
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

        jwt.verify(token, process.env.AUTH_TOKEN, (err, decoded) => {  // check if user is authenticated or not
            if (err) {  // user is not authenticated
                callback(401);
            } else {
                if (!decoded) { // something went wrong, perhaps an internal error
                    callback(500);
                } else { // user is authenticatd
                    if (decoded.userName === 'admin') { // user is admin
                        callback(200);
                    } else { // user is not admin
                        callback(401);
                    }
                }
            }
        });
    } catch { // not a valid cookie
        callback(400);
    }
}

function exportUsers(data, response) {
    isAdmin(data, result => {
        if (data.method !== 'GET') { 
            responder.status(response, 400);
            return;
        }
        if (result === 200) { // user is admin
            userModel.find( // get all users
                null,
                null,
                { sort: { created: -1 } },
                (err, resources) => {
                    if (err) { // something went wrong, perhaps an internal error
                        responder.status(response, 500);
                    } else {
                        const date = new Date();
                        const file = 'User_' + date.getFullYear() + '_' + (date.getMonth() + 1) + '_' + date.getDate() + '.json';

                        fs.writeFile(
                            file,
                            JSON.stringify(resources, null, ' '), err => {
                                if (err) { // something went wrong, perhaps an internal error
                                    responder.status(response, 500);
                                } else { 
                                    responder.status(response, 200);
                                }
                            });
                    }
                }
            );
        } else { // the user isn't admin, unauthorized
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
        if (result === 200) { // user is admin
            resourceModel.find( // get all resources
                null,
                null,
                { sort: { published: -1 } },
                (err, resources) => {
                    if (err) { // something went wrong, perhaps an internal error
                        responder.status(response, 500);
                    } else {
                        const date = new Date();
                        const file = 'Resources_' + date.getFullYear() + '_' + (date.getMonth() + 1) + '_' + date.getDate() + '.json';

                        fs.writeFile(
                            file,
                            JSON.stringify(resources, null, ' '), err => {
                                if (err) { // something went wrong, perhaps an internal error
                                    responder.status(response, 500);
                                } else {
                                    responder.status(response, 200);
                                }
                            });
                    }
                }
            );
        } else { // user isn't admin, unauthorized
            responder.status(response, result);
        }
    });
}

function manageUser(data, response) {
    isAdmin(data, result => {
        if (result === 200) {
            if (data.method === 'POST') { // create a new user
                try {
                    const values = JSON.parse(data.payload);

                    if (inputValidator.badStrings(values, ['username', 'password', 'preferredDomains', 'excludedSites'])) {
                        responder.status(response, 400);
                        return;
                    }

                    const saltRounds = 13;
                    let username = values.username;
                    let password = values.password;
                    let preferredDomains = values.preferredDomains.split(',');
                    let excludedSites = values.excludedSites.split(',');

                    bcrypt.hash(password, saltRounds, (err, hash) => { 
                        if (err) {
                            responder.status(response, 500); 
                        } else {
                            userModel.create( 
                                {
                                    _id: mongoose.Types.ObjectId(),
                                    username: username,
                                    password: hash,
                                    preferredDomains: preferredDomains,
                                    excludedSites: excludedSites,
                                    created: new Date()
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
            } else if (data.method === 'GET') { // get a info about a user
                try {
                    const values = JSON.parse(data.payload);

                    if (inputValidator.badStrings(values, ['username'])) {
                        responder.status(response, 400);
                        return;
                    }

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
                                        if (err) { 
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

                } catch{ // payload is not a valid json 
                    responder.status(response, 400)
                }
            } else if (data.method === 'DELETE') { // delete a user
                try {
                    const values = JSON.parse(data.payload);

                    if (inputValidator.badStrings(values, ['username'])) {
                        responder.status(response, 400);
                        return;
                    }

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
            } else if (data.method === 'PATCH') { // updating user.preferredDomains and user.excludesSites for user.username 
                try {
                    const values = JSON.parse(data.payload);

                    if (inputValidator.badStrings(values, ['username', 'preferredDomains', 'excludedSites'])) {
                        responder.status(response, 400);
                        return;
                    }

                    const username = values.username;
                    const preferredDomains = values.preferredDomains;
                    const excludedSites = values.excludedSites;

                    userModel.updateOne( // 
                        { username: username },
                        {
                            preferredDomains: values.preferredDomains.split(','),
                            excludedSites: values.excludedSites.split(',')
                        },
                        err => {
                            if (err) { // something went wrong, perhaps an internal error
                                responder.status(response, 500);
                            } else {
                                responder.status(response, 200);
                            }
                        });
                } catch{ // payload is not a valid json
                    responder.status(response, 400);
                }
            } else {
                responder.status(response, 400);
            }
        } else { // user isn't admin, unauthorized
            responder.status(response, result);
        }
    });
}

function manageResource(data, response) {
    isAdmin(data, result => {
        if (result === 200) {
            if (data.method === 'POST') { // create a new resource
                try {
                    const values = JSON.parse(data.payload);

                    if (inputValidator.badStrings(values, ['title', 'description', 'domains', 'url', 'website', 'image'])) {
                        responder.status(response, 400);
                        return;
                    }

                    resourceModel.create( // create and store a new resource
                        {
                            _id: mongoose.Types.ObjectId(),
                            title: values.title,
                            description: values.description,
                            domains: values.domains.split(','),
                            url: values.url,
                            website: values.website,
                            image: values.image,
                            created: new Date()
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
            } else if (data.method === 'GET') { // get all the resource which is associated with a domain/domains, a website/websites or an url
                try {
                    const values = JSON.parse(data.payload);
                    let domains;
                    let websites;

                    if (typeof (values.url) === 'string') {
                        const source = values.url;

                        resourceModel.findOne(
                            { url: source },
                            (err, resource) => {
                                if (err) {
                                    responder.status(response, 500);
                                } else {
                                    responder.content(response, resource);
                                }
                            }
                        );
                    } else if (typeof (values.domains) === 'string' && typeof (values.website) === 'string') {
                        domains.split(',');
                        websites.split(',');

                        resourceModel.find(
                            {
                                domains: { $in: domains },
                                website: { $in: websites }
                            },
                            (err, resources) => {
                                if (err) {
                                    responder.status(response, 500);
                                } else {
                                    responder.content(response, resources);
                                }
                            }
                        );
                    } else if (typeof (values.domains) === 'string') {
                        domains.split(',');

                        resourceModel.find(
                            {
                                domains: { $in: domains }
                            },
                            (err, resources) => {
                                if (err) {
                                    responder.status(response, 500);
                                } else {
                                    responder.content(response, resources);
                                }
                            }
                        );
                    } else if (typeof (values.website) === 'string') {
                        websites.split(',');

                        resourceModel.find(
                            {
                                website: { $in: websites }
                            },
                            (err, resources) => {
                                if (err) {
                                    responder.status(response, 500);
                                } else {
                                    responder.content(response, resources);
                                }
                            }
                        );
                    } else {
                        responder.status(responder, 400);
                    }
                } catch {
                    responder.status(responder, 400);
                }
            } else if (data.method == 'PATCH') { // updating a resource which is associated with an url
                try {
                    const values = JSON.parse(data.payload)

                    if (inputValidator.badStrings(values, ['newUrl', 'title', 'description', 'domains', 'url', 'website', 'image'])) {
                        responder.status(response, 400);
                        return;
                    }

                    const source = values.url;
                    const newUrl = values.newUrl;

                    resourceModel.updateOne(
                        { url: source },
                        {
                            title: values.title,
                            description: values.description,
                            domains: values.domains.split(','),
                            url: newUrl,
                            website: values.website,
                            image: values.image,
                            created: values.created
                        },
                        err => {
                            if (err) {
                                responder.status(response, 500);
                            } else {
                                responder.status(response, 200);
                            }
                        }
                    );
                } catch {
                    responder.status(response, status);
                }
            } else if (data.method == 'DELETE') { // deleting a resource which is associated with an url
                try {
                    const values = JSON.parse(data.payload)

                    if (inputValidator.badStrings(values, ['url'])) {
                        responder.status(response, 400);
                        return;
                    }

                    const source = values.url;

                    resourceModel.deleteOne(
                        { url: source },
                        err => {
                            if (err) {
                                responder.status(response, 500);
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