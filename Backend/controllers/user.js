const http = require('http');
const userModel = require('../models/user');
const mongoose = require('mongoose');
const feedView = require('../views/feed');
const preferencesView = require('../views/preferences');
const accountView = require('../views/account');
const bcrypt = require('bcrypt');


function register(data, response) {
    if (data.method === 'POST') {
        try {
            const values = JSON.parse(data.payload);
            const username = values.username;
            const password = values.password;

            userModel.findOne({ username: username }, (err, user) => {
                if (err) {
                    response.writeHead(500, { 'Content-type': 'text/html' });
                    response.end('<center><h1>500 Internal Server Error</h1></center>');
                } else {
                    if (user) {
                        response.writeHead(409, { 'Content-type': 'text/html' });
                        response.end('<center><h1>409 Conflict</h1></center>');
                    } else {
                        const saltRounds = 13;
                        bcrypt.hash(password, saltRounds, (err, hash) => {
                            if (err) {
                                console.log("error " + err);
                            } else {
                                const User = new userModel({
                                    _id: mongoose.Types.ObjectId(),
                                    username: username,
                                    password: hash,
                                });
                                User.save((err, result) => {
                                    if (err) {
                                        response.writeHead(500, { 'Content-type': 'text/html' });
                                        response.end('<center><h1>500 Internal Server Error</h1></center>');
                                    } else {
                                        response.writeHead(200, { 'Content-type': 'text/json' });
                                        response.end(JSON.stringify(values));
                                    }
                                });
                            }
                        });
                    }
                }
            });
        } catch {
            response.writeHead(400, { 'Content-type': 'text/html' });
            response.end('<center><h1>400 Bad Request</h1></center>');
        }

    } else {
        response.writeHead(400, { 'Content-type': 'text/html' });
        response.end('<center><h1>400 Bad Request</h1></center>');
    }
}

function login(data, response) {
    response.end();
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