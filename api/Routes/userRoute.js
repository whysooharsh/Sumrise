const { Router } = require("express");
const rateLimit = require("express-rate-limit");
const userController = require('../Controllers/userController');
const verifyTokenMiddleware = require('../middleware/tokenMiddleware');

const router = Router();

const createUserLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: { message: "Too many user creation requests. Try later." }
});

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', createUserLimiter, userController.createUser);
router.put('/:id', verifyTokenMiddleware, userController.updateUser);
router.delete('/:id', verifyTokenMiddleware, userController.deleteUser);
router.get('/profile', verifyTokenMiddleware, userController.getUserProfile);

module.exports = router;
