const { Router } = require("express");
const router = Router();

const userController = require('../Controllers/userController');
const verifyTokenMiddleware = require('../middleware/tokenMiddleware');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', verifyTokenMiddleware, userController.updateUser);
router.delete('/:id', verifyTokenMiddleware, userController.deleteUser);
router.get('/profile', verifyTokenMiddleware, userController.getUserProfile);

module.exports = router;
