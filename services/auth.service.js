const config = require('./config.service');
const ErrorManagerService = require('./error.manager.service');
// const ADMIN_REGEX = new RegExp(ConfigService);
const twilio = require('twilio');

// TODO add allowed whatsapp numbers array to adminService & methods to read/write
class AuthService {
    constructor() {
        this.config = config;
        this.ADMIN_REGEX = new RegExp(this.config.adminRegex);
    };
    twilioWebHookAuth(req, res, next) {
        // X-Authy-Signature
        const errorMessage = `Error twilio webhook auth! Request Headers: ${req.headers}`;
        try {
            if (!this._verifyCallback(req, this.config.twilio.authToken)) {
                throw new Error(`Twilio Auth Error! Bad request validation!`);
            }
            next();
        } catch (error) {
            ErrorManagerService.error(errorMessage + ` error: ${error.toString()}`);
            res.set().send('<Response/>');
        }

    };
    liveChatWebHookAuth(req, res, next) {
        const config = this.config.livechat;
        if (req.headers[config.authHeader] !== config.webhookToken) {
            ErrorManagerService.error(`LiveChat webhook auth error! Request Headers: ${req.headers}`);
            res.send('No auth!');
        } else next();
    };
    twilioAdminInterfaceAuthorization(from) {};
    twilioAdminInterfaceAuthentification(from, message) {
        return parseInt(message) -
            (new Date()).getTime() < this.config.twilio.twilioAdminInterfaceAuth * 60 * 1000;
    };
    checkForAdminMessage(message) {
        return this.ADMIN_REGEX.test(message);
    };
    _verifyCallback(req, apiKey) {
        const url = req.protocol + '://' + req.get('host') + req.originalUrl;
        // const method = req.method;
        const params = req.body;	// needs `npm i body-parser` on Express 4
      
        // Sort the params
        // const sortedParams = qs
        //   .stringify(params, { arrayFormat: 'brackets' })
        //   .split('&')
        //   .sort(sortByPropertyOnly)
        //   .join('&')
        //   .replace(/%20/g, '+');
      
        // Read the nonce from the request
        // const nonce = req.headers['x-authy-signature-nonce'];
      
        // concatinate all together and separate by '|'
        // const data = nonce + '|' + method + '|' + url + '|' + sortedParams;
      
        // compute the signature
        // const computedSig = crypto
        //   .createHmac('sha256', apiKey)
        //   .update(data)
        //   .digest('base64');
      
        const sig = req.headers['x-authy-signature'];
      
        // compare the message signature with your calculated signature
        // return sig === computedSig;
        return twilio.validateRequest(apiKey, sig, url, params);
    };
    // _sortByPropertyOnly: (x, y) => {
    //     const xx = x.split('=')[0];
    //     const yy = y.split('=')[0];
    
    //     if (xx < yy) {
    //     return -1;
    //     }
    //     if (xx > yy) {
    //     return 1;
    //     }
    //     return 0;
    // }
}

module.exports = new AuthService();