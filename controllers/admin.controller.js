const { AdminService, ErrorManagerService } = require('../services');

module.exports = {
    getAppState,
    getOpenChats,
    logsToConsole,
    switchLogsToConsole
}

function getOpenChats(req, res) {
    try {
        res.json(AdminService.getOpenChats());
    } catch (error) {
        ErrorManagerService.error(error);
        res.json({ error });
    }
}
function logsToConsole(req, res) {
    try {
        res.json(AdminService.logsToConsole());
    } catch (error) {
        ErrorManagerService.error(error);
        res.json({ error });
    }
}
function switchLogsToConsole(req, res) {
    try {
        res.json(AdminService.switchLogsToConsole());
    } catch (error) {
        ErrorManagerService.error(error);
        res.json({ error });
    }
}
function getAppState(req, res) {
    try {
        res.json(AdminService.getAppState())
    } catch(error) {
        ErrorManagerService.error(error);
        res.json({ error });
    }
}