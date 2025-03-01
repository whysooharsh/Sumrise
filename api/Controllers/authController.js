require("dotenv").config();
const bcrypt = require('bcryptjs');
const User = require('../Models/User');
const { createToken } = require('../utils/jwtUtils');

const saltRounds = 10;

const crypto = require('crypto');

function encryptToken(token) {
    const algorithm = 'aes-256-ctr';
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(process.env.ENCRYPTION_SECRET, 'salt', 32);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

function decryptToken(encryptedToken) {
    const [iv, encrypted] = encryptedToken.split(':');
    const algorithm = 'aes-256-ctr';
    const key = crypto.scryptSync(process.env.ENCRYPTION_SECRET, 'salt', 32);
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(Buffer.from(encrypted, 'hex'), 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}


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

            const passOk = await bcrypt.compare(password, userDoc.password);
            if (!passOk) {
                return res.status(400).json({ message: "Wrong credentials" });
            }

            const token = createToken(userDoc);
            const encryptedToken = encryptToken(token);

            res.cookie('token', encryptedToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 60 * 60 * 1000, // 1 hour
                path: '/',
                domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : 'localhost'
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

            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newUser = await User.create({
                username,
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

    profile: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json(user);
        } catch (err) {
            console.error("Profile Error:", err);
            res.status(500).json({ message: "Error checking profile" });
        }
    },

    logout: (req, res) => {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : 'localhost'
        }).json({ message: "Logged out successfully" });
    }
};
