const { expect } = require('chai');
const { Logger } = require('../../common');
const { ConfigService, TwilioService } = require('../../services');
const { ErrorHandler } = require('../../common');

describe('Twilio Service', () => {
    xit('It should send message to whatsapp', async () => {
        const testMessage = `Testing message at ${(new Date()).toISOString()}`;
        const result = await TwilioService.sendToWhatsapp(
            `${ConfigService.twilio.whatsappPhonePrefix}${ConfigService.twilio.testToNumber}`,
            testMessage
        );
        expect(result).to.equal(true);
    });
});