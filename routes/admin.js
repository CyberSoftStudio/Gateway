let express = require('express');
let router = express.Router();
let { AdminController } = require('../controllers');

router.get('/open-chats', AdminController.getOpenChats);
router.get('/logs-to-console', AdminController.logsToConsole);
router.get('/switch-logs-to-console', AdminController.switchLogsToConsole);
router.get('/state', AdminController.getAppState);

module.exports = router;