const express = require('express');
const router = express.Router();
const mangaController=require('../controllers/manga')
const bodyParser = require('body-parser');


router.use(bodyParser.json())

router.get('/', mangaController.getAllManga)
router.get('/:id', mangaController.getMangaById)
router.get('/search/:q', mangaController.searchManga)
router.post('/', mangaController.createManga)
router.patch('/:id', mangaController.updateManga)
router.delete('/:id',mangaController.deleteManga)

module.exports=router