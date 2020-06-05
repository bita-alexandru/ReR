const http = require('http');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const userModel = require('../models/user');
const feedView = require('../views/feed');
const preferencesView = require('../views/preferences');
const accountView = require('../views/account');
const httpErrorView = require('../views/http_error');
const success = require('../controllers/success');

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

function account(data, response) {

    accountView.account(data, response);
}

function deleteAccount(data, response) {
    response.end();
}

function feed(data, response) {
    feedView.feed(data, response);
}

function preferences(data, response) {
    preferencesView.preferences(data, response);
}

module.exports = { register, login, logout, account, deleteAccount, feed, preferences };
