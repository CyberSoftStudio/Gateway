const { 
    LiveChatService,
    TwilioService,
    ErrorManagerService
} = require('../services');

module.exports = {
    sendToRoom,
    updateMessageState,
}

async function sendToRoom(req, res) {
    try {
        const { error, from, message } = TwilioService.webhookBodyParser(req.body);
        if (error) {
            ErrorManagerService.error(error);
        } else {
            const errorMessage = `Error to send to LiveChat room via LiveChat service!` +
                ` from:${from} message: ${message}`;
            const result = await LiveChatService.sendToRoom(from, message);
            if (!result || result.error) {
                ErrorManagerService.error(errorMessage + result ? `  error:${result.error}` : '');
                await TwilioService.sendToWhatsapp(
                    from,
                    TwilioService.config.errorResponseMessage
                );
            }
        }        
    } catch(error) {
        ErrorManagerService.error(error);
    }
    res.set('Content-Type', 'text/xml').send('<Response/>');
}

async function updateMessageState(req, res) {
    try {
        const { error, sid, state } = TwilioService.webhookBodyParser(req.body);
        if (error) {
            ErrorManagerService.error(error);
        } else {
            await LiveChatService.upadteWhatsappMessageState(sid, state);
        }        
    } catch(error) {
        ErrorManagerService.error(error);
    }
    res.set('Content-Type', 'text/xml').send('<Response/>');
}