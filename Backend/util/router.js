const pagerController = require('../controllers/pager');
const userController = require('../controllers/user');
const httpErrorView = require('../views/http_error');
const adminUtil = require('./admin');

const routes = { // assign handlers to the specificate endpoints
    // serve static files
    '': pagerController.index,
    'preferences': pagerController.preferences,
    'account': pagerController.account,
    'not_found': function notFound(data, response) {
        httpErrorView.notFound(data, response);
    },

    // serve user operations
    'is_authenticated': userController.isAuthenticated,
    'get_feed': userController.getFeed,
    'get_preferences': userController.getPreferences,
    'set_preferences': userController.setPreferences,
    'register': userController.register,
    'login': userController.login,
    'logout': userController.logout,
    'delete_account': userController.deleteAccount,
    'get_rss': userController.getRSS,

    // serve admin operations
    'admin/export/users': adminUtil.exportUsers,
    'admin/export/resources': adminUtil.exportResources,
    'admin/manage/user': adminUtil.manageUser,
    'admin/manage/resource': adminUtil.manageResource,
    'admin/toggle/feed': adminUtil.usables.toggleFeed,
    'admin/toggle/preferences': adminUtil.usables.togglePreferences,
    'admin/toggle/account': adminUtil.usables.toggleAccount,
    'admin/toggle/get_feed': adminUtil.usables.toggleGetFeed,
    'admin/toggle/get_preferences': adminUtil.usables.togglePreferences,
    'admin/toggle/set_preferences': adminUtil.usables.toggleSetPreferences,
    'admin/toggle/register': adminUtil.usables.toggleRegister,
    'admin/toggle/login': adminUtil.usables.toggleLogin,
    'admin/toggle/delete_account': adminUtil.usables.toggleDeleteAccount,
    'admin/toggle/logout': adminUtil.usables.toggleLogout,
    'admin/toggle/get_rss': adminUtil.usables.toggleGetRSS
};

module.exports = { routes };