const { Router } = require("express");
const rateLimit = require("express-rate-limit");
const authController = require('../Controllers/authController');
const verifyTokenMiddleware = require('../middleware/tokenMiddleware');

const router = Router();

// Rate limiters
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: { message: "Too many login attempts. Please try again later." }
});

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    message: { message: "Too many registration attempts. Please try again later." }
});

router.post('/login', loginLimiter, authController.login);
router.post('/register', registerLimiter, authController.register);
router.get('/profile', verifyTokenMiddleware, authController.profile);
router.post('/logout', verifyTokenMiddleware, authController.logout);

module.exports = router;
