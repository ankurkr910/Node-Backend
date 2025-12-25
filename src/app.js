const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const bycrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const userAuth = require('./middlewares/auth');
require('dotenv').config();
const app = express();
const PORT = 7777;

app.use(express.json());
app.use(cookieParser());


app.post('/api/signUp', async (req, res) => {
    const { firstName, emailId, password,lastName, gender,DOB} = req.body;
    const passwordHash = await bycrypt.hash(password, 10);
    try {
        const user = new User({ 
            firstName, 
            lastName,
            emailId, 
            password:passwordHash,
            DOB, 
            gender});
        await user.save();
        res.status(200).json({ message: "User registered successfully"});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/login', async (req, res) => {
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

app.get('/api/profile', userAuth, async (req, res) => {
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

connectDB().then(() => {
    console.log('Database connection established');
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
  }
  ).catch((err) => {
    console.error('Database connection error:', err);
  }
  );
