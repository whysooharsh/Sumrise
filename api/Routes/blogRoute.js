const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const rateLimit = require("express-rate-limit");

const blogController = require('../Controllers/blogController'); 
const verifyTokenMiddleware = require('../middleware/tokenMiddleware');

const router = Router();

// === Global Rate Limiter ===
const globalLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 200,
    message: { message: "Too many requests from this IP, please try again later." }
});
router.use(globalLimiter);

// === Multer Setup ===
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif|webp/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) cb(null, true);
    else cb(new Error('Error: Images Only! (jpeg, jpg, png, gif, webp)'), false);
};
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE')
        return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    if (err) return res.status(400).json({ message: err.message });
    next();
};

// === Route-specific Rate Limiters ===
const postLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10,
    message: { message: "Too many posts created. Try again later." }
});
const putLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10,
    message: { message: "Too many updates. Try again later." }
});
const deleteLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10,
    message: { message: "Too many deletes. Try again later." }
});
const userPostsRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: "Too many requests. Please try again later." }
});

// === Blog Routes ===
router.get('/', blogController.getAllPosts);
router.get('/:id', blogController.getPostById);

router.post('/post', 
    postLimiter,
    verifyTokenMiddleware, 
    upload.single('file'), 
    handleMulterError,
    blogController.createPost
);

router.put('/:id', 
    putLimiter,
    verifyTokenMiddleware, 
    upload.single('file'), 
    handleMulterError,
    blogController.updatePost
);

router.delete('/:id', deleteLimiter, verifyTokenMiddleware, blogController.deletePost);

router.get('/user-posts', userPostsRateLimiter, verifyTokenMiddleware, blogController.getUserPosts);

module.exports = router;
