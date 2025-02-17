require('dotenv').config();
const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

const corsOptions = {
    credentials: true,
    origin: process.env.ORIGIN || "http://localhost:3000", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
        return res.status(400).json({
            error: "Invalid JSON format"
        });
    }
    next();
});

connectDB();

app.use("/api/auth", require('./Routes/authRoute'));
app.use('/api/users', require('./Routes/userRoute'));
app.use('/api/blogs', require('./Routes/blogRoute'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something broke!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 5000;

async function main() {
    try {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

main();
