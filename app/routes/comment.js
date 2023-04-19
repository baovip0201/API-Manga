const express = require('express');
const router = express.Router();
const commentController=require('../controllers/comment')
const bodyParser = require('body-parser');


router.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }))
router.use(bodyParser.json({limit: '10mb'}))


router.get('/:mangaId/:chapterId', commentController.getAllComments)
router.post('/', commentController.createComment)
router.patch('/:commentId', commentController.updateComment)
router.delete('/:commnetId',commentController.deleteComment)

module.exports=router