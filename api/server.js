require('dotenv').config();
const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const app = express();

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
app.set("trust proxy", true);

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
        connectSrc: ["'self'", "https://sumrise.onrender.com", "https://sumrise-jet.vercel.app"],
        mediaSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameSrc: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: [],
    }
};

const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
      } else {
          callback(new Error("Not allowed by CORS"));
      }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Set-Cookie"],

};


app.use(helmet({
  contentSecurityPolicy: cspConfig,
  crossOriginEmbedderPolicy: { policy: "credentialless" },
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "cross-origin" },
  dnsPrefetchControl: true,
  frameguard: { action: "deny" },
  hidePoweredBy: true,
  hsts: true,
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true,
}));


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

app.use(limiter);

app.use((err, req, res, next) => {
  console.error("Error:", process.env.NODE_ENV === 'development' ? err.stack : err.message);
  res.status(500).json({
      error: 'Something went wrong!',
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