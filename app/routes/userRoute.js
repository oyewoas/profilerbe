const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const userAuth = require('../middlewares/userAuth');
const upload = require('../middlewares/uploadImg')
//subjects Route
router.post('/user/signin', UserController.signInUser);
router.post('/user/signup', UserController.signUpUser);
router.get('/user/profile', userAuth, UserController.userProfile);
router.get('/user/edit/profile/:userId', userAuth, UserController.editProfile)
router.put('/user/update/profile/:userId', userAuth, UserController.updateProfile)


module.exports = router;