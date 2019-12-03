const mongoose = require('mongoose');

const Schema = mongoose.Schema;

RoomSchema = new Schema({
    _id: String,
    fname: String,
    open: Boolean,
    v: {
        _id: String,
        token: String,
    }
}, { strict: false });

// RoomSchema.virtual('id').get(function(){
//     return this._id.toHexString();
// });

// RoomSchema.set('toJSON', {
//     virtuals: true
// });

const Rooms = mongoose.model(
    'Rooms',
    RoomSchema,
    'rocketchat_room');

async function getRooms(filter) {
    let rooms = await Rooms.find(filter);
    if (!('fname' in filter)) {
        return rooms;
    } else {
        if (rooms.length) {
            return rooms;
        } else {
            return await Rooms.aggregate()
                .lookup({
                    from: 'rocketchat_livechat_visitor',
                    localField: 'fname',
                    foreignField: 'name',
                    as: 'visitor'
                })
                .match({
                    open: true,
                    visitor: {$elemMatch: {
                        phone: {$elemMatch: {
                            $or: [
                                {phoneNumber: filter.fname.replace('whatsapp:', '')},
                                {phoneNumber: filter.fname}
                                ]
                            }
                        }
                    }}
                })
                .project({
                    _id: 1,
                    fname: 1,
                    v: {
                        token: 1
                    },
                    visitor: {
                        name: 1,
                        token: 1
                    }
                })
                .exec();
        }
    };
}

async function getOpenRoomByName(name) {
    const filter = {
        ...{ open: true, fname: name},
    };
    const result = await getRooms(filter);
    return result && result.length ? result[0] : null;    
}

module.exports = {
    getRooms,
    getOpenRoomByName,
};
