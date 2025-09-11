const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const app = express();
const PORT = 7777;

app.use(express.json());


app.post('/api/signUp', async (req, res) => {
    const user = new User({
        firstName: 'Ankur',
        lastName: 'Kumar',
        emailId: 'abc@gmail.com'
    })
    try{
        await user.save();
        res.status(200).json({message: 'User registered successfully'})
    } catch{
        res.status(500).json({message: 'Error registering user', error: err})
    }
 

})

 
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
