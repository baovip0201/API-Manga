const express = require('express');
const router = express.Router();
const genreController=require('../controllers/genre')
const bodyParser = require('body-parser');
const checkAuth=require('../middleware/auth')
const {checkPermissions}=require('../middleware/check-permission')


router.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }))
router.use(bodyParser.json({limit: '10mb'}))


router.get('/', checkAuth, checkPermissions('read'), genreController.getAllGenre)
router.get('/:genreId', genreController.getGenreById)
router.post('/', checkAuth, checkPermissions('create'), genreController.createGenre)
router.patch('/:genreId', genreController.updateGenre)
router.delete('/:genreId',genreController.deleteGenre)

module.exports=router