const express = require('express');
const router = express.Router();
const { login, register, getMe, getUsers } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

router.post('/login', login);
router.post('/register', register);
router.get('/me', protect, getMe);
router.get('/users', protect, authorize('Admin', 'Manager'), getUsers);
router.get('/', protect, authorize('Admin', 'Manager'), getUsers);

module.exports = router;
