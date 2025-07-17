const multer = require('multer');
const fs = require('fs');
const Post = require('../Models/Post');
const jwt = require('jsonwebtoken');

const uploadMiddleware = multer({ dest: "uploads/" });

module.exports = {
    getAllPosts: async (req, res) => {
        try {
            const posts = await Post.find()
                .populate('author', ['username'])
                .sort({ createdAt: -1 });
            res.json(posts);
        } catch (error) {
            res.status(500).json({ message: "Error fetching posts" });
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
        const { title, summary, content } = req.body;
        const { token } = req.cookies;
        
        if (!token) return res.status(401).json({ message: "Not authenticated" });

        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
            if (err) {
                return res.status(401).json({ message: "Invalid token" });
            }

            let newPath = null;
            if (req.file) {
                const { originalname, path } = req.file;
                const ext = originalname.split('.').pop();
                const filename = `${path}.${ext}`;
                fs.renameSync(path, filename);
                // Ensure forward slashes for URLs (replace backslashes on Windows)
                newPath = filename.replace(/\\/g, '/');
            }

            try {
                const postDoc = await Post.create({
                    title,
                    summary,
                    content,
                    cover: newPath,
                    author: info.id,
                });
                res.json(postDoc);
            } catch (error) {
                res.status(500).json({ message: "Error creating post" });
            }
        });
    },

    updatePost: async (req, res) => {
        try {
            const { token } = req.cookies;
            if (!token) return res.status(401).json({ message: "Not authenticated" });

            jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
                if (err) return res.status(401).json({ message: "Invalid token" });

                const post = await Post.findById(req.params.id);
                if (!post) return res.status(404).json({ message: "Post not found" });
                
                const isAuthor = JSON.stringify(post.author) === JSON.stringify(info.id);
                if (!isAuthor) return res.status(400).json({ message: "You are not the author" });

                let newPath = post.cover;
                if (req.file) {
                    const { originalname, path } = req.file;
                    const ext = originalname.split('.').pop();
                    const filename = `${path}.${ext}`;
                    fs.renameSync(path, filename);
                    // Ensure forward slashes for URLs (replace backslashes on Windows)
                    newPath = filename.replace(/\\/g, '/');
                }

                const { title, summary, content } = req.body;
                await Post.findByIdAndUpdate(req.params.id, {
                    title,
                    summary,
                    content,
                    cover: newPath
                });

                res.json({ message: "Post updated successfully" });
            });
        } catch (error) {
            res.status(500).json({ message: "Error updating post" });
        }
    },

    deletePost: async (req, res) => {
        try {
            const { token } = req.cookies;
            if (!token) return res.status(401).json({ message: "Not authenticated" });

            jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
                if (err) return res.status(401).json({ message: "Invalid token" });

                const post = await Post.findById(req.params.id);
                if (!post) return res.status(404).json({ message: "Post not found" });

                const isAuthor = JSON.stringify(post.author) === JSON.stringify(info.id);
                if (!isAuthor) return res.status(400).json({ message: "You are not the author" });

                await Post.findByIdAndDelete(req.params.id);
                res.json({ message: "Post deleted successfully" });
            });
        } catch (error) {
            res.status(500).json({ message: "Error deleting post" });
        }
    }
};
