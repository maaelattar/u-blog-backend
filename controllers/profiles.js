const User = require('mongoose').model('User');

const preloadArticle = (req, res, next, username) => {
  User.findOne({ username: username })
    .then(user => {
      if (!user) {
        return res.status(404);
      }
      req.profile = user;
      return next();
    })
    .catch(next);
};

const getProfile = (req, res, next) => {
  if (req.payload) {
    User.findById(req.payload.id).then(user => {
      if (!user) {
        return res.json({ profile: req.profile.toProfileJSONFor(false) });
      }
      return res.json({ profile: req.profile.toProfileJSONFor(user) });
    });
  } else {
    return res.json({ profile: req.profile.toProfileJSONFor(false) });
  }
};

const follow = (req, res, next) => {
  let profileId = req.profile._id;
  User.findById(req.payload.id)
    .then(user => {
      if (!user) {
        return res.status(401);
      }
      return user.follow(profileId).then(() => {
        return res.json({ profile: req.profile.toProfileJSONFor(user) });
      });
    })
    .catch(next);
};

const unFollow = (req, res, next) => {
  let profileId = req.profile._id;
  User.findById(req.payload.id)
    .then(user => {
      if (!user) {
        return res.status(401);
      }
      return user.unFollow(profileId).then(() => {
        return res.json({ profile: req.profile.toProfileJSONFor(user) });
      });
    })
    .catch(next);
};

module.exports = {
  preloadArticle,
  getProfile,
  follow,
  unFollow
};
