const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        min: 4
    },
    password: {
        type: String,
        required: true,
        min : 4
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
