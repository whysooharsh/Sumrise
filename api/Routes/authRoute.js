const { Router } = require("express");
const router = Router();

const authController = require('../Controllers/authController');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/refresh-token', authController.refreshToken);
router.get("/profile", authController.profile);
router.post("/logout", authController.logout); 

module.exports = router;
