const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
  
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});


const fileFilter = (req, file, cb) => {
 
    const fileTypes = /jpeg|jpg|png|gif|webp/;
  
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
 
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Error: Images Only! (jpeg, jpg, png, gif, webp)'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, 
    }
});

const blogController = require('../Controllers/blogController'); 
const verifyTokenMiddleware = require('../middleware/tokenMiddleware');


const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
        }
        return res.status(400).json({ message: err.message });
    } else if (err) {
        return res.status(400).json({ message: err.message });
    }
    next();
};

router.get('/', blogController.getAllPosts);
router.get('/:id', blogController.getPostById);
router.post('/post', 
    verifyTokenMiddleware, 
    upload.single('file'), 
    handleMulterError,
    blogController.createPost
);
router.put('/:id', 
    verifyTokenMiddleware, 
    upload.single('file'), 
    handleMulterError,
    blogController.updatePost
);
router.delete('/:id', verifyTokenMiddleware, blogController.deletePost);
router.get('/user-posts', verifyTokenMiddleware, blogController.getUserPosts);

module.exports = router;