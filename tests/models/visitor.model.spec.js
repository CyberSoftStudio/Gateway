const { expect } = require('chai');
const { MongoConnectionService } = require('../../services');
const { VisitorModel } = require('../../models');

/**
 * It depends on MongoConnectionService
 */
describe('Visitor Model', () => {
     xit('It should get visitor by name', async () => {
        // TODO insert visitor to db before this test
       const name = 'whatsapp:+380669756800';
       const result = await VisitorModel.getVisitorByName(name);
       expect(result).to.have.a.property('_id').to.be.a('String');
       expect(result).to.have.a.property('username').to.be.a('String');
       expect(result).to.have.a.property('token').to.be.a('String');
    });
    xit('It should get visitor by phone', async () => {
        // TODO insert visitor to db before this test
       const phone = 'whatsapp:+380669756800';
       const result = await VisitorModel.getVisitorByPhone(phone);
       expect(result).to.have.a.property('_id').to.be.a('String');
       expect(result).to.have.a.property('username').to.be.a('String');
       expect(result).to.have.a.property('token').to.be.a('String');
    });
});