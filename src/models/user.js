const mongoose = require('mongoose');
const validator = require('validator');

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
        required: [true, 'Email is required' ],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Please provide a valid email address']
    },
    DOB:{
        type: String,
        required: [true, "Date of Birth is required"],
        validate: {
            validator:  (val) => {
                return validator.isDate(val, { format: 'DD-MM-YYYY', strictMode: true });
            },
            message: props => `${props.value} is not a valid date of birth! Use format  DDD-MM-YYYY.`
        }

    },
    gender: {
        type: String,
        required: [true, "Gender is required"],
        validate: {
            validator:  (val) => {
                return ['male', 'female', 'other'].includes(String(val).toLowerCase());
            },
            message: props => `${props.value} is not a valid gender`
        }
    },
     password: {
        type: String,
        required: [true, 'Password is required' ],
        validate: {
            validator:  (val) => {
                return validator.isStrongPassword(val, {
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1
                });
            },
            message: props => `Password is not strong enough. It should be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one symbol.`
        }
    },
});

module.exports = mongoose.model('User', userSchema);