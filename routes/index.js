let express = require('express');
let router = express.Router();
let adminRoutes = require('./admin');
let twilioRoutes = require('./twilio');
let liveChatRoutes = require('./livechat');
const config = require('../services/config.service');

router.use('/admin', adminRoutes);

router.use(`/${config.twilio.routePrefix}`, twilioRoutes);

router.use(`/${config.livechat.routePrefix}`, liveChatRoutes);

module.exports = router;
