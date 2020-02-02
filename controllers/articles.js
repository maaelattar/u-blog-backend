const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const User = mongoose.model('User');
const Comment = mongoose.model('Comment');

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

const preloadComment = (req, res, next, id) => {
  Comment.findById(id)
    .then(comment => {
      if (!comment) {
        return res.status(404);
      }
      req.comment = comment;
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

const getComment = (req, res, next) => {
  Promise.resolve(req.payload ? User.findById(req.payload.id) : null)
    .then(user => {
      return req.article
        .populate({
          path: 'comments',
          populate: {
            path: 'author'
          },
          options: {
            sort: {
              createdAt: 'desc'
            }
          }
        })
        .execPopulate()
        .then(article => {
          return res.json({
            comments: req.article.comments.map(comment => {
              return comment.toJSONFor(user);
            })
          });
        });
    })
    .catch(next);
};

const createComment = (req, res, next) => {
  User.findById(req.payload.id)
    .then(user => {
      if (!user) {
        return res.status(401);
      }
      let comment = new Comment(req.body.comment);
      comment.article = req.article;
      comment.author = user;
      return req.article.save().then(article => {
        res.json({ comment: comment.toJSONFor(user) });
      });
    })
    .catch(next);
};

const deleteComment = (req, res, next) => {
  if (req.comment.author.toString() === req.payload.id.toString()) {
    req.article.comments.remove(req.comment._id);
    req.article
      .save()
      .then(
        Comment.find({ _id: req.comment._id })
          .remove()
          .exec()
      )
      .then(() => {
        res.status(204);
      });
  } else {
    res.status(403);
  }
};

module.exports = {
  preloadArticle,
  preloadComment,
  createArticle,
  getArticle,
  updateArticle,
  deleteArticle,
  favoriteAnArticle,
  unFavoriteAnArticle,
  createComment,
  getComment,
  deleteComment
};
