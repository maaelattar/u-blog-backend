const router = require('express').Router();
const profilesController = require('../controllers/profiles');
const auth = require('./auth');
router.param('username', profilesController.preloadArticle);

router.get('/:username', auth.optional, profilesController.getProfile);

module.exports = router;
