const http = require('http');

function parseCookie(data) {
    let list = {};
    let cookies = data.headers.cookie;

    if (cookies && cookies.split(';').forEach(cookie => {
        let parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    }));

    return list;
}

module.exports = { parseCookie };