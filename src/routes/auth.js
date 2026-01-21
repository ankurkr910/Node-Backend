const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signUp', async (req, res) => {
    let { firstName, emailId, password, lastName, gender, DOB } = req.body;
    gender = gender.toLowerCase();
    password = await bycrypt.hash(password, 10);
    try {
        const user = new User({ 
            firstName, 
            lastName,
            emailId, 
            password,
            DOB, 
            gender});
        await user.save();
        res.status(200).json({ message: "User registered successfully"});
    } catch (err) {
        res.status(500).json(err.message);
    }
});

router.post('/login', async (req, res) => {
    const { emailId, password } = req.body;
    try {
        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isMatch = await bycrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token);
        res.status(200).json({ message: "Login successful" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: "Logout successful" });
});

router.post('/resetPassword', async (req, res) => {
    const { emailId, newPassword } = req.body;
    try {
        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(400).json({ message: "User with this email does not exist" });
        }
        const passwordHash = await bycrypt.hash(newPassword, 10);
        user.password = passwordHash;
        await user.save();
        res.status(200).json({ message: "Password reset successful" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;