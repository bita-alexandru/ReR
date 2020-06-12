const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const xss = require('xss');
const fs = require('fs');
const assetView = require('../views/asset');
const router = require('../util/router');
const parser = require('../util/parser');

const options = {
    key: fs.readFileSync(__dirname + '/../security/key.key'),
    cert: fs.readFileSync(__dirname + '/../security/cert.crt')
};

let server = https.createServer(options, (request, response) => {
    let parsedUrl = url.parse(request.url, true);
    let path = parsedUrl.path.split('?')[0];
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');

    let queryString = parsedUrl.query;
    let method = request.method.toUpperCase();
    let headers = request.headers;

    let decoder = new StringDecoder('utf-8');
    let buffer = '';

    request.on('data', (data) => { // get payload from chunks
        buffer += decoder.write(data);
    });

    request.on('end', () => { 
        buffer += decoder.end(); 
        queryString = JSON.stringify(queryString);
        buffer = xss(parser.parseQuery(buffer)); // save stringified into buffer

        if (buffer.length < queryString.length) {
            buffer = queryString;
        }

        let handler = // choose the suiteted function for the requested route
            typeof (router.routes[trimmedPath]) !== 'undefined' ?
                router.routes[trimmedPath] :
                router.routes['not_found'];

        let data = { // build up all the receive info into one structure
            'trimmedPath': trimmedPath,
            'queryString': queryString,
            'method': method,
            'headers': headers,
            'payload': buffer
        };

        if (trimmedPath.startsWith('assets/')) { // return css/js/inco files 
            if (trimmedPath.endsWith('.css')) {
                assetView.getCSS(data, response);
            }
            else if (trimmedPath.endsWith('.js')) {
                assetView.getJS(data, response);
            } else if (trimmedPath.endsWith('.ico')) {
                assetView.getICO(data, response);
            }
        } else {
            handler(data, response);
        }
    });

});

module.exports = { server };