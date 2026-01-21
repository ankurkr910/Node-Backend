const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const { userAuth } = require('./middlewares/auth');
require('dotenv').config();
const app = express();
const PORT = 7777;

app.use(express.json());
app.use(cookieParser());
app.use('/', require('./routes/auth'));
app.use('/user', userAuth, require('./routes/user'));
app.use('/request', userAuth, require('./routes/request'));

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
