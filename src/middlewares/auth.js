const jwt = require('jsonwebtoken');
const user = require('../models/user');


const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: 'Authorization token missing' });
        }
        const { _id } = await jwt.verify(token, process.env.JWT_SECRET);
        const existingUser = await user.findById(_id);

        if (!existingUser) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = existingUser;

        next();

    } catch (error) {
        return res.status(500).json({message: error.message});
    }

}


module.exports = {userAuth};