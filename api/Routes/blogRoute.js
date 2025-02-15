const { Router } = require("express");
const multer = require("multer");
const router = Router();
const upload = multer({ dest: 'uploads/' });

const blogController = require('../Controllers/blogController'); 
const authMiddleware = require('../middleware/authMiddleware'); 
router.post('/', authMiddleware, upload.single('file'), blogController.createPost);
router.post('/post', authMiddleware, upload.single('file'), blogController.createPost);

router.get('/', blogController.getAllPosts);
router.get('/:id', blogController.getPostById);
router.put('/:id', blogController.updatePost);
router.delete('/:id', blogController.deletePost);

module.exports = router;
