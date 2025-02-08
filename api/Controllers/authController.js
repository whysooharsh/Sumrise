const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const secret = process.env.JWT_SECRET || 'fallback_secret';
const salt = bcrypt.genSaltSync(10);

module.exports = {
    login: async (req, res) => {
        const {username, password} = req.body;
        try {
            const userDoc = await User.findOne({username});
            if (!userDoc) {
                return res.status(400).json('User not found');
            }
            const passOk = bcrypt.compareSync(password, userDoc.password);
            if (passOk) {
                jwt.sign({username, id: userDoc._id}, secret, {}, (err, token) => {
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
        const {username, password} = req.body;
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
