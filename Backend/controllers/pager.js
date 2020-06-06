const indexView = require('../views');
const preferencesView = require('../views/preferences');
const accountView = require('../views/account');

function index(data, response) {
    indexView.feed(data, response);
}

function preferences(data, response) {
    preferencesView.preferences(data, response);
}

function account(data, response) {
    accountView.account(data, response);
}


module.exports = { index, account, preferences };