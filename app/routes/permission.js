const express = require('express');
const router = express.Router();
const permissionController=require('../controllers/permission')
const bodyParser = require('body-parser');
const checkAuth=require('../middleware/auth-token')

router.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }))
router.use(bodyParser.json({limit: '10mb'}))

router.post('/',permissionController.createPermission)

module.exports=router