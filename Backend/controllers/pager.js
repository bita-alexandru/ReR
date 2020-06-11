const indexView = require('../views/index');
const preferencesView = require('../views/preferences');
const accountView = require('../views/account');
const httpErrorView = require('../views/http_error');
const adminUtil = require('../util/admin');

function index(data, response) {
    if (adminUtil.usables.usableFeed === false) {
        httpErrorView.serviceUnavailable(data, response);
        return;
    }

    indexView.feed(data, response);
}

function preferences(data, response) {
    if (adminUtil.usables.usablePreferences === false) {
        httpErrorView.serviceUnavailable(data, response);
        return;
    }

    preferencesView.preferences(data, response);
}

function account(data, response) {
    if (adminUtil.usables.usableAccount === false) {
        httpErrorView.serviceUnavailable(data, response);
        return;
    }

    accountView.account(data, response);
}


module.exports = { index, account, preferences };