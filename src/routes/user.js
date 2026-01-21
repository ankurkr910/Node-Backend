const express = require('express');
const router = express.Router();

router.get('/profile', async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({
            firstName: user.firstName,
            lastName: user.lastName,
            emailId: user.emailId,
            DOB: user.DOB,
            gender: user.gender
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch('/updateProfile', async (req, res) => {
        const updates = req.body;
        const user = req.user;
    try {
        // Reject attempts to modify email
        if ('emailId' in updates) {
            return res.status(400).json({ message: 'Email cannot be modified' });
        }
        Object.keys(updates).forEach((key) => {
            if (key === 'emailId') return;
            user[key] = updates[key];
        });

        await user.save();
        res.status(200).json({ message: "Profile updated successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
