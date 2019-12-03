const { expect } = require('chai');
const EmailService = require('../../services/email.service');

/**
 * It depends on Config Service
 */

 describe('Email Service', () => {
    xit('It should send email', async () => {
        const email = {
            to: 'mykola@voicespin.com',
            subject: 'Testing EmailService::send',
            html: `<div>
                        <h3>Test email at ${(new Date()).toISOString()}
                            </h3>
                        </div>`
        };
        const result = await EmailService.send(email);
        expect(result).to.have.a.property('message');
        expect(result.message).to.be.a('string').to.equal('success');
     });
 });
