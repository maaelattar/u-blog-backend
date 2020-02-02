const mongoose = require('mongoose');
const passport = require('passport');
const User = mongoose.model('User');

let createUser = (req, res, next) => {
  let user = new User();
  user.username = req.body.user.username;
  user.email = req.body.user.email;
  user.setPassword(req.body.user.password);

  user
    .save()
    .then(() => {
      return res.status(201).json({ user: user.toAuthJson() });
    })
    .catch(next);
};

let getUser = (req, res, next) => {
  User.findById(req.payload.id)
    .then(user => {
      if (!user) {
        return res.status(401);
      }
      return res.json({ user: user.toAuthJson() });
    })
    .catch(next);
};

let updateUser = (req, res, next) => {
  User.findById(req.payload.id)
    .then(user => {
      if (!user) {
        return res.status(401);
      }
      if (typeof req.body.user.username !== 'undefined') {
        user.username = req.body.user.username;
      }
      if (typeof req.body.user.email !== 'undefined') {
        user.username = req.body.user.email;
      }
      if (typeof req.body.user.bio !== 'undefined') {
        user.username = req.body.user.bio;
      }
      if (typeof req.body.user.image !== 'undefined') {
        user.username = req.body.user.image;
      }
      if (typeof req.body.user.password !== 'undefined') {
        user.username = req.body.user.password;
      }

      return user.save().then(() => {
        return res.status(200).json({ user: user.toAuthJson() });
      });
    })
    .catch(next);
};

let userLogin = (req, res, next) => {
  if (!req.body.user.email) {
    return res.status(422).json({ message: 'Email can not be blank' });
  }
  if (!req.body.user.password) {
    return res.status(422).json({ message: 'Password can not be blank' });
  }

  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (user) {
      user.token = user.generateJWT();
      return res.json({ user: user.toAuthJson() });
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  userLogin
};
