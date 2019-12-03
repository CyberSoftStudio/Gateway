const mongoose = require('mongoose');
const Config = require('../services/config.service').mongo;
const { Logger } = require('../common');

mongoose.Promise = global.Promise;

class MongoConnectionService{
    constructor() {
        this.logger = Logger;
        this.config = Config;
        this.MONGO_CONNECT_URL = `${this.config.mongoUrl}${this.config.database}`;
        this.RECONNECT_DELAY = this.config.restartDelay * 1000;
        this._connected = false;
        this._connectingCount = 0;
        this._inProccess = false;
        mongoose.connection.on('connected', () => {
            this._connected = true;
            this.logger.log('MongoDB connected.');
            this._inProccess = false;
        });
        
        mongoose.connection.on('disconnected', () => {
            this.logger.error('MongoDB DISCONNECTED!');
            setTimeout(this._connect, this.RECONNECT_DELAY);
        });
        
        mongoose.connection.on('error', (error) => {
            this.logger.error(error);
            setTimeout(this._connect, this.RECONNECT_DELAY);
        });
        this._connect();
    }
    _connect() {
        if(!this._inProccess) {
            this._connectingCount++;
            this._inProccess = true;
            this.logger.log(`Connecting to ${this.MONGO_CONNECT_URL}... Trying ${this._connectingCount}`);
            mongoose.connect(this.MONGO_CONNECT_URL, {
                useNewUrlParser: true
            }, (error) => {
                this._inProccess = false;
                if (error) {
                    this.logger.error(error);
                    setTimeout(this._connect, this.RECONNECT_DELAY);
                }
            });
        }
    }
    get connected() {
        return this._connected;
    }
}

module.exports = new MongoConnectionService();