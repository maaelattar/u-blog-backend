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

const getProfile = (req, res, next, username) => {
  if (req.payload) {
    User.findById(req.payload.id).then(user => {
      if (!user) {
        return res.json({ profile: req.profile.toProfileJsonFor(false) });
      }
      return res.json({ profile: req.profile.toProfileJsonFor(user) });
    });
  } else {
    return res.json({ profile: req.profile.toProfileJsonFor(false) });
  }
};
module.exports = {
  preloadArticle,
  getProfile
};
