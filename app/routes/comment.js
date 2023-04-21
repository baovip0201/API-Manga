const express = require('express');
const router = express.Router();
const commentController=require('../controllers/comment')
const bodyParser = require('body-parser');
const passport=require('passport')
const checkAuth=require('../middleware/auth')

router.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }))
router.use(bodyParser.json({limit: '10mb'}))


router.get('/:mangaId/:chapterId', commentController.getAllComments)
router.post('/:mangaId/:chapterId', commentController.createComment)
router.patch('/:commentId', checkAuth , commentController.updateComment)
router.delete('/:commentId',commentController.deleteComment)

module.exports=router