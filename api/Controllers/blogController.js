require("dotenv").config();
const multer = require('multer');
const fs = require('fs');
const Post = require('../Models/Post');
const upload = multer({ dest: 'uploads/' });

module.exports = {
    getAllPosts: async (req, res) => {
        try {
            const posts = await Post.find()
                .populate('author', ['username'])
                .sort({ createdAt: -1 });
            res.json(posts);
        } catch (error) {
            res.status(500).json({ message: "Error fetching posts", error: error.message });
        }
    },

    getPostById: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id).populate('author', ['username']);
            if (!post) return res.status(404).json({ message: "Post not found" });
            res.json(post);
        } catch (error) {
            res.status(500).json({ message: "Error fetching post" });
        }
    },

    createPost: async (req, res) => {
        try {
            let filePath = null;
            if (req.file) {
                filePath = req.file.path;
            }

            const { title, summary, content } = req.body;
            const postDoc = await Post.create({
                title,
                summary,
                content,
                cover: filePath,
                author: req.user.id,
            });
            res.status(201).json(postDoc);
        } catch (error) {
            console.error('Create post error:', error);
            res.status(500).json({ message: "Error creating post" });
        }
    },

    updatePost: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            if (!post) return res.status(404).json({ message: "Post not found" });
            
            const isAuthor = JSON.stringify(post.author) === JSON.stringify(req.user.id);
            if (!isAuthor) return res.status(403).json({ message: "You are not the author" });

            let filePath = post.cover;
            if (req.file) {
                if (typeof req.file.path !== 'string' || !/^[\w\-./]+$/.test(req.file.path)) {
                    return res.status(400).json({ message: "Invalid file path" });
                }
                filePath = req.file.path;
            }

            const { title, summary, content } = req.body;
            await Post.findByIdAndUpdate(req.params.id, {
                title,
                summary,
                content,
                cover: filePath
            });

            res.json({ message: "Post updated successfully" });
        } catch (error) {
            console.error('Update post error:', error);
            res.status(500).json({ message: "Error updating post" });
        }
    },

    deletePost: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            if (!post) return res.status(404).json({ message: "Post not found" });

            const isAuthor = JSON.stringify(post.author) === JSON.stringify(req.user.id);
            if (!isAuthor) return res.status(403).json({ message: "You are not the author" });

            await Post.findByIdAndDelete(req.params.id);
            res.json({ message: "Post deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting post" });
        }
    },

    getUserPosts: async (req, res) => {
        try {
            const posts = await Post.find({ author: req.user.id })
                .sort({ createdAt: -1 });
            res.json(posts);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};