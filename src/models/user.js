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
        unique: [true, 'User already exists' ],
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
        enum: {
            values: ['male', 'female', 'other'],
            message: props => `${props.value} is not a valid gender`
        }
    },
     password: {
        type: String,
        required: [true, 'Password is required' ],
        validate: {
            validator:  (val) => {
                return validator.isStrongPassword(val);
            },
            message: props => `Password is not strong enough. It should be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one symbol.`
        }
    }
},{ timestamps: true });

module.exports = mongoose.model('User', userSchema);