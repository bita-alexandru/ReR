function status(response, status) {
    let message = {
        'success': false
    };

    if (status === 200) {
        message.success = true;
    }

    response.writeHead(status, { 'Content-type': 'text/json' });
    response.end(JSON.stringify(message));
}

function content(response, content) {
    response.writeHead(200, { 'Content-type': 'text/json' });
    response.end(JSON.stringify(content));
}

function success(response) {
    let message = {
        'success': true
    };

    response.writeHead(200, { 'Content-type': 'text/json' });
    response.end(JSON.stringify(message));
}

function failure(response) {
    let message = {
        'success': false
    };

    response.writeHead(200, { 'Content-type': 'text/json' });
    response.end(JSON.stringify(message));
}

module.exports = { status, content, success, failure };