const { Router } = require("express");
const multer = require("multer");
const router = Router();
const upload = multer({ dest: 'uploads/' });

const blogController = require('../Controllers/blogController'); 
const verifyTokenMiddleware = require('../middleware/tokenMiddleware');

router.get('/', blogController.getAllPosts);
router.get('/:id', blogController.getPostById);
router.post('/post', verifyTokenMiddleware, upload.single('file'), blogController.createPost);
router.put('/:id', verifyTokenMiddleware, upload.single('file'), blogController.updatePost);
router.delete('/:id', verifyTokenMiddleware, blogController.deletePost);

module.exports = router;