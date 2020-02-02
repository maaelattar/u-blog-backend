const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'user[email]',
      usernameField: 'user[password]'
    },
    (email, password, done) => {
      User.findOne({ email: email })
        .then(user => {
          if (!user || !user.validPassword(password)) {
            return done(null, false, { message: 'Invalid email or password' });
          }
          return done(null, user);
        })
        .catch(done);
    }
  )
);
