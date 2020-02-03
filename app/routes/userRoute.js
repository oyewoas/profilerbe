const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const userAuth = require('../middlewares/userAuth');
const uploadImg = require('../middlewares/uploadImg');


//subjects Route
router.post('/user/signin', UserController.signInUser);
router.post('/user/upload', uploadImg.parser.single('profileImg'), UserController.uploadImage)
router.post('/user/signup', uploadImg.parser.single('profileImg'), UserController.signUpUser);
router.get('/user/profile', userAuth, UserController.userProfile);
router.get('/user/edit/profile/:userId', userAuth, UserController.editProfile)
router.put('/user/update/profile/:userId', uploadImg.parser.single('profileImg'), userAuth, UserController.updateProfile)


module.exports = router;