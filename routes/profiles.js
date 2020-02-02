const router = require('express').Router();
const profilesController = require('../controllers/profiles');
const auth = require('./auth');

router.param('username', profilesController.preloadArticle);
router.get('/:username', auth.optional, profilesController.getProfile);

router.post('/:username/follow', auth.required, profilesController.follow);
router.delete('/:username/follow', auth.required, profilesController.unFollow);

module.exports = router;
