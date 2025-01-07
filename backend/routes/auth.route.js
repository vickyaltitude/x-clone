const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const protectGetMeRoute = require('../middlewares/protectGetMeRoute');

router.post('/signup',authController.signup)

router.post('/login',authController.login)

router.post('/logout',authController.logout)

router.get('/me',protectGetMeRoute,authController.getMe)

module.exports = router;