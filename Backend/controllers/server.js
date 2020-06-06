const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const pagerController = require('./pager');
const userController = require('./user');
const assetView = require('../views/asset');
const httpErrorView = require('../views/http_error');

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

        console.log(`${method}: ${trimmedPath}`);
        // console.log('query: ' + JSON.stringify(queryString, null, " "));
        // console.log('headers: ' + JSON.stringify(headers, null, " "));
        // console.log('payload: ' + buffer);
    });

});

const router = {
    '': pagerController.index,
    'preferences': pagerController.preferences,
    'account': pagerController.account,
    'get_feed': userController.getFeed,
    'get_preferences': userController.getPreferences,
    'set_preferences': userController.setPreferences,
    'register': userController.register,
    'login': userController.login,
    'logout': userController.logout,
    'delete_account': userController.deleteAccount,
    'not_found': function notFound(data, response) {
        httpErrorView.notFound(data, response);
    }
};

module.exports = { server };