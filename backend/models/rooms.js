const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema({
    room_id: {
        type: String,
        required: true,
        unique: true
    },
    room_title: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true, 
    },
    members: {
        type: [String],
        default: []
    },
    createdBy: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const roommodel = mongoose.model("Room", roomSchema);

module.exports = roommodel;