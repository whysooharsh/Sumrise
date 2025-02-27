require('dotenv').config();
const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const app = express();

//checkInstance();


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, 
    legacyHeaders: false, 
});

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 5, 
    message: 'Too many login attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

const createPostLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: 'Post creation limit reached, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter); // this might make me sick
app.use('/api/auth/login', authLimiter); 
app.use('/api/auth/register', authLimiter);
app.use('/api/blogs/post', createPostLimiter);

const cspConfig = {
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "http://localhost:5000", "http://localhost:3000", ""],
        mediaSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameSrc: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: [],
    }
};

// all this shit can't be written my me 


const corsOptions = {
    credentials: true,
    origin: [
        'http://localhost:3000',
        'https://sumrise-nine.vercel.app/' 
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'CSRF-Token'],
};

// this one too
app.use(helmet());
app.use(helmet.contentSecurityPolicy(cspConfig));
app.use(helmet.crossOriginEmbedderPolicy({ policy: "credentialless" }));
app.use(helmet.crossOriginOpenerPolicy({ policy: "same-origin" }));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(helmet.dnsPrefetchControl());
app.use(helmet.frameguard({ action: "deny" }));
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.originAgentCluster());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());


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
    if (err.code === 'EBADCSRFTOKEN') {
        return res.status(403).json({
            error: 'Invalid CSRF token',
            message: 'Form submission failed. Please try again.'
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