const fs = require('fs');

function notFound(data, response) {
    const file = __dirname + '/../public/not_found.html';

    fs.readFile(file, (err, content) => {
        if (err) {
            console.log(`Error at reading <${file}>`);
            internalServerError(data, response);
        } else {
            response.writeHead(404, { 'Content-type': 'text/html' });
            response.write(content);
            response.end();
        }
    });
}

function internalServerError(data, response) {
    const file = __dirname + '/../public/internal_server_error.html';

    fs.readFile(file, (err, content) => {
        if (err) {
            console.log(`Error at reading <${file}>`);
            response.writeHead(500, { 'Content-type': 'text/html' });
            response.write('<center><h1>505 Internal Server Error</h1></center>');
            response.end();
        } else {
            response.writeHead(500, { 'Content-type': 'text/html' });
            response.write(content);
            response.end();
        }
    });
}

function serviceUnavailable(data, response) {
    const file = __dirname + '/../public/service_unavailable.html';

    fs.readFile(file, (err, content) => {
        if (err) {
            console.log(`Error at reading <${file}>`);
            internalServerError(data, response);
        } else {
            response.writeHead(503, { 'Content-type': 'text/html' });
            response.write(content);
            response.end();
        }
    });
}

function badRequest(data, response) {
    const file = __dirname + '/../public/bad_request.html';

    fs.readFile(file, (err, content) => {
        if (err) {
            console.log(`Error at reading <${file}>`);
            internalServerError(data, response);
        } else {
            response.writeHead(400, { 'Content-type': 'text/html' });
            response.write(content);
            response.end();
        }
    });
}

module.exports = { badRequest, notFound, internalServerError, serviceUnavailable };
