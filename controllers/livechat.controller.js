const { 
    LiveChatService,
    TwilioService,
    ErrorManagerService,
} = require('../services');

module.exports = {
    sendToWhatsapp
}

async function sendToWhatsapp(req, res) {
    try {
        const { error, to, message, messageId } = await LiveChatService.webhookBodyParser(req.body);
        if (error) {
            ErrorManagerService.error(error);
        } else {
            const errorMessage = `Error to send to whatsapp via twilio service!` +
            ` from:${from} message: ${message}`;
            const result = await TwilioService.sendToWhatsapp(to, message);
            if (!result || !result.sid) {
                ErrorManagerService.error(errorMessage);
                await TwilioService.sendErrorMessageToRoomByMessageId(
                    messageId,
                    errorMessage
                );
            } else {
                await LiveChatService.createWhatsappMessageState(
                    messageId,
                    result.sid,
                    result.state
                );
            }
        }
    } catch(error) {
        ErrorManagerService.error(error);
    }
    res.set('Content-Type', 'text/xml').send('<Response/>');
}