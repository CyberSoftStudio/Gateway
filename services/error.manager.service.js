const EmailService = require('../services/email.service');
const TwilioService = require('../services/twilio.service');
const Config = require('../services/config.service');
const { Logger } = require('../common');

class ErrorManagerService {
    constructor() {
        this.logger = Logger;
        this.config = Config;
        this.types = {
            'whatsapp': async (a1) => await this.sendWhatsApp(a1),
            'email': async (a1) => await this.sendEmail(a1),
            'livechat': async (a1) => await this.sendLiveChat(a1),
        };
        this.mode = this.config.mode;
        this.alertTo = this.config.errorAlert;
        this.whatsappPhonePrefix = this.config.twilio.whatsappPhonePrefix;
        this.logger.log('Error Manager Service init ok...');
    };

    async sendWhatsApp(msg, to) {
        try {
            const result = await TwilioService
                .sendToWhatsapp(`${this.whatsappPhonePrefix}${to}`, msg);
            if (!result) {
                this.logger.error(`Error to send error: ${msg} to: ${to}`);
                return false;
            }
            return true;
        } catch (error) {
            this.logger.error(error);
            return false;
        }
    }

    async sendEmail(msg, to) {
        try {
            const result = await EmailService.send({
                to: to,
                subject: 'ERROR ALERT from Voicespin Chat!',
                html: `<div>
                    <h3>Error happened at ${(new Date()).toISOString()}</h3>
                    <p>${msg}</p>
                </div>`
            });
            this.logger.log(`Error send to ${to} SUCCESS, result:${result}`);
            return true;
        } catch (error) {
            this.logger.error(error);
            return false;
        }
    }

    // TODO implement & test livechat room error sending

    async sendLiveChat(msg) {
        return true;
    }

    async error(message) {
        this.logger.error(message);
        this.alertTo.forEach(async (key) => (await this.types[key.type](message, key.to)));
    }
}

module.exports = new ErrorManagerService();