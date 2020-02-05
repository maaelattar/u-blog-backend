const router = require('express').Router();
const usersController = require('../../controllers/users');
const auth = require('../auth');

router.post('/users/login', usersController.userLogin);
router.post('/users', usersController.createUser);
router.get('/user', auth.required, usersController.getUser);
router.put('/user', auth.required, usersController.updateUser);

module.exports = router;
