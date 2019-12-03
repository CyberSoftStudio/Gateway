const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const { start } = require('../../services/start');
const express = require('express');
const app = express();

chai.use(chaiHttp);

describe('Admin Routes', async () => {
    const server = await start(app);
    xit('GET {/open-chats} It should get all current instance open rooms', async () => {
        const { body } = await chai.request(server)
            .get('/admin/open-chats');
        expect(body).to.have.a.property('openRooms');
        expect(body.openRooms).to.be.an('array');
    });
    xit('GET {/logs-to-console} It should get logsToToConsole state', async () => {
        const { body } = await chai.request(server)
            .get('/admin/logs-to-console');
        expect(body).to.have.a.property('logsToConsole');
        expect(body.logsToConsole).to.be.a('boolean');
    });
    xit('GET {/switch-logs-to-console} It should switch & get logsToConsole state', async () => {
        const { body } = await chai.request(server)
            .get('/admin/switch-logs-to-console');
        expect(body).to.have.a.property('logsToConsole');
        expect(body.logsToConsole).to.be.a('boolean');
    });
    xit('GET {/state} It should get app config service current state', async () => {
        const { body } = await chai.request(server)
            .get('/admin/state');
        expect(body).to.have.a.property('livechatSocket');
        expect(body).to.have.a.property('mongoConnection');
        expect(body).to.have.a.property('config');
    });
});