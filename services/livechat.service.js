const ConfigService = require('./config.service');
const MongoConnectionService = require('./mongo.connection.service');
const { Logger, Utils: { jsonParse, generateHash } } = require('../common');
const WebSocket = require('websocket').client;
const SHA = require('crypto-js/sha256');
const { Subject } = require('rxjs');
const {
    MessageModel,
    RoomModel,
    VisitorModel
} = require('../models');

const WHATSAPP_REGEX_PHONE_PREFIX = new RegExp('^whatsapp:\+');
class LiveChatService {
    constructor() {
        this.config = ConfigService.livechat;
        this.logger = Logger;
        this.mode = ConfigService.mode;
        this.connected = new Subject();
        this.messagesObserver = {};
        this.statusRocketChatSocket = false;
        this.currentGuest = {};
        this._openRooms = [];
        this.init();
    };
    get openRooms() {
        return this._openRooms;
    }
    set openRooms(rooms = []) {
        this._openRooms = rooms.map(room => room);
    }

    get departments() {
        return this._departments;
    }
    init() {
        this._startRocketChatConnection();
        this.connected.subscribe((status) => {
            this.statusRocketChatSocket = status;
            this.logger.log(`RocketChat socket connection status: ${status}`);
        });
        this.logger.log('LiveChat Service Init...');
    };
    async sendToRoom(from = '', message = '') {
        if (!this.statusRocketChatSocket) {
            this.logger.error('Rocket Chat socket error!');
            return false;
        };
        if (!MongoConnectionService.connected) {
            this.logger.error('Rocket Chat database error!');
            return false;
        }
        let result = await this._sendToRoomInit(
            from,
            message,
            false
        );
        if (!result || !result._id) {
            result = await this._sendToRoomInit(
                from,
                message
            );
        }
        return result ? result : false;
    }
    async getAllRocketChatOpenRooms(filter = {}) {
        return (await RoomModel.getRooms(filter)).map((room) => room.toObject());
    }
    async sendErrorMessageToRoomByMessageId(messageId, errorMessage) {
        const room = await RoomModel.getRoomByMessageId(messageId);
        if (!room || !room._id || !room.v || !room.v.token) {
            throw new Error(`Error to getRoomByMessageId! MessageId:${messageId}`);
        }
        return await this._sendString({
            msg:'method',
            method:'sendMessageLivechat',
            params:[{
                _id: String(generateHash(17)),
                rid: room.id,
                msg: errorMessage,
                token:String(room.token),
            }],
        });
    }
    async createWhatsappMessageState(messageID, sid, state) {
        return await MessageModel.createWhatsappMessageState(messageID, sid, state);
    }
    async upadteWhatsappMessageState(sid, state) {
        return await MessageModel.upadteWhatsappMessageState(sid, state);
    }
    async _sendToRoomInit(from, message, initRoom = true) {
        const room = await this._getRoom(from, initRoom);
            if(!room) {
                this.logger.error(`LiveChat service
                 sendToRoom ${initRoom ? 'with' : 'without'} initRoom error!
                 from: ${from}, message: ${message}`);
                 return false;
            }
        return await this._sendString({
                msg:'method',
                method:'sendMessageLivechat',
                params:[{
                    _id: String(generateHash(17)),
                    rid: room.id,
                    msg: message,
                    token:String(room.token),
                }],
            });    
    }
    async _getRoom(name, initRoom = true) {
        let room = this._openRooms.find((room) => (room.name === name || room.fname === name));
            if (!room || initRoom) {
                let inserRoom = !!room;
                room = await this._getOpenRoom(name);
                room = await this._initRoom(room || this
                    ._newGuest(name, `${name}@${this.config.defaultDomain}`));
                if(!inserRoom) {
                    this._openRooms.push(room);
                }
            }
        return room;
    }
    async _getOpenRoom(guestName) {
        try {
            const room = await RoomModel.getOpenRoomByName(guestName);
            let name = room
                && room.visitor
                && room.visitor.length
                    ? room.visitor[0].name
                    : guestName;
            return room._id
                && room.v
                && room.v.token
                    ? { id: room._id, token: room.v.token, name: name }
                    : null;
        } catch(error) {
            this.logger.error(error);
            return null;
        }
    }
    async _initRoom(guest) {
        let result = await VisitorModel.getVisitorByName(guest.name);
        const email = result && result.visitorEmails && result.visitorEmails.length
            ? result.visitorEmails[0].address
            : guest.email;
        const name = result && result.name ? result.name : guest.name;
        const token = result && result.token ? result.token : guest.token;
        // TODO check _sendString responses
        if (!result || !result.token) {
            const initialData = await this._sendString({
                msg: 'method', 
                method: 'livechat:getInitialData', 
                params: [String(token)],
            });
            const loginGuest = await this._sendString({
                msg:'method',
                method:'livechat:loginByToken',
                params:[String(token)],
            });
            const registeredGuest = await this._sendString({
                msg:'method',
                method:'livechat:registerGuest',
                params:[{
                    token: token,
                    name: name,
                    email: email,
                    department: null
                }],
            });
            const loginUser = await this._sendString({
                msg: 'method',
                method: 'login',
                params:[
                    {
                        user: { username: this.config.login.username },
                        password: {
                            digest: SHA(this.config.login.password).toString(),
                            algorithm: 'sha-256'
                        }
                    }
                ]
            });
        }

        return {
            id: guest.id || generateHash(17),
            token: token,
            fname: name};
    }
    _newGuest(name, email) {
        return {
            name: name || this.config.defaultGuestName,
            email: email || this.config.defaultGuestEmail,
            token: generateHash(17)
        }
    }
    _startRocketChatConnection() {
        this.logger.log(`LiveChat service connecting to RocketChat Socket...${this.config.socketUrl}`);
        this.liveChatSocket = new WebSocket();
        this.liveChatSocket.on('connectFailed', (error) => this._onSocketError(error.toString()));
        this.liveChatSocket.on('connect', async (connection) => (await this._onLiveChatSocketConnect(connection)));
        this.liveChatSocket.connect(this.config.socketUrl);
    };
    async _onLiveChatSocketConnect(connection) {
        if (connection.connected) {            
            connection.on('message', (message) => this._onSocketMessage(message));
            connection.on('close', () => this._onSocketError('Alarm! Socket Rocket Chat close connection!'));
            connection.on('error', (error) => this._onSocketError(`Alarm! Socket Rocket Chat error connection: ${error}`));
            this._connection = connection;
            this.connected.next(true);
            this.logger.log('LiveChat service connected to RocketChat socket.');
            return await this._initConnectionFlow();
        } else {
            this._onSocketError('Alarm! LiveChat service socket connection error!');
            return false;
        }
    };
    _send(data) {
        this._connection.sendUTF(data);
    };
    _sendString(dataString) {
        const self = this;
        return new Promise((resolve) => {
            try {
                let badResult = false;
                let checkBadResult = 0;
                const messageId = (new Date()).getTime().toString();
                self.messagesObserver.messageId = new Subject();
                self.messagesObserver.messageId.subscribe((data) => {                    
                    if (!badResult) {
                        badResult = true;
                        delete self.messagesObserver.messageId;
                        clearInterval(checkBadResult);
                        resolve(data);
                    }
                });
                const data = { ...dataString, ...{ id: messageId} };
                // console.dir(data);
                // self.logger.log(data);
                self._send(JSON.stringify(data));
                checkBadResult = setTimeout(() => {
                    if (!badResult) {
                        badResult = true;
                        delete self.messagesObserver.messageId;
                        resolve({
                            error: `Error timeout messageId: ${messageId}!`
                        })
                    }
                }, self.config.responseSocketDelay);
            } catch (err) {
                resolve({
                    error: err.toString()
                });
            }
        })
    };
    async _initConnectionFlow() {
        const result = await this._sendString({
            msg: 'connect', 
            version: '1', 
            support: ['1']
        });
        if (result.error) this.logger.error(result.error);
        return result.data;
    };
    _onSocketMessage(message) {
        const response = jsonParse(message.utf8Data);// console.dir(response);
        if ('msg' in response && response.msg === 'ping') {
            if (this.mode === 'dev'
                || ConfigService.socketPingToConsole) this.logger.log({ SOCKET_RESPONSE: response.msg});
            // TODO check it for correct behavior without then..catch
            this._sendString({msg: 'pong'});
        } else {
            const data = response.result
                ? response.result
                : response.error
                    ? response.error
                    : response;
            this.logger.log(response.id ? { id: response.id } : {});                
            this.logger.log({
                    SOCKET_RESPONSE_SUBJECT: data
                });
            if (data.msg !== 'updated') {
                for (const subject in this.messagesObserver) {
                    this.messagesObserver[subject].next(data);
                }
            }
        };

    };
    _onSocketError(error) {
        this.logger.error(error);
        this.connected.next(false);
        if (this.config.reconnectSocketDelay > 0) {
            const self = this;
            setTimeout(() => self._startRocketChatConnection(), self.config.reconnectSocketDelay);
        }
    };
    async webhookBodyParser(body) {
        try {
            if(1||
                !body ||
                !body.messages ||
                !body.agent ||
                !body.agent.name ||
                !body.visitor ||
                !body.visitor.name ||
                !body.visitor.phone
                ) {
                return { error: `Incorrect LiveChat webhook request!` };
            }
            let pathImgString = '';
            if(body.messages.length && !body.messages[0].msg) {
                let getImgRes =  await RoomModel.getImg({ _id: body.messages[0]._id });
                if(getImgRes.length && getImgRes[0].toObject().attachments.length) {
                    let res = getImgRes[0].toObject();
                    pathImgString = `DESCRIPTION: ${res.attachments[0].description} URL: ${domain}${res.attachments[0].title_link}`;
                }

            }
            const message = pathImgString.length
                ? `${body.agent.name}: ${pathImgString}`
                : `${body.agent.name}: ${body.messages[0] && body.messages[0].msg}`;
            const to = WHATSAPP_REGEX_PHONE_PREFIX.test(body.visitor.name)
                ? req.body.visitor.name
                : `${ConfigService.twilio.whatsappPhonePrefix}${body.visitor.phone[0].phoneNumber}`;
            return {
                to,
                message,
                messageId: body.messages[0]._id
            };
        } catch(error) {
            return { error };
        }
    }
}

module.exports = new LiveChatService();