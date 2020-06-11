const resource = require("../models/resource");

function status(response, status) {
    let message = {
        'success': false
    };

    if (status === 200) {
        message.success = true;
    }

    response.writeHead(status, { 'Content-type': 'text/json' });
    response.write(JSON.stringify(message));
    response.end();
}

function content(response, content) {
    response.writeHead(200, { 'Content-type': 'text/json' });
    response.write(JSON.stringify(content));
    response.end();
}

function success(response) {
    let message = {
        'success': true
    };

    response.writeHead(200, { 'Content-type': 'text/json' });
    response.write(JSON.stringify(message));
    response.end();
}

function failure(response) {
    let message = {
        'success': false
    };

    response.writeHead(200, { 'Content-type': 'text/json' });
    response.write(JSON.stringify(message));
    response.end();
}

function rss(response, content) {
    response.writeHead(200, { 'Content-type': 'application/rss+xml' });
    response.write(content);
    response.end();
}

module.exports = { status, content, success, failure, rss };