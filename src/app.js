const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const { userAuth } = require('./middlewares/auth');
require('dotenv').config();
const app = express();


app.use(express.json());
app.use(cookieParser());
app.use('/', require('./routes/auth'));
app.use('/profile', userAuth, require('./routes/profile'));
app.use('/user', userAuth, require('./routes/user'));
app.use('/request', userAuth, require('./routes/request'));

connectDB().then(() => {
    console.log('Database connection established');
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on http://localhost:${process.env.PORT || 3000}`);
    });
  }
  ).catch((err) => {
    console.error('Database connection error:', err);
  }
  );
