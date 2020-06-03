const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const userController = require('./user');

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
    });

    request.on('end', () => {
        buffer += decoder.end();

        let handler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : router['not_found'];
        let data = {
            'trimmedPath': trimmedPath,
            'queryString': queryString,
            'method': method,
            'headers': headers,
            'payload': buffer
        };

        handler(data, response);

        // console.log(`${method}: ${trimmedPath}`);
        // console.log('query: ' + JSON.stringify(queryString, null, " "));
        // console.log('headers: ' + JSON.stringify(headers, null, " "));
        // console.log('payload: ' + buffer);

        response.end();
    });

});

const router = {
    'register': userController.register,
    'login': userController.login,
    'logout': userController.logout,
    'delete_account': userController.deleteAccount,
    '': userController.feed,
    'preferences': userController.preferences,
    'not_found': function notFound(data, response) {
        let payload = data.payload;
       // let values = JSON.parse(payload);
       // console.log(values['aaaaaaaa']);
        response.writeHead(404);
        response.write('Not found');
    }
};

module.exports = { server };