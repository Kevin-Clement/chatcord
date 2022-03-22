const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})
module.exports = mongoose.model('room', roomSchema);