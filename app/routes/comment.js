const express = require('express');
const router = express.Router();
const commentController=require('../controllers/comment')
const bodyParser = require('body-parser');
const checkAuth=require('../middleware/auth')
const checkPermissions=require('../middleware/check-permission')

router.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }))
router.use(bodyParser.json({limit: '10mb'}))


router.get('/:mangaId/:chapterId', commentController.getAllComments)
router.post('/:mangaId/:chapterId',checkAuth, commentController.createComment)
router.patch('/:commentId', checkAuth , commentController.updateComment)
router.delete('/:commentId',commentController.deleteComment)

module.exports=router