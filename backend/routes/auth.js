const { Router } = require('express');
const { handleSignup, handleLogin, handleGetCurrentUser } = require('../controllers/auth');
const { authMiddleware } = require('../middleware/auth');

const router = Router();

router.post('/signup', handleSignup);
router.post('/login', handleLogin);
router.get('/me', authMiddleware, handleGetCurrentUser);

module.exports = router; 