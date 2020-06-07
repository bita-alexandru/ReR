const pagerController = require('../controllers/pager');
const userController = require('../controllers/user');
const httpErrorView = require('../views/http_error');
const adminUtil = require('./admin');

const routes = {
    // serve static files
    '': pagerController.index,
    'preferences': pagerController.preferences,
    'account': pagerController.account,
    'not_found': function notFound(data, response) {
        httpErrorView.notFound(data, response);
    },

    // serve user operations
    'get_feed': userController.getFeed,
    'get_preferences': userController.getPreferences,
    'set_preferences': userController.setPreferences,
    'register': userController.register,
    'login': userController.login,
    'logout': userController.logout,
    'delete_account': userController.deleteAccount,

    // serve admin operations
    'admin/set_resource': adminUtil.setResource
};

module.exports = { routes };