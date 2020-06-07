const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const resourceModel = require('../models/resource');
const responder = require('./responder');

let usableFeed = true;
let usablePreference = true;
let usableAccount = true;
let usableGetFeed = true;
let usableGetPreferences = true;
let usableSetPreferences = true;
let usableRegister = true;
let usableLogin = true;
let usableDeleteAccount = true;

function isAdmin(data, callback) {
    try {
        const token = data.headers['auth-token'];

        jwt.verify(token, process.env.AUTH_TOKEN, (err, decoded) => {
            if (err) {
                callback(500);
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
                        (err) => {
                            if (err) { // something went wrong, perhaps an internal error
                                responder.status(response, 500);
                            } else { // resource created & stored successfully
                                responder.status(response, 200);
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

function toggleFeed(data, response) {
    try {
        usableFeed = JSON.parse(data.payload).option;
        responder.status(response, 200);
    } catch {
        responder.status(response, 500);
    }
}

function togglePreferences(data, response) {
    try {
        usablePreference = JSON.parse(data.payload).option;
        responder.status(response, 200);
    } catch {
        responder.status(response, 500);
    }
}

function toggleAccount(data, response) {
    try {
        usableAccount = JSON.parse(data.payload).option;
        responder.status(response, 200);
    } catch {
        responder.status(response, 500);
    }
}

function toggleLogin(data, response) {
    try {
        usableLogin = JSON.parse(data.payload).option;
        responder.status(response, 200);
    } catch {
        responder.status(response, 500);
    }
}

function toggleRegister(data, response) {
    try {
        usableRegister = JSON.parse(data.payload).option;
        responder.status(response, 200);
    } catch {
        responder.status(response, 500);
    }
}

function toggleDeleteAccount(data, response) {
    isAdmin(data, result => {
        if (result === 200) {
            try {
                usableDeleteAccount = JSON.parse(data.payload).option;
                responder.status(response, 200);
            } catch {
                responder.status(response, 500);
            }
        } else {
            responder.status(response, result);
        }
    });

}

function toggleGetFeed(data, response) {
    isAdmin(data, result => {
        if (result === 200) {
            try {
                usableGetFeed = JSON.parse(data.payload).option;
                responder.status(response, 200);
            } catch {
                responder.status(response, 500);
            }
        } else {
            responder.status(response, result);
        }
    });

}

function toggleGetPreferences(data, response) {
    isAdmin(data, result => {
        if (result === 200) {
            try {
                usableGetPreferences = JSON.parse(data.payload).option;
                responder.status(response, 200);
            } catch {
                responder.status(response, 500);
            }
        } else {
            responder.status(response, result);
        }
    });

}

function toggleSetPreferences(data, response) {
    isAdmin(data, result => {
        if (result === 200) {
            try {
                usableSetPreferences = JSON.parse(data.payload).option;
                responder.status(response, 200);
            } catch {
                responder.status(response, 500);
            }
        } else {
            responder.status(response, result);
        }
    });

}

module.exports = {
    usableFeed, usablePreference, usableAccount, usableGetFeed,
    usableGetPreferences, usableSetPreferences, usableRegister, usableLogin, usableDeleteAccount,
    exportUsers, exportResources,
    manageUser, manageResource,
    toggleFeed, togglePreferences, toggleAccount,
    toggleGetFeed, toggleGetPreferences, toggleSetPreferences, toggleRegister, toggleLogin, toggleDeleteAccount
};
