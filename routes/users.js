const router = require('express').Router();
const usersController = require('../controllers/users');
const auth = require('./auth');

router.post('/users', auth.required, usersController.createUser);
router.get('/user', auth.required, usersController.getUser);
router.put('/user', auth.required, usersController.updateUser);
router.post('/users/login', auth.required, usersController.userLogin);

module.exports = router;
