const ConfigService = require('./config.service');
const LiveChatService = require('./livechat.service')
const MongoConnectionService = require('./mongo.connection.service');
const TwilioService = require('./twilio.service');
const { Logger } = require('../common');

module.exports = {
    getAppState,
    getOpenChats,
    logsToConsole,
    switchLogsToConsole,
    parseMessageForAdminInterface
}

const adminWhatsappInterface = {
    appState: () => getAppState(),
    switchLogsToConsole: () => switchLogsToConsole(),
    logsToConsole: () => logsToConsole(),
    openRooms: () => getOpenChats()
}

function parseMessageForAdminInterface(message) {
    return 
}

function getAppState() {
    const data = {};
    data.livechatSocket = LiveChatService.statusRocketChatSocket;
    data.mongoConnection = MongoConnectionService.connected;
    data.config = ConfigService;
    return data;
}
function getOpenChats() {
    return { openRooms: LiveChatService.openRooms };
}
function logsToConsole() {
    return { logsToConsole: !!Logger.logsToConsole };
};
function switchLogsToConsole() {
    Logger.logsToConsole = !Logger.logsToConsole;
    return { logsToConsole: !!Logger.logsToConsole };
}
