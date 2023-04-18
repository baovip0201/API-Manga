const express = require('express');
const router = express.Router();
const genreController=require('../controllers/genre')
const bodyParser = require('body-parser');


router.use(bodyParser.json())

router.get('/', genreController.getAllGenre)
router.get('/:id', genreController.getGenreById)
router.post('/', genreController.createGenre)
router.patch('/:id', genreController.updateGenre)
router.delete('/:id',genreController.deleteGenre)

module.exports=router