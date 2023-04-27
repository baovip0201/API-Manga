const express = require('express');
const router = express.Router();
const mangaController = require('../controllers/manga')
const chapterController = require('../controllers/chapter');
const commentController = require('../controllers/comment')
const ratingController = require('../controllers/rating-manga')
const favoriteController = require('../controllers/favorite')
const bodyParser = require('body-parser');
const checkAuth = require('../middleware/auth-token')
const { checkPermissions } = require('../middleware/check-permission')
const { cache } = require('../middleware/caching')

router.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }))
router.use(bodyParser.json({ limit: '10mb' }))


router.get('/', checkAuth, checkPermissions(['user', 'admin']), cache, mangaController.getAllManga)
router.get('/:mangaId', checkAuth, checkPermissions(['user', 'admin']), cache, mangaController.getMangaById)
router.get('/top/view', checkAuth, checkPermissions(['user', 'admin']), cache, mangaController.getTopMangaByView)
router.get('/search/:q', checkAuth, checkPermissions(['user', 'admin']), cache, mangaController.searchManga)
router.patch('/:mangaId/view', checkAuth, checkPermissions(['user', 'admin']), mangaController.viewManga)
router.post('/', checkAuth, checkPermissions(['admin']), mangaController.createManga)
router.patch('/:mangaId', checkAuth, checkPermissions(['admin']), mangaController.updateManga)
router.delete('/:mangaId', checkAuth, checkPermissions(['admin']), mangaController.deleteManga)

router.get('/:mangaId/chapters', checkAuth, checkPermissions(['user', 'admin']), cache, chapterController.getAllChaptersByMangaId)
router.get('/:mangaId/chapter/:chapterId', checkAuth, checkPermissions(['user', 'admin']), cache, chapterController.getChapterById)
router.post('/:mangaId/chapter', checkAuth, checkPermissions(['admin']), chapterController.createChapter)
router.post('/chapter/json', checkAuth, checkPermissions(['admin']), chapterController.getChaptersFromJson)
router.patch('/:mangaId/chapter/:chapterId', checkAuth, checkPermissions(['admin']), chapterController.updateChapter)
router.delete('/:mangaId/chapter/:chapterId', checkAuth, checkPermissions(['admin']), chapterController.deleteChapter)
router.delete('/:mangaId/chapters', checkAuth, checkPermissions(['admin']), chapterController.deleteAllChapterById)

router.get('/:mangaId/chapter/:chapterId/comments', checkAuth, checkPermissions(['user', 'admin']), cache, commentController.getAllComments)
router.post('/:mangaId/chapter/:chapterId/comment', checkAuth, checkPermissions(['user', 'admin']), commentController.createComment)
router.patch(':mangaId/chapter/:chapterId/comment/:commentId', checkAuth, checkPermissions(['user', 'admin']), commentController.updateComment)
router.delete('/:mangaId/chapter/:chapterId/comment/:commentId', checkAuth, checkPermissions(['user', 'admin']), commentController.deleteComment)

router.get('/favorites/user', checkAuth, checkPermissions(['user', 'admin']), cache, favoriteController.getMangaFavoriteByUser)
router.get('/:mangaId/fans', checkAuth, checkPermissions(['user', 'admin']), cache, favoriteController.getFansManga)
router.post('/favorite/user', checkAuth, checkPermissions(['user', 'admin']), favoriteController.addFavoriteManga)
router.delete('/:mangaId/favorite', checkAuth, checkPermissions(['user', 'admin']), favoriteController.removeFavorite)

router.get('/:mangaId/ratings/user', checkAuth, checkPermissions(['user', 'admin']), cache, ratingController.getRating)
router.post('/:mangaId/rating/user', checkAuth, checkPermissions(['user', 'admin']), ratingController.createRating)


module.exports = router