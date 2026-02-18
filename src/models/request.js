const {  mongoose } = require("mongoose");


const requestModel = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['interested', 'ignored', 'accepted', 'rejected'],
            message: props => `${props.value} is not a valid status`
        }   
    },
});

module.exports = mongoose.model('Request', requestModel); 