const { expect } = require('chai');
const MongoConnectionService = require('../../services/mongo.connection.service');

describe('Mongo Connection Service', () => {
    xit('It should get connection state', async () => {
        const fn = () => new Promise((resolve) => {
            setTimeout(() => resolve(MongoConnectionService.connected), 5000);
        });
        const state = await fn();
        expect(state).to.equal(true);
    });
});