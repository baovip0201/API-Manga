const express = require('express');
const router = express.Router();
const chapterController=require('../controllers/chapter')
const bodyParser = require('body-parser');
const {checkPermissions}=require('../middleware/check-permission')


router.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }))
router.use(bodyParser.json({limit: '10mb'}))


router.get('/:mangaId', chapterController.getAllChaptersByMangaId)
router.get('/:mangaId/:chapterId', chapterController.getChapterById)
router.post('/', chapterController.createChapter)
router.post('/json', chapterController.getChaptersFromJson)
router.patch('/:chapterId', chapterController.updateChapter)
router.delete('/:chapterId',chapterController.deleteChapter)
router.delete('/all/:mangaId',chapterController.deleteAllChapterById)

module.exports=router