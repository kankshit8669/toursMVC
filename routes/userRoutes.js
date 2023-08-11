const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const multer = require('multer');
const router = express.Router();


//if we call the multer fun without any opetion then the
// /// img would simply  be stored in the memory and not saved anywhere to the disk
// const upload = multer({dest:'public/img/users'});

//this we moved to the users controllers 


router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);

//it's single cuz we only have one single file , we only want to upate one single image and then in the single we pass win the namme
// of the field that is going to hold the image to upload and that will be photo
//field in the form that is going to be uploading the image

//so we created an upload just to define a couple of settings like over here we defined dest\
//then we use that upload to create  a new middlware  then that we can add to this stack of the route
///that we want to use to uplad the file

// so this middlware will then take care of taking the file and basically coping 
//it to the destination tha we specified  and then it will call the next middlare that is update me
//so this single midd will put the information about the file on the requesr obj 
//we modified it to uploadUserPhoto in the controller

// once the photo is uploaded then we will ressize it with the middlware
router.patch('/updateMe',userController.uploadUserPhoto,userController.resizeUserPhoto, userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
