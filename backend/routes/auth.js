const { Router } = require('express');
const { handleSignup, handleLogin } = require('../controllers/auth');

const router = Router();

router.post('/signup', handleSignup);
router.post('/login', handleLogin);

module.exports = router; 