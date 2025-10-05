const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    DOB:{
        type: String,
    },
    gender: {
        type: String,
        Validate(val) {
            if (!['male', 'female', 'other'].includes(val.toLowerCase())) {
                throw new Error('Invalid gender value')

            }
        }
    },
     password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('User', userSchema);