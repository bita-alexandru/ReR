const fs = require('fs');
const notFoundView = require('./not_found');

const file = __dirname + '/../public/preferences.html';

function preferences(data, response) {
    fs.readFile(file, (err, content) => {
        if (err) {
            console.log(`Error at reading <${file}>`);
            notFoundView.notFound(data, response);
        } else {
            response.writeHead(200, { 'Content-type': 'text/html' });
            response.write(content);
        }

        response.end();
    });
}

module.exports = { preferences };