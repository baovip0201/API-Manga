const express = require('express');
const router = express.Router();
const favoriteController=require('../controllers/favorite')
const bodyParser = require('body-parser');
const checkAuth=require('../middleware/auth');

router.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }))
router.use(bodyParser.json({limit: '10mb'}))


router.get('', favoriteController.getMangaFavoriteByUser)
router.get('/:mangaId', favoriteController.getFansManga)
router.post('/',checkAuth, favoriteController.addFavoriteManga )
router.delete('/:mangaId',favoriteController.removeFavorite)

module.exports=router