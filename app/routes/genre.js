const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genre')
const bodyParser = require('body-parser');
const checkAuth = require('../middleware/auth-token')
const { checkPermissions } = require('../middleware/check-permission')
const { cache } = require('../middleware/caching')


router.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }))
router.use(bodyParser.json({ limit: '10mb' }))


router.get('/', checkAuth, checkPermissions(['user', 'admin']), cache, genreController.getAllGenre)
router.get('/:genreId', checkAuth, checkPermissions(['user', 'admin']), genreController.getGenreById)
router.get('/find/:genreName', checkAuth, checkPermissions(['user', 'admin']), cache, genreController.findMangaByGenre)
router.post('/', checkAuth, checkPermissions(['admin']), genreController.createGenre)
router.patch('/:genreId', checkAuth, checkPermissions(['admin']), genreController.updateGenre)
router.delete('/:genreId', checkAuth, checkPermissions(['admin']), genreController.deleteGenre)

module.exports = router