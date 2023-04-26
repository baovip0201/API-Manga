const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating-manga')
const bodyParser = require('body-parser');
const checkAuth = require('../middleware/auth-token')
const { checkPermissions } = require('../middleware/check-permission')


router.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }))
router.use(bodyParser.json({ limit: '10mb' }))


router.get('/:mangaId', checkAuth, checkPermissions('read Rating'), ratingController.getRating)
router.post('/:mangaId', checkAuth, checkPermissions('create Rating'), ratingController.createRating)

module.exports = router