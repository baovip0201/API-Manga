const express = require('express');
const router = express.Router();
const mangaController=require('../controllers/manga')

router.get('/', mangaController.getAllManga)
router.get('/:id', mangaController.getMangaById)
router.post('/', mangaController.createManga)
router.patch('/:id', mangaController.getMangaById)
router.delete('/:id',mangaController.deleteManga)

module.exports=router