const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const resourceModel = require('../models/resource');
const responder = require('./responder');

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
        const token = data.headers['auth-token'];

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

}

function exportResources(data, response) {

}

function manageUser(data, response) {

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
                    console.log('invalid json')
                    responder.status(response, 400);
                }
            } else {
                console.log('not post')
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
