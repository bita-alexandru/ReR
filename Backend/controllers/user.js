const http = require('http');
const viewController = require('./view');
const user = require('../models/user');

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
    let file = __dirname + '/../views/account.html';

    viewController.getHTML(file, response, 200);
}

function deleteAccount(data, response) {
    response.end();
}

function feed(data, response) {
    let file = __dirname + '/../views/feed.html';

    viewController.getHTML(file, response, 200);
}

function preferences(data, response) {
    let file = __dirname + '/../views/preferences.html';

    viewController.getHTML(file, response, 200);
}

module.exports = { register, login, logout, account, deleteAccount, feed, preferences };