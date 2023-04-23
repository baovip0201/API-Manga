const express = require('express');
const router = express.Router();
const mangaController=require('../controllers/manga')
const bodyParser = require('body-parser');


router.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }))
router.use(bodyParser.json({limit: '10mb'}))


router.get('/', mangaController.getAllManga)
router.get('/:mangaId', mangaController.getMangaById)
router.get('/search/:q', mangaController.searchManga)
router.post('/', mangaController.createManga)
router.post('/:mangaId/view', mangaController.viewManga)
router.patch('/:mangaId', mangaController.updateManga)
router.delete('/:mangaId',mangaController.deleteManga)

module.exports=router