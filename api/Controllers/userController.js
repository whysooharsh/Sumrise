require("dotenv").config();
const User = require('../Models/User');
const bcrypt = require('bcryptjs');

module.exports = {
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find({}, { password: 0 });
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: "Error fetching users" });
        }
    },

    getUserById: async (req, res) => {
        try {
            const user = await User.findById(req.params.id, { password: 0 });
            if (!user) return res.status(404).json({ message: "User not found" });
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: "Error fetching user" });
        }
    },

    createUser: async (req, res) => {
        try {
            const { username, password, email } = req.body;
            
            const existingUser = await User.findOne({ $or: [{ username }, { email }] });
            if (existingUser) {
                return res.status(400).json({ message: "Username or email already exists" });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = await User.create({
                username,
                password: hashedPassword,
                email
            });

            res.json({
                id: user._id,
                username: user.username,
                email: user.email
            });
        } catch (error) {
            res.status(500).json({ message: "Error creating user" });
        }
    },

    updateUser: async (req, res) => {
        try {
            if (req.user.id !== req.params.id) {
                return res.status(403).json({ message: "Not authorized" });
            }

            const { username, email, password } = req.body;
            const updateData = {};
            
            if (username) {
                if (typeof username !== "string") {
                    return res.status(400).json({ message: "Invalid username" });
                }
                updateData.username = username;
            }
            if (email) {
                if (typeof email !== "string") {
                    return res.status(400).json({ message: "Invalid email" });
                }
                updateData.email = email;
            }
            if (password) {
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(password, salt);
            }

            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                { $set: updateData },
                { new: true, select: '-password' }
            );

            res.json(updatedUser);
        } catch (error) {
            res.status(500).json({ message: "Error updating user" });
        }
    },

    deleteUser: async (req, res) => {
        try {
            if (req.user.id !== req.params.id) {
                return res.status(403).json({ message: "Not authorized" });
            }

            await User.findByIdAndDelete(req.params.id);
            res.clearCookie('token');
            res.json({ message: "User deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting user" });
        }
    },

    getUserProfile: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: "Error fetching profile" });
        }
    }
};
