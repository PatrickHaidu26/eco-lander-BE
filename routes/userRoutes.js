const express = require('express');
const router = express.Router();
const { getUserById, updateUser, deleteUser, getAllUsers, getUserByEmail } = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('', authMiddleware, getUserById);
router.get('/all', authMiddleware, getAllUsers);
router.get('/getByEmail/:email', authMiddleware, getUserByEmail);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;