const { expect } = require('chai');
const { MongoConnectionService } = require('../../services');
const { MessageModel } = require('../../models');

/**
 * It depends on MongoConnectionService
 */
describe('Message Model', () => {
     xit('It should update message object by message id', async () => {
        // TODO insert message to db before this test
       const messageId = 'L698ebJGsXMDvNHrG';
       const sid = 'L698ebJGsXMDvNHrG';
       const state = 'delivered';
       const result = await MessageModel.createWhatsappMessageState(
           messageId,
           sid,
           state
           );
       expect(result).to.have.a.property('ok').to.equal(1);
    });
    xit('It should update message object by sid', async () => {
        // TODO insert message to db before this test
       const sid = 'L698ebJGsXMDvNHrG';
       const state = 'delivered';
       const result = await MessageModel.updateWhatsappMessageState(sid, state);
       expect(result).to.have.a.property('ok').to.equal(1);
    });
});