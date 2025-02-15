const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const secret = process.env.JWT_SECRET || 'fallback_secret';
const salt = bcrypt.genSaltSync(10);

module.exports = {
    login: async (req, res) => {
        const {username, password} = req.body;

        if (!username || !password) {
            console.log("Validation Error: Missing username or password"); // Debugging line
            return res.status(400).json({ message: "Username and password are required." });
        }

        try {
            const userDoc = await User.findOne({username});
            if (!userDoc) {
                console.log("Validation Error: User not found"); // Debugging line
                return res.status(400).json('User not found');
            }
            const passOk = bcrypt.compareSync(password, userDoc.password);
            if (passOk) {
                jwt.sign({username, id: userDoc._id}, secret, {}, (err, token) => {
                    if (err) throw err;
                    console.log("Login successful:", userDoc); // Debugging line
                    res.cookie('token', token).json({
                        id: userDoc._id,
                        username,
                    });
                });
            } else {
                console.log("Validation Error: Incorrect password"); // Debugging line
                res.status(400).json('wrong credentials');
            }
        } catch (err) {
            console.error("Server Error:", err); // Debugging line
            res.status(500).json('Internal server error');
        }
    },

    register: async (req, res) => {
        const {username, password} = req.body;
        try {
            const userDoc = await User.create({
                username:username,
                password: bcrypt.hashSync(password, salt),
            });
            res.json(userDoc);
        }catch(e) {
            res.status(400).json(e);
        }
    },
    profile: (req, res) => {
        try {
            const { token } = req.cookies;
            console.log("JWT Secret:", process.env.JWT_SECRET);

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
