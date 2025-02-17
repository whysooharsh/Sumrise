require("dotenv").config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const secret = process.env.JWT_SECRET || 'fallback_secret';
const saltRounds = 10;

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

module.exports = {
    login: async (req, res) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required." });
        }

        try {
            const userDoc = await User.findOne({ username });
            if (!userDoc) {
                return res.status(400).json({ message: "User not found" });
            }

            const passOk = bcrypt.compareSync(password, userDoc.password);
            if (!passOk) {
                return res.status(400).json({ message: "Wrong credentials" });
            }

            const token = createToken(userDoc);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 1000,
                path: '/'
            }).json({
                id: userDoc._id,
                username,
                message: "Login successful"
            });

        } catch (err) {
            console.error("Login Error:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    register: async (req, res) => {
        const { username, password } = req.body;

        try {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: "Username already exists" });
            }

            const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds));

            const newUser = await User.create({
                username: username,
                password: hashedPassword
            });

            res.status(201).json({
                id: newUser._id,
                username: newUser.username,
                message: "User registered successfully"
            });

        } catch (err) {
            console.error("Registration Error:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    profile: (req, res) => {
        try {
            const token = req.cookies.token;
            if (!token) {
                return res.status(401).json({ message: "Not logged in" });
            }

            const userInfo = verifyToken(token);
            if (!userInfo) {
                return res.status(401).json({ message: "Invalid or expired token" });
            }

            res.json(userInfo);

        } catch (err) {
            console.error("Profile Error:", err);
            res.status(500).json({ message: "Error checking profile" });
        }
    },

    refreshToken: (req, res) => {
        const token = req.cookies.token;
        const userInfo = verifyToken(token);

        if (!userInfo) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        const newToken = createToken(userInfo);
        res.cookie('token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000,
            path: '/'
        }).json({ message: "Token refreshed" });
    },

    logout: (req, res) => {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        }).json({ message: "Logged out successfully" });
    }
};
