const { expect } = require('chai');
const { ConfigService, LiveChatService } = require('../../services');

const DELAY_TO_SEND_TO_ROOM = 5000;

describe('LiveChat Service', () => {

    xit('It should to send message to room', async () => {
        const testMessage = `Test message from testing` +
        ` at${(new Date()).toISOString()}`;
        const fn = () => new Promise((resolve) => {
            setTimeout(async () => resolve(await LiveChatService
                .sendToRoom(`
                    ${ConfigService.twilio.whatsappPhonePrefix}${ConfigService.livechat.defaultFrom}`,
                    testMessage
                    )
                ), DELAY_TO_SEND_TO_ROOM
            );
        });
        const result = await fn();
        expect(result).to.have.a.property('_id');
        expect(result._id).to.be.a('string');
        expect(result).to.have.a.property('msg');
        expect(result.msg).to.be.a('string').to.equal(testMessage);
    });

    xit('It should to return catched open rooms array', async () => {
        const result = LiveChatService.openRooms;
        expect(result).to.be.an('array');
    });

    xit('It should to return all Chat open rooms array', async () => {
        const result = await LiveChatService.getAllRocketChatOpenRooms();
        expect(result).to.be.an('array');
    });
});