const preferences = require('./available_preferences');

function username(username) {
    // 3-16 chars, no special chars, only english letters and numbers
    let regex = new RegExp('^(?=.{3,16}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$');
    return regex.test(username);
}

function password(password) {
    // 8-24 chars, at least one special char & one number & one uppercase letter
    let regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*._\-]).{8,24}$');
    return regex.test(password);
}

function domains(domains) { // returns only the valid domains specified in the user's input
    let result = [];

    domains.forEach(domain => {
        if (preferences.all_domains.includes(domain)) {
            result.push(domain);
        }
    });
    return result;
}

function badStrings(values, params) { // check if the user's input covers the requiremeds (only string and valid keys)
    let used = {};

    for (const [key, value] of Object.entries(values)) {
        if (typeof (value) !== 'string') {
            return true;
        }

        if (!params.includes(key)) {
            return true;
        }

        if (typeof (used.key) !== 'undefined') {
            return true;
        }

        used[key] = 'true';
    }

    return false;
}

module.exports = { password, username, domains, badStrings };