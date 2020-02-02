const router = require('express').Router();
const auth = require('./auth');
const articlesController = require('../controllers/articles');

router.param('article', articlesController.preloadArticle);

router.post('/', auth.required, articlesController.createArticle);

router.get('/:article', auth.optional, articlesController.getArticle);

router.put('/:article', auth.required, articlesController.updateArticle);

router.delete('/:article', auth.required, articlesController.deleteArticle);

module.exports = router;
