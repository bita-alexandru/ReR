function parseCookie(data) { 
    let list = {};
    let cookies = data.headers.cookie;

    if (cookies && cookies.split(';').forEach(cookie => {
        let parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    }));

    return list;
}

function parseQuery(data) {
    let property;
    let json = {};
    let properties = data.slice(data.indexOf('?') + 1).split('&');

    for (let i = 0; i < properties.length; i++) {
        property = properties[i].split('=');
        json[property[0]] = property[1];
    }

    return JSON.stringify(json);
}

module.exports = { parseCookie, parseQuery };