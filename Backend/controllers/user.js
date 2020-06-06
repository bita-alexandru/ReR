const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const userModel = require('../models/user');
const success = require('./success');
const jwt = require('jsonwebtoken');

function register(data, response) {
    if (data.method === 'POST') {
        try {
            const values = JSON.parse(data.payload);
            const username = values.username;
            const password = values.password;

            userModel.findOne({ username: username }, (err, user) => {
                if (err) {
                    success.success(response, 500);
                } else {
                    if (user) {
                        success.success(response, 409);
                    } else {
                        const saltRounds = 13;

                        bcrypt.hash(password, saltRounds, (err, hash) => {
                            if (err) {
                                success.success(response, 500);
                            } else {
                                const User = new userModel({
                                    _id: mongoose.Types.ObjectId(),
                                    username: username,
                                    password: hash,
                                });
                                User.save((err, result) => {
                                    if (err) {
                                        success.success(response, 500);
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
            success.success(response, 400);
        }

    } else {
        success.success(response, 400);
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
                    success.success(response, 500);
                } else {
                    if (user) {
                        bcrypt.compare(password, user.password, (err, result) => {
                            if (err) {
                                success.success(response, 500);
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
                                    response.setHeader('Auth-Token', token);
                                    success.success(response, 200);
                                } else {
                                    success.success(response, 401);
                                }
                            }
                        });
                    } else {
                        success.success(response, 401);
                    }
                }
            });
        } catch{
            success.success(response, 400);
        }
    } else {
        success.success(response, 400);
    }
}


function deleteAccount(data, response) {
    if (data.method === 'DELETE') {
        try {
            const values = JSON.parse(data.payload);
            const authToken = data.headers['auth-token'];
            const password = values.password;
            const username = jwt.decode(authToken, process.env.AUTH_TOKEN).userName;
            try {
                jwt.verify(authToken, process.env.AUTH_TOKEN, (err, decoded) =>{
                    if(err){
                        success.success(response, 500);
                    }else{
                        if(decoded){
                            userModel.findOne({ username: username }, (err, user) => {
                                if (err) {
                                    success.success(response, 500);
                                } else {
                                    if (user) {
                                        bcrypt.compare(password, user.password, (err, result) => {
                                            if (err) {
                                                success.success(response, 500);
                                            } else {
                                                if (result) {
                                                    user.deleteOne({ username: username }, (err) => {
                                                        if (err) {
                                                            success.success(response, 500);
                                                        } else {
                                                            success.success(response, 200);
                                                        }
                                                    })
                                                } else {
                                                    success.success(response, 401);
                                                }
                                            }
                                        });
                                    } else {
                                        success.success(response, 401);
                                    }
                                }
                            });
                        }else{
                            success.success(response, 401);
                        }
                    }
                });
            } catch  {
                success.success(response,401);
            }
            /*
            if (username !== 'undefined') {
                
            } else {
                success.success(response, 400);
            } */
        } catch{
            success.success(response, 400);
        }
    }
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

module.exports = { register, login, deleteAccount, getFeed, getPreferences, setPreferences };