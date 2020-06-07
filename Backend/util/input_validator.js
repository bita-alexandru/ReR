const preferences = require('./available_preferences');

function username(username) {
    // 3-16 chars, no special chars, only english letters and numbers
    let regex = new RegExp('^(?=.{3,16}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$');
    return regex.test();
}

function password(password) {
    // 8-24 chars, at least one special char & one number & one uppercase letter
    let regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*._\-]).{8,24}$');
    return regex.test();
}

function domains(domains) {
    let result = [];

    domains.forEach(domain => {
        if (preferences.all_domains.includes(domain)) {
            result.push(domain);
        }
    });

    return result;
}

function websites(websites) {
    let result = [];

    websites.forEach(website => {
        if (preferences.all_websites.includes(website)) {
            result.push(website);
        }
    });

    return result;
}

module.exports = { password, username, domains, websites };