const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const config = require('../services/config.service').twilio;
const Controller = require('../controllers/twilio.controller');
const AuthService = require('../services/auth.service');

router.post(
        `/${config.webhookRoutePrefix}`,
        bodyParser.urlencoded({ extended: false }),
        AuthService.twilioWebHookAuth,
        Controller.sendToRoom
    );
    // TODO this route should be enabled in Twilio dashboard
router.post(
        `/${config.webhookStateMessageRoutePrefix}`,
        bodyParser.urlencoded({ extended: false }),
        AuthService.twilioWebHookAuth,
        Controller.updateMessageState
    );

module.exports = router;