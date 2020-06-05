const fs = require('fs');
const httpErrorView = require('./http_error');

function getHTML(data, response) {
    const file = __dirname + `/../public/${data.trimmedPath}`;

    fs.readFile(file, (err, content) => {
        if (err) {
            console.log(`Error at reading <${file}>`);
            httpErrorView.notFound(data, response);
        } else {
            response.writeHead(200, { 'Content-type': 'text/html' });
            response.write(content);
            response.end();
        }
    });
}

function getCSS(data, response) {
    const file = __dirname + `/../public/${data.trimmedPath}`;

    fs.readFile(file, (err, content) => {
        if (err) {
            console.log(`Error at reading <${file}>`);
            response.writeHead(404);
            response.end();
        } else {
            response.writeHead(200, { 'Content-type': 'text/css' });
            response.write(content);
            response.end();
        }
    });
}

function getJS(data, response) {
    const file = __dirname + `/../public/${data.trimmedPath}`;

    fs.readFile(file, (err, content) => {
        if (err) {
            console.log(`Error at reading <${file}>`);
            response.writeHead(404);
            response.end();
        } else {
            response.writeHead(200, { 'Content-type': 'text/javascript' });
            response.write(content);
            response.end();
        }
    });
}

function getICO(data, response) {
    const file = __dirname + `/public/${data.trimmedPath}`;

    fs.readFile(file, (err, content) => {
        if (err) {
            console.log(`Error at reading <${file}>`);
            response.writeHead(404);
            response.end();
        } else {
            response.writeHead(200, { 'Content-type': 'image/x-icon' });
            response.write(content);
            response.end();
        }
    });
}

module.exports = { getHTML, getCSS, getJS };