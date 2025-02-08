const { Router } = require("express");
const router = Router();

const blogController = require('../Controllers/blogController'); // added controller import

router.get('/', blogController.getAllPosts);
router.get('/:id', blogController.getPostById);
router.post('/', blogController.createPost);
router.put('/:id', blogController.updatePost);
router.delete('/:id', blogController.deletePost);

module.exports = router;
