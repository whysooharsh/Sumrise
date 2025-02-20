const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'fallback_secret';

const createToken = (user) => {
    return jwt.sign(
        { id: user._id, username: user.username },
        secret,
        { expiresIn: '1h' }
    );
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        return null;
    }
};

module.exports = { createToken, verifyToken };
