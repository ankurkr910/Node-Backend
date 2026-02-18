const express = require('express');
const router = express.Router();
const User= require('../models/user');

const Request = require('../models/request');            

router.post('/send/:status/:toUserId', async (req, res) => {
    const fromUserId = req.user._id;
    const { toUserId, status } = req.params;

    try {
        if(fromUserId.toString() === toUserId.toString()) return res.status(400).json({ message: "Cannot send request to yourself" });
        
        const toUser = await User.findById(toUserId);
        if (!toUser) return res.status(404).json({ message: "User not found" });

        const allowestStatuses = ['interested', 'ignored'];
        if (!allowestStatuses.includes(status)) return res.status(400).json({ message: "Invalid status" });
        
        const existingRequest = await Request.findOne({
            $or: [
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if (existingRequest) return res.status(400).json({ message: "Request already exists" });
        
        const newRequest = new Request({ fromUserId, toUserId, status });
        await newRequest.save();
        res.status(200).json({ message: "Request sent successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/review/:status/:requestId', async (req, res) => {
    const { requestId, status } = req.params;
    try {
        const loginUserId = req.user._id;
        const allowedStatuses = ['accepted', 'rejected'];
        if (!allowedStatuses.includes(status)) return res.status(400).json({ message: "Invalid status!" });
        const connectionRequest = await Request.findOne({ _id: requestId, toUserId: loginUserId ,status:'interested' });
        if (!connectionRequest) return res.status(404).json({ message: "Request not found" });
        connectionRequest.status = status;
        await connectionRequest.save();
        res.status(200).json({ message: "Request " + status + " successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;