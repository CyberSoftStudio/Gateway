const { expect } = require('chai');
const { MongoConnectionService } = require('../../services');
const { RoomModel } = require('../../models');

/**
 * It depends on MongoConnectionService
 */

 describe('Room Model', () => {
     xit('It should get room by message id', async () => {
         // TODO insert message to db before this test
        const messageId = 'L698ebJGsXMDvNHrG';
        const result = await RoomModel.getRoomByMessageId(messageId);
        const room = result && result.length && result[0];
        expect(room).to.have.a.property('_id');
        expect(room).to.have.a.property('v');
        expect(room.v).to.have.a.property('token');
     });
 });