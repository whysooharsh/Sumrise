const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');


if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in environment variables');
    process.exit(1);
}

const secret = process.env.JWT_SECRET;
const salt = bcrypt.genSaltSync(10);

module.exports = {
    login: async (req, res) => {
        const { Username, Password } = req.body;
        const username = Username.toLowerCase();
        const password = Password.toLowerCase();

        try {
            const userDoc = await User.findOne({ username });
            if (!userDoc) {
                return res.status(400).json('User not found');
            }
            const passOk = bcrypt.compareSync(password, userDoc.password);
            if (passOk) {
                jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token).json({
                        id: userDoc._id,
                        username,
                    });
                });
            } else {
                res.status(400).json('wrong credentials');
            }
        } catch (err) {
            res.status(500).json('Internal server error');
        }
    },

    register: async (req, res) => {
        const { Username, Password } = req.body;
        const username = Username.toLowerCase();
        const password = Password.toLowerCase();

        try {
            const userDoc = await User.create({
                username,
                password: bcrypt.hashSync(password, salt),
            });
            res.json(userDoc);
        } catch (e) {
            res.status(400).json(e);
        }
    },
    profile: (req, res) => {
        try {
            const { token } = req.cookies;
            if (!token) return res.status(401).json({ message: "NOT LOGIN" });
    
            jwt.verify(token, secret, {}, (err, info) => {
                if (err) {
                    console.error("Token Verification Error:", err);
                    return res.status(401).json({ message: "Invalid token" });
                }
                res.json(info);
            });
        } catch (err) {
            console.error("Profile Error:", err);
            res.status(500).json({ message: "Error checking profile" });
        }
    },
    

    refreshToken: async (req, res) => {
        const {token} = req.cookies;
        jwt.verify(token, secret, {}, (err, info) => {
            if (err) throw err;
            res.json(info);
        });
    },

    logout: (req, res) => {
        res.cookie('token', '').json('ok');
    }
};
