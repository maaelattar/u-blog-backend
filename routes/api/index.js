const router = require('express').Router();

let users = require('./users');
let profiles = require('./profiles');
let articles = require('./articles');
let tags = require('./tags');

router.use('/', users);
router.use('/profiles', profiles);
router.use('/articles', articles);
router.use('/tags', tags);

router.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce((errors, key) => {
        errors[key] = err.errors[key].message;
        return errors;
      }, {})
    });
  }
  return next(err);
});

module.exports = router;
