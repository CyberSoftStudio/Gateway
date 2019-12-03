const config = require('../services/config.service').sendgrid;
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');

class EmailService {
    constructor() {
      this._options = {
        auth: {
          api_user: config.username,
          api_key: config.password,
        },
      };
      this._mailer = nodemailer
        .createTransport(sendgrid(this._options));
    }
    send(email) {
        if (!email.from) {
          email.from = config.from;
        }
        return new Promise((resolve, reject) => {
          this._mailer.sendMail(email, function(err, res) {
            if(err) {
              reject(err);
            }
            resolve(res);
          });
        });
      }
}

module.exports = new EmailService();