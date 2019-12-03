const mongoose = require('mongoose');

const Schema = mongoose.Schema;

VisitorSchema = new Schema({
    _id: String,
    username: String,
    name: String,
    token: String,
    visitorEmails: [
        {
            address: String
        }
    ],
    phone: [
        {
            phoneNumber: String
        }
    ]
}, { strict: false });

const Visitors = mongoose.model(
    'Visitors',
    VisitorSchema,
    'rocketchat_livechat_visitor'
);

async function getVisitorByName(name) {
    const result = await Visitors.findOne({
        $or: [
            { name: name.replace('whatsapp:', '') },
            { name: name },
            { phone: {$elemMatch: {
                $or: [
                    {phoneNumber: name.replace('whatsapp:', '')},
                    {phoneNumber: name},
                    ]
                }
            }}
            ]
    });
    return result ? result.toObject() : null;
}
async function getVisitorByPhone(phone) {
    return await Visitors.findOne({
        phone: {$elemMatch: {
            $or: [
                {phoneNumber: phone.replace('whatsapp:', '')},
                {phoneNumber: phone},
                ]
            }
        }
    });
}

module.exports = {
    getVisitorByName,
    getVisitorByPhone,
};
