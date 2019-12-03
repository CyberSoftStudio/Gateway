const { Logger } = require('../common');
class ConfigService {
    constructor() {
        this._processEnv = [];
        this.init();
    }
    get port() {
        return this.config.port;
    }
    get twilio() {
        return this.config.twilio;
    }
    get livechat() {
        return this.config.livechat;
    };
    get mongo() {
        return this.config.mongo;
    }
    get mode() {
        return this.config.mode;
    }
    get errorAlert() {
        return this.config.errorAlertTo;
    }
    get sendgrid() {
        return this.config.sendgrid;
    }
    get processEnv() {
        return this._processEnv;
    }
    get socketPingToConsole() {
        return this.config.livechat.socketPingToConsole;
    };
    set socketPingToConsole(data) {
        this.config.livechat.socketPingToConsole = !!data;
    };
    get socketResponseToConsole() {
        return this.config.livechat.socketResponseToConsole;
    };
    set socketResponseToConsole(data) {
        this.config.livechat.socketResponseToConsole = !!data;
    };
    init() {
        this.config = require('../config');
        const environment = {
            VS_RC_SYNC_PORT: (data) => {
                this.config.port = data;
            },
            VS_RC_SYNC_MODE: (data) => {
                this.config.mode = data;
            },
            VS_RC_SYNC_MONGO_URL: (data) => {
                this.config.mongo.mongoUrl = data;
            },
            VS_RC_SYNC_MONGO_DATABASE: (data) => {
                this.config.mongo.database = data;
            },
            VS_RC_SYNC_ROCKET_SOCKET: (data) => {
                this.config.livechat.socketUrl = data;
            },
            VS_RC_SYNC_SOCKET_PING_TO_CONSOLE: (data) => {
                this.config.livechat.socketPingToConsole = data;
            },
            VS_RC_SYNC_TWILIO_NUMBER: (data) => {
                this.config.twilio.twilioPhone = data
                    .replace(this.config.twilio.whatsappPhonePrefix,'');
            },
        };
        this._processEnv = Object.keys(process.env).filter(key => key.match(/^VS_RC_SYNC/));
        this._processEnv.forEach(key => {
            if (environment[key]) environment[key](process.env[key]);
        });
        Logger.log('Config Service Init...');
        return true;
    }
}

module.exports = new ConfigService();