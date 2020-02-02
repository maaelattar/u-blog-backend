const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const User = mongoose.model('User');

const preloadArticle = (req, res, next, slug) => {
  Article.findOne({ slug: slug })
    .populate('author')
    .then(article => {
      if (!article) {
        return res.status(404);
      }
      req.article = article;
      return next();
    })
    .catch(next);
};

const createArticle = (req, res, next) => {
  User.findById(req.payload.id)
    .then(user => {
      if (!user) {
        return res.status(401);
      }
      let article = new Article(req.body.article);
      article.author = user;
      return article.save().then(() => {
        console.log(article.author);
        return res.status(201).json({ article: article.toJSONFor(user) });
      });
    })
    .catch(next);
};

const getArticle = (req, res, next) => {
  Promise.all([
    req.payload ? User.findById(req.payload.id) : null,
    req.article.populate('author').execPopulate()
  ])
    .then(results => {
      let user = results[0];
      return res.json({ article: req.article.toJSONFor(user) });
    })
    .catch(next);
};

const updateArticle = (req, res, next) => {
  if (req.article._id.toString() === req.payload.id.toString()) {
    if (typeof req.body.article.title !== 'undefined') {
      req.article.title = req.body.article.title;
    }

    if (typeof req.body.article.description !== 'undefined') {
      req.article.description = req.body.article.description;
    }

    if (typeof req.body.article.body !== 'undefined') {
      req.article.body = req.body.article.body;
    }

    req.article
      .save()
      .then(article => {
        return res.status(200).json({ article: article.toJSONFor(user) });
      })
      .catch(next);
  } else {
    return res.status(403);
  }
};

const deleteArticle = (req, res, next) => {
  User.findById(req.payload.id).then(() => {
    if (req.article.author.toString() === req.payload.id.toString()) {
      return req.article.remove().then(() => {
        return res.status(204);
      });
    } else {
      return res.status(403);
    }
  });
};
const favoriteAnArticle = (req, res, next) => {
  let articleId = req.article._id;
  User.findById(req.payload.id).then(user => {
    if (!user) {
      return res.status(401);
    }
    return user
      .favorite(articleId)
      .then(() => {
        return req.article.updateFavoritesCount().then(article => {
          return res.json({ article: article.toJSONFor(user) });
        });
      })
      .catch(next);
  });
};

const unFavoriteAnArticle = (req, res, next) => {
  let articleId = req.article._id;
  User.findById(req.payload.id).then(user => {
    if (!user) {
      return res.status(401);
    }
    return user
      .unFavorite(articleId)
      .then(() => {
        return req.article.updateFavoritesCount().then(article => {
          return res.json({ article: article.toJSONFor(user) });
        });
      })
      .catch(next);
  });
};
module.exports = {
  preloadArticle,
  createArticle,
  getArticle,
  updateArticle,
  deleteArticle
};