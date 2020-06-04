const fs = require('fs');

function getHTML(file, response, status) {
    fs.readFile(file, (err, content) => {
        if (err) {
            console.log(`Error at reading <${file}>`);
            response.writeHead(500);
            response.write('Internal server error');
        } else {
            response.writeHead(status, { 'Content-type': 'text/html' });
            response.write(content);
        }

        response.end();
    });
}

function getCSS(file, response, status) {
    fs.readFile(file, (err, content) => {
        if (err) {
            console.log(`Error at reading <${file}>`);
            response.writeHead(500);
            response.write('Internal server error');
        } else {
            response.writeHead(status, { 'Content-type': 'text/css' });
            response.write(content);
        }

        response.end();
    });
}

function getJS(file, response, status) {
    fs.readFile(file, (err, content) => {
        if (err) {
            console.log(`Error at reading <${file}>`);
            response.writeHead(500);
            response.write('Internal server error');
        } else {
            response.writeHead(status, { 'Content-type': 'text/javascript' });
            response.write(content);
        }

        response.end();
    });
}

function getICO(file, response, status) {
    fs.readFile(file, (err, content) => {
        if (err) {
            console.log(`Error at reading <${file}>`);
            response.writeHead(500);
            response.write('Internal server error');
        } else {
            response.writeHead(status, { 'Content-type': 'image/x-icon' });
            response.write(content);
        }

        response.end();
    });
}

module.exports = { getHTML, getCSS, getJS };