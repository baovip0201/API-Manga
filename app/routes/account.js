const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account')
const bodyParser = require('body-parser');
const checkAuth = require('../middleware/auth-token')
const upload = require('../middleware/upload-avatar')
const { checkPermissions } = require('../middleware/check-permission')

router.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }))
router.use(bodyParser.json({ limit: '10mb' }))

router.post('/login', accountController.login)
router.post('/register', accountController.register)
router.post('/reset-password', accountController.resetPassword)
router.post('/reset-password/:token', accountController.resetPasswordToken)
router.post('/verifyOTP', checkAuth, checkPermissions('create Account'), accountController.verifyOtp)
router.post('/change-password/', checkAuth, checkPermissions('create Account'), accountController.changePassword)

router.get('/google', accountController.loginWithGoogle)
router.get('/auth/google/callback', accountController.loginWithGoogleCallback)
router.get('/sendOTP', checkAuth, checkPermissions('read Account'), accountController.sendOtpToEmail)
router.get('/verify/:token', accountController.verifyAccountAfterRegister)

router.patch('/', checkAuth, checkPermissions('update Account'), upload.single('avatar'), accountController.updateAccount)

module.exports = router