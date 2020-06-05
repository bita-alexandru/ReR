const fs = require('fs');

const file = __dirname + '/../public/not_found.html';

function notFound(data, response) {
    fs.readFile(file, (err, content) => {
        if (err) {
            console.log(`Error at reading <${file}>`);
            response.writeHead(500, { 'Content-type': 'text/html' });
            response.write('<center><h1>Internal server error</h1></center>');
        } else {
            response.writeHead(404, { 'Content-type': 'text/html' });
            response.write(content);
        }

        response.end();
    });
}

module.exports = { notFound };