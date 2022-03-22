const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    room_id: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Message', messageSchema);