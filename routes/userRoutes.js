const express = require('express');
const passport = require('passport');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const friendRouter = require('./friendRoutes');

const router = express.Router();

router.get(
  '/auth/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account' 
  }),
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  authController.googleAuthCallback,
);

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.get('/healthcheck', userController.healthCheck);

router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
);
router.delete('/deleteMe', userController.deleteMe);
router.get('/', userController.getAllUsers);

router.use('/:userId/friends', friendRouter);
router.get('/:id', userController.getUserById);

module.exports = router;
