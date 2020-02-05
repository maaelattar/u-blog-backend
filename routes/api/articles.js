const router = require('express').Router();
const auth = require('../auth');
const articlesController = require('../../controllers/articles');

router.param('article', articlesController.preloadArticle);
router.param('comment', articlesController.preloadComment);

router.get('/', auth.optional, articlesController.getArticles);
router.post('/', auth.required, articlesController.createArticle);
router.get('/feed', auth.optional, articlesController.getFeed);

router.get('/:article', auth.optional, articlesController.getArticle);
router.put('/:article', auth.required, articlesController.updateArticle);
router.delete('/:article', auth.required, articlesController.deleteArticle);

router.post(
  '/:article/favorite',
  auth.required,
  articlesController.favoriteAnArticle
);

router.delete(
  '/:article/favorite',
  auth.required,
  articlesController.unFavoriteAnArticle
);

router.get('/:article/comments', auth.optional, articlesController.getComments);
router.post(
  '/:article/comments',
  auth.required,
  articlesController.createComment
);
router.delete(
  '/:article/comments/:comment',
  auth.required,
  articlesController.deleteComment
);
module.exports = router;
