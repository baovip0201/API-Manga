const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genre')
const bodyParser = require('body-parser');
const checkAuth = require('../middleware/auth-token')
const { checkPermissions } = require('../middleware/check-permission')
const { cache } = require('../middleware/caching')


router.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }))
router.use(bodyParser.json({ limit: '10mb' }))


router.get('/', checkAuth, checkPermissions('read Genre'), cache, genreController.getAllGenre)
router.get('/:genreId', checkAuth, checkPermissions('read Genre'), genreController.getGenreById)
router.post('/', checkAuth, checkPermissions('create Genre'), genreController.createGenre)
router.patch('/:genreId', checkAuth, checkPermissions('update Genre'), genreController.updateGenre)
router.delete('/:genreId', checkAuth, checkPermissions('delete Genre'), genreController.deleteGenre)

module.exports = router