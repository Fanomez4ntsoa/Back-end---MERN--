const express = require('express');
const { register, getUsers, login, getUserProfile, updateUserProfile, deleteUser, getUserById, updateUser } = require('../controllers/UserController');
const { protect, admin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.route('/')
    .post(register)
    .get(protect, admin, getUsers)
router.post('/login', login)
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile)
router.route('/:id')
    .delete(protect, admin, deleteUser)
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser)


module.exports = router;