const { Router } = require("express");
const router = Router();

const userController = require('../Controllers/userController');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.get('/profile', userController.getUserProfile);

module.exports = router;
