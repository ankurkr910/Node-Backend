const express = require('express');
const router = express.Router();
const Request = require('../models/request');


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


module.exports = router;
