const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const assetView = require('../views/asset');
const router = require('../util/router');

let server = http.createServer((request, response) => {
    let parsedUrl = url.parse(request.url, true);
    let path = parsedUrl.path;
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');

    let queryString = parsedUrl.query;
    let method = request.method.toUpperCase();
    let headers = request.headers;

    let decoder = new StringDecoder('utf-8');
    let buffer = '';
    request.on('data', (data) => {
        buffer += decoder.write(data);
        if (request.method === 'POST') {
            buffer = convertBodyToJSON(buffer);
        }
    });

    request.on('end', () => {
        buffer += decoder.end();

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
            console.log(handler);
            handler(data, response);
        }

         console.log(`${method}: ${trimmedPath}`);
        // console.log('query: ' + JSON.stringify(queryString, null, " "));
        // console.log('headers: ' + JSON.stringify(headers, null, " "));
        // console.log('payload: ' + buffer);
    });

});

function convertBodyToJSON(data) {
    let property;
    let myJson = {};
    let properties = data.slice(data.indexOf('?') + 1).split('&');
    for (let i = 0; i < properties.length; i++) {
        property = properties[i].split('=');
        myJson[property[0]] = property[1];
    }
    return JSON.stringify(myJson);
}

module.exports = { server };