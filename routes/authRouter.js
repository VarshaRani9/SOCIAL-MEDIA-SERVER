const router = require('express').Router();
const AuthController = require('../controllers/authController.js')

router.post('/signup',AuthController.signupController);
router.post('/login',AuthController.loginController);
router.get('/refresh',AuthController.refreshAccessTokenController);
router.post('/logout',AuthController.logoutController);

module.exports = router;