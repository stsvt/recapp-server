const express = require('express');
const passport = require('passport');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /api/v1/users/auth/google:
 *   get:
 *     summary: Авторизація через Google
 *     tags: [Users]
 *     responses:
 *       302:
 *         description: Redirect to Google for authentication
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

/**
 * @swagger
 * /api/v1/users/auth/google/callback:
 *  get:
 *   summary: Callback URL для Google авторизації
 *   tags: [Users]
 *   responses:
 *     200:
 *       description: OK
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: success
 *               token:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               data:
 *                 type: object
 *                 properties:
 *                   user:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: user
 *                       email:
 *                         type: string
 *                         example: user@gmail.com
 *                       photo:
 *                         type: string
 *                         example: default.jpg
 *                       role:
 *                         type: string
 *                         example: user
 *                       totalWatchTime:
 *                         type: integer
 *                         example: 0
 *                       _id:
 *                         type: string
 *                         example: 60d0fe4f5311236168a109ca
 *     401:
 *       description: Unauthorized
 */
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  authController.googleAuthCallback,
);

/**
 * @swagger
 * /api/v1/users/signup:
 *   post:
 *     summary: Реєстрація нового користувача
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - passwordConfirm
 *             properties:
 *               name:
 *                 type: string
 *                 example: user
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: qwerty123
 *               confirmPassword:
 *                 type: string
 *                 example: qwerty123
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: user
 *                         email:
 *                           type: string
 *                           example: user@example.com
 *                         photo:
 *                            type: string
 *                            example: default.jpg
 *                         role:
 *                           type: string
 *                           example: user
 *                         totalWatchTime:
 *                           type: integer
 *                           example: 0
 *                         _id:
 *                           type: string
 *                           example: 60d0fe4f5311236168a109ca
 *       500:
 *         description: Internal Server Error
 */
router.post('/signup', authController.signup);

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Вхід користувача
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: qwerty123
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: user
 *                         email:
 *                           type: string
 *                           example: user@example.com
 *                         photo:
 *                            type: string
 *                            example: default.jpg
 *                         role:
 *                           type: string
 *                           example: user
 *                         totalWatchTime:
 *                           type: integer
 *                           example: 0
 *                         _id:
 *                           type: string
 *                           example: 60d0fe4f5311236168a109ca
 *       500:
 *         description: Internal Server Error
 *       401:
 *         description: Incorrect email or password
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/v1/users/forgotPassword:
 *   post:
 *     summary: Відновлення паролю
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Token sent to email!
 *       404:
 *         description: Not Found
 */
router.post('/forgotPassword', authController.forgotPassword);

/**
 * @swagger
 * /api/v1/users/resetPassword/{token}:
 *   patch:
 *     summary: Скидання паролю
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Токен скидання паролю
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - confirmPassword
 *             properties:
 *               password:
 *                 type: string
 *                 example: newpassword123
 *               confirmPassword:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: user
 *                         email:
 *                           type: string
 *                           example: user@example.com
 *                         photo:
 *                            type: string
 *                            example: default.jpg
 *                         role:
 *                           type: string
 *                           example: user
 *                         totalWatchTime:
 *                           type: integer
 *                           example: 0
 *                         _id:
 *                           type: string
 *                           example: 60d0fe4f5311236168a109ca
 *                         passwordChangedAt:
 *                           type: string
 *                           example: 2026-01-01T12:00:00.000Z
 *       400:
 *         description: Bad Request
 */
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

/**
 * @swagger
 * /api/v1/users/updateMyPassword:
 *   patch:
 *     summary: Оновлення паролю
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - passwordCurrent
 *               - password
 *               - confirmPassword
 *             properties:
 *               passwordCurrent:
 *                 type: string
 *                 example: oldpassword123
 *               password:
 *                 type: string
 *                 example: newpassword123
 *               confirmPassword:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: user
 *                         email:
 *                           type: string
 *                           example: user@example.com
 *                         photo:
 *                            type: string
 *                            example: default.jpg
 *                         role:
 *                           type: string
 *                           example: user
 *                         totalWatchTime:
 *                           type: integer
 *                           example: 0
 *                         _id:
 *                           type: string
 *                           example: 60d0fe4f5311236168a109ca
 *                         passwordChangedAt:
 *                           type: string
 *                           example: 2026-01-01T12:00:00.000Z
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);

/**
 * @swagger
 * /api/v1/users/me:
 *   get:
 *     summary: Отримати дані поточного користувача
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: user
 *                         email:
 *                           type: string
 *                           example: user@example.com
 *                         photo:
 *                            type: string
 *                            example: default.jpg
 *                         role:
 *                           type: string
 *                           example: user
 *                         totalWatchTime:
 *                           type: integer
 *                           example: 0
 *                         _id:
 *                           type: string
 *                           example: 60d0fe4f5311236168a109ca
 *                         passwordChangedAt:
 *                           type: string
 *                           example: 2026-01-01T12:00:00.000Z
 *       401:
 *         description: Unauthorized
 */
router.get('/me', userController.getMe);

/**
 * @swagger
 * /api/v1/users/updateMe:
 *   patch:
 *     summary: Оновити дані поточного користувача
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: newName
 *               email:
 *                 type: string
 *                 format: email
 *                 example: newemail@example.com
 *               description:
 *                 type: string
 *                 example: Короткий опис профілю
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Файл зображення для аватарки
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: newName
 *               email:
 *                 type: string
 *                 format: email
 *                 example: newemail@example.com
 *               description:
 *                 type: string
 *                 example: Короткий опис профілю
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: newName
 *                         email:
 *                           type: string
 *                           example: newemail@example.com
 *                         description:
 *                           type: string
 *                           example: I love movies
 *                         photo:
 *                           type: string
 *                           example: user-photo-123.jpg
 *                         role:
 *                           type: string
 *                           example: user
 *                         totalWatchTime:
 *                           type: integer
 *                           example: 0
 *                         _id:
 *                           type: string
 *                           example: 60d0fe4f5311236168a109ca
 *       400:
 *         description: Bad Request (This route is not for password updates)
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
);

/**
 * @swagger
 * /api/v1/users/deleteMe:
 *   delete:
 *     summary: Видалення (деактивація) поточного користувача
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: No Content
 *       401:
 *         description: Unauthorized
 */
router.delete('/deleteMe', userController.deleteMe);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Отримати всіх користувачів
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 6996e1c873178f0cc7fb2529
 *                           name:
 *                             type: string
 *                             example: user
 *                           email:
 *                             type: string
 *                             example: user@gmail.com
 *                           photo:
 *                             type: string
 *                             example: default.jpg
 *                           role:
 *                             type: string
 *                             example: user
 *                           totalWatchTime:
 *                             type: integer
 *                             example: 0
 *                           __v:
 *                             type: integer
 *                             example: 0
 *       401:
 *         description: Unauthorized
 */
router.get('/', userController.getAllUsers);

module.exports = router;
