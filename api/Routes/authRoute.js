const { Router } = require("express");
const router = Router();
const authController = require('../Controllers/authController');
const verifyTokenMiddleware = require('../middleware/tokenMiddleware');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/profile', verifyTokenMiddleware, authController.profile);
router.post('/logout', verifyTokenMiddleware, authController.logout);

module.exports = router;
