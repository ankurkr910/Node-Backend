const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const app = express();
const PORT = 7777;

app.use(express.json());


app.post('/api/signUp', async (req, res) => {
    const { firstName, emailId, password, confirmPassword, gender, ...rest } = req.body;

    if (!firstName || !emailId || !password || !confirmPassword) {
        return res.status(400).json({ message: 'First name, email, password and confirm password are required' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Password and confirm password do not match' });
    }

    if (!gender || !['male', 'female', 'other'].includes(gender.toLowerCase())) {
        return res.status(400).json({ message: 'Invalid gender value' });
    }

    try {
        const user = new User({ firstName, emailId, password, confirmPassword, gender, ...rest });
        await user.save();
        res.status(200).json({ message: 'User registered successfully' });
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
