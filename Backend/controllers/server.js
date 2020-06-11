const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const assetView = require('../views/asset');
const router = require('../util/router');
const parser = require('../util/parser');
const xss = require('xss');

let server = http.createServer((request, response) => {
    let parsedUrl = url.parse(request.url, true);
    let path = parsedUrl.path.split('?')[0];
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');

    let queryString = parsedUrl.query;
    let method = request.method.toUpperCase();
    let headers = request.headers;

    let decoder = new StringDecoder('utf-8');
    let buffer = '';

    request.on('data', (data) => {
        buffer += decoder.write(data);
    });

    request.on('end', () => {
        buffer += decoder.end();
        queryString = JSON.stringify(queryString);
        buffer = xss(parser.parseQuery(buffer));

        if (buffer.length < queryString.length) {
            buffer = queryString;
        }

        let handler =
            typeof (router.routes[trimmedPath]) !== 'undefined' ?
                router.routes[trimmedPath] :
                router.routes['not_found'];

        let data = {
            'trimmedPath': trimmedPath,
            'queryString': queryString,
            'method': method,
            'headers': headers,
            'payload': buffer
        };

        if (trimmedPath.startsWith('assets/')) {
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

        console.log(data.payload)
    });

});

module.exports = { server };