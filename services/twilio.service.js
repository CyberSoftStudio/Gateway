const config = require('./config.service').twilio;
const { Logger } = require('../common');
const twilio = require('twilio');
const { translate } = require('moji-translate');
const whatsappPhoneRegex = new RegExp(`^${config.whatsappPhonePrefix}\+[0-9]{3,12}$`);

class TwilioService {
    constructor() {
        this.config = config;
        this.logger = Logger;
        this.client = new twilio(
            this.config.accountSid,
            this.config.authToken,
        );
        this.logger.log('Twilio Service Init...');
    }
    webhookBodyParser(body) {
        const { From, Body, NumMedia } = body;
        if (!whatsappPhoneRegex.test(From)) {
            return { error: `Incorrect whatsapp number to send messages to LiveChat
                 From: ${From} Body: ${Body}` };
        }
        let numMedia = parseInt(NumMedia);
        if (!(numMedia < 0)) {
            while(numMedia) {
                --numMedia;
                Body += '\n' + body['MediaUrl' + numMedia];
            }
        }
        return { from: From, message: Body };
    }
    async sendToWhatsapp(to, message) {
        // TODO implement some solution to check messages state via 'statusCallback'
        // it could be some incoming route and some additional message status field
        const result =  await this.client.messages.create({
            body: message.replace(
                /:[a-z_0-9]{3,50}:/g,
                moji => translate(moji.replace(/:/g, ''))
            ),
            to: to,
            from: `${this.config.whatsappPhonePrefix}${this.config.twilioPhone}`,
        });
        if (!result.sid) {
            this.logger.error(result);
            return false;
        }
        this.logger.log(`Twilio Message:${message} to:${to} SUCCESS, sid:${result.sid}`);
        return true;
    }
}

module.exports = new TwilioService();