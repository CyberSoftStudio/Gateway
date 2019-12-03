const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const config = require('../services/config.service').livechat;
const { AuthService } = require('../services');
const { LiveChatController } = require('../controllers');

router.post(
        `/${config.webhookPrefix}`,
        AuthService.liveChatWebHookAuth,
        bodyParser.json(),
        LiveChatController.sendToWhatsapp
    );

module.exports = router;