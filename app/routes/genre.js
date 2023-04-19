const express = require('express');
const router = express.Router();
const genreController=require('../controllers/genre')
const bodyParser = require('body-parser');


router.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }))
router.use(bodyParser.json({limit: '10mb'}))


router.get('/', genreController.getAllGenre)
router.get('/:genreId', genreController.getGenreById)
router.post('/', genreController.createGenre)
router.patch('/:genreId', genreController.updateGenre)
router.delete('/:genreId',genreController.deleteGenre)

module.exports=router