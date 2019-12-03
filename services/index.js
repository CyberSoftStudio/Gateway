/**
 * Some services depend on each other
 * It should be required strongly like in this column, NOT ANOTHER WAY!
 */
const ConfigService = require('./config.service');
const EmailService = require('./email.service');
const MongoConnectionService = require('./mongo.connection.service');
const LiveChatService = require('./livechat.service');
const TwilioService = require('./twilio.service');
const ErrorManagerService = require('./error.manager.service');
const AuthService = require('./auth.service');
const AdminService = require('./admin.service');

module.exports = {
    AdminService,
    AuthService,
    ConfigService,
    EmailService,
    ErrorManagerService,
    LiveChatService,
    MongoConnectionService,
    TwilioService,
}
