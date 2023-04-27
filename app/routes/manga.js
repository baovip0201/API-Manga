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


router.get('/', checkAuth, checkPermissions('read Manga'), cache, mangaController.getAllManga)
router.get('/:mangaId', checkAuth, checkPermissions('read Manga'), cache, mangaController.getMangaById)
router.get('/search/:q', checkAuth, checkPermissions('read Manga'), cache, mangaController.searchManga)
router.post('/', checkAuth, checkPermissions('create Manga'), mangaController.createManga)
router.post('/:mangaId/view', checkAuth, checkPermissions('create Manga'), mangaController.viewManga)
router.patch('/:mangaId', checkAuth, checkPermissions('update Manga'), mangaController.updateManga)
router.delete('/:mangaId', checkAuth, checkPermissions('delete Manga'), mangaController.deleteManga)

router.get('/:mangaId/chapters', checkAuth, checkPermissions('read Chapter'), cache, chapterController.getAllChaptersByMangaId)
router.get('/:mangaId/chapter/:chapterId', checkAuth, checkPermissions('read Chapter'), cache, chapterController.getChapterById)
router.post('/:mangaId/chapter', checkAuth, checkPermissions('create Chapter'), chapterController.createChapter)
router.post('/chapter/json', checkAuth, checkPermissions('create Chapter'), chapterController.getChaptersFromJson)
router.patch('/:mangaId/chapter/:chapterId', checkAuth, checkPermissions('update Chapter'), chapterController.updateChapter)
router.delete('/:mangaId/chapter/:chapterId', checkAuth, checkPermissions('delete Chapter'), chapterController.deleteChapter)
router.delete('/:mangaId/chapters', checkAuth, checkPermissions('delete Chapter'), chapterController.deleteAllChapterById)

router.get('/:mangaId/chapter/:chapterId/comments', checkAuth, checkPermissions('read Comment'), cache, commentController.getAllComments)
router.post('/:mangaId/chapter/:chapterId/comment', checkAuth, checkPermissions('create Comment'), commentController.createComment)
router.patch(':mangaId/chapter/:chapterId/comment/:commentId', checkAuth, checkPermissions('update Comment'), commentController.updateComment)
router.delete('/:mangaId/chapter/:chapterId/comment/:commentId', checkAuth, checkPermissions('delete Comment'), commentController.deleteComment)

router.get('/favorites', checkAuth, checkPermissions('read Favorite'), cache, favoriteController.getMangaFavoriteByUser)
router.get('/:mangaId/fans', checkAuth, checkPermissions('read Favorite'), cache, favoriteController.getFansManga)
router.post('/favorite', checkAuth, checkPermissions('create Favorite'), favoriteController.addFavoriteManga)
router.delete('/:mangaId/favorite', checkAuth, checkPermissions('delete Favorite'), favoriteController.removeFavorite)

router.get('/:mangaId/ratings', checkAuth, cache, checkPermissions('read Rating'), ratingController.getRating)
router.post('/:mangaId/rating', checkAuth, checkPermissions('create Rating'), ratingController.createRating)


module.exports = router