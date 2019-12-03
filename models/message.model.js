const mongoose = require('mongoose');

const Schema = mongoose.Schema;

module.exports = {
    createWhatsappMessageState,
    updateWhatsappMessageState,
    getImg,
};

MessageSchema = new Schema({
    _id: String,
    rid: String,
    msg: String,
    token: String,
    u: {
        _id: String,
        username: String,
    },
    sid: String,
    state: String,
}, { strict: false });

const Messages = mongoose.model(
    'Messages',
    MessageSchema,
    'rocketchat_message'
);

async function createWhatsappMessageState(messageID, sid, state) {
    return await Messages.updateOne({
        sid,
        state,
    })
    .where({ _id: messageID });
}

async function updateWhatsappMessageState(sid, state) {
    return await Messages.updateOne({ state })
    .where({ sid });
}

async function getImg(filterId) {
    return await Messages.find(filterId);

}