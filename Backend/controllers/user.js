const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const userModel = require('../models/user');
const httpErrorView = require('../views/http_error');
const success = require('./success');

function register(data, response) {
    if (data.method === 'POST') {
        try {
            const values = JSON.parse(data.payload);
            const username = values.username;
            const password = values.password;

            userModel.findOne({ username: username }, (err, user) => {
                if (err) {
                    httpErrorView.internalServerError(data, response);
                } else {
                    if (user) {
                        success.success(response, 409);
                    } else {
                        const saltRounds = 13;

                        bcrypt.hash(password, saltRounds, (err, hash) => {
                            if (err) {
                                httpErrorView.internalServerError(data, response);
                            } else {
                                const User = new userModel({
                                    _id: mongoose.Types.ObjectId(),
                                    username: username,
                                    password: hash,
                                });
                                User.save((err, result) => {
                                    if (err) {
                                        httpErrorView.internalServerError(data, response);
                                    } else {
                                        success.success(response, 200);
                                    }
                                });
                            }
                        });
                    }
                }
            });
        } catch {
            httpErrorView.badRequest(data, response);
        }

    } else {
        httpErrorView.badRequest(data, response);
    }
}

function login(data, response) {
    if (data.method === 'POST') {
        try {
            const values = JSON.parse(data.payload);
            const username = values.username;
            const password = values.password;

            userModel.findOne({ username: username }, (err, user) => {
                if (err) {
                    httpErrorView.internalServerError(data, response);
                } else {
                    if (user) {
                        bcrypt.compare(password, user.password, (err, result) => {
                            if (err) {
                                httpErrorView.internalServerError(data, response);
                            } else {
                                if (result) {
                                    success.success(response, 200);
                                } else {
                                    success.success(response, 409);
                                }
                            }
                        });
                    } else {
                        success.success(response, 401);
                    }
                }
            });
        } catch{
            httpErrorView.badRequest(data, response);
        }
    } else {
        httpErrorView.badRequest(data, response);
    }
}

function logout(data, response) {
    response.end();
}

function deleteAccount(data, response) {
    response.end();
}

function getFeed(data, response) {
    response.end();
}

function getPreferences(data, response) {
    response.end();
}

function setPreferences(data, response) {
    response.end();
}

module.exports = { register, login, logout, deleteAccount, getFeed, getPreferences, setPreferences };