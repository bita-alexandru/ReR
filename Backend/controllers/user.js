const http = require('http');
const user = require('../models/user');
const feedView = require('../views/feed');
const preferencesView = require('../views/preferences');
const accountView = require('../views/account');

function register(data, response) {
    response.end();
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