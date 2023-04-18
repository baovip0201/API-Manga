const express = require('express');
const router = express.Router();
const accountController=require('../controllers/account')
const bodyParser = require('body-parser');
const checkAuth=require('../middleware/auth')


router.use(bodyParser.json())

router.post('/login', accountController.login)
router.post('/register', accountController.register)
router.patch('/', checkAuth, accountController.updateAccount)

module.exports=router