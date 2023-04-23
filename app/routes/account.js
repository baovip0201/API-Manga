const express = require('express');
const router = express.Router();
const accountController=require('../controllers/account')
const bodyParser = require('body-parser');
const checkAuth=require('../middleware/auth')
const upload=require('../middleware/upload-avatar')

router.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }))
router.use(bodyParser.json({limit: '10mb'}))

router.post('/login', accountController.login)
router.post('/reset-password', accountController.resetPassword)
router.post('/reset-password/:token', accountController.resetPasswordToken)
router.get('/google', accountController.loginWithGoogle)
router.get('/auth/google/callback', accountController.loginWithGoogleCallback)
router.post('/register', accountController.register)
router.patch('/:username', checkAuth, upload.single('avatar'), accountController.updateAccount)

module.exports=router