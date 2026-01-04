const { Router } = require("express");
const multer = require('multer');
const router = Router();

const blogController = require('../Controllers/blogController');

const uploadMiddleware = multer({ dest: "uploads/" });

router.get('/', blogController.getAllPosts);
router.get('/:id', blogController.getPostById);
router.post('/', uploadMiddleware.single('file'), blogController.createPost);
router.put('/:id', uploadMiddleware.single('file'), blogController.updatePost);
router.delete('/:id', blogController.deletePost);

module.exports = router;
