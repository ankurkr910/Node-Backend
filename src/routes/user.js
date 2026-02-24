const express = require('express');
const router = express.Router();
const Request = require('../models/request');
const User = require('../models/user');


router.get('/getRequestList', async (req,res) =>{
    try{
          const loginUserId = req.user._id;
          const requestsList = await Request.find({ 
            toUserId: loginUserId, 
            status: 'interested' 
        }).populate('fromUserId', ['firstName', 'lastName']);
          res.status(200).json({ message: "Request list fetched successfully", data: requestsList });
    } catch(err){
        res.status(500).json({ message: err.message });
    }
});

router.get('/getConnectionsList', async (req,res) =>{
    try{
          const loginUserId = req.user._id;
          const connectionsList = await Request.find({ 
            $or: [
                { fromUserId: loginUserId, status: 'accepted' },
                { toUserId: loginUserId, status: 'accepted' }
            ]
        }).populate('fromUserId toUserId', ['firstName', 'lastName', 'gender', 'DOB']);
          const formattedConnectionsList = connectionsList.map(connection => {
            return connection.fromUserId._id.toString() === loginUserId.toString() ? connection.toUserId : connection.fromUserId;
          });
          res.status(200).json({ message: "Connections list fetched successfully", data: formattedConnectionsList });
    } catch(err){
        res.status(500).json({ message: err.message });
    }
});

router.get('/feed' ,async (req,res) =>{
    try{
        const loginUserId = req.user._id;
        const Requests = await Request.find({ 
            $or: [
                { fromUserId: loginUserId }, 
                { toUserId: loginUserId }
            ]}).select('fromUserId toUserId');

        const hideUserIds = new Set();
        Requests.forEach(request => {
            hideUserIds.add(request.fromUserId.toString());
            hideUserIds.add(request.toUserId.toString());
        });

        const feedUsers = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUserIds) } },
                { _id: { $ne: loginUserId } }
            ]
        }).select('firstName lastName gender DOB');
        res.status(200).json({ message: "Feed fetched successfully", data: feedUsers });
    } catch(err){
        res.status(500).json({ message: err.message });
    }   
});

module.exports = router;
