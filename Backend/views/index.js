const fs = require('fs');
const httpErrorView = require('./http_error');

const file = __dirname + '/../public/feed.html';

function feed(data, response) {
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

module.exports = { feed };