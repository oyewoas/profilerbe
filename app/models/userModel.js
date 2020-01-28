const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
    profileImg: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    date_of_birth: {
        type: Date,
        required: true
    },
    security_question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    date_created: {
        type: Date,
        default: Date.now,
    }


});

const UsersModel = mongoose.model('Users', UsersSchema);

module.exports = UsersModel;