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

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

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
 *     summary: Зареєструвати нового користувача
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
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               passwordConfirm:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: Користувач зареєстрований успішно
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
 *                           example: John Doe
 *                         email:
 *                           type: string
 *                           example: john@example.com
 *                         role:
 *                           type: string
 *                           example: user
 *       400:
 *         description: Bad request
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
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Вхід успішний
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
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: Токен для скидання паролю надіслано на пошту
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
 *         description: Користувача з такою електронною адресою не знайдено
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
 *               - passwordConfirm
 *             properties:
 *               password:
 *                 type: string
 *                 example: newpassword123
 *               passwordConfirm:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Пароль успішно змінено
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
 *       400:
 *         description: Невірний токен або паролі не співпадають
 */
router.patch('/resetPassword/:token', authController.resetPassword);

/**
 * @swagger
 * /api/v1/users/updateMyPassword:
 *   patch:
 *     summary: Оновлення паролю авторизованого користувача
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
 *               - passwordConfirm
 *             properties:
 *               passwordCurrent:
 *                 type: string
 *                 example: oldpassword123
 *               password:
 *                 type: string
 *                 example: newpassword123
 *               passwordConfirm:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Пароль успішно оновлено
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
 *       401:
 *         description: Невірний поточний пароль
 */
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);

router.use(authController.protect);

router.get('/me', userController.getMe);

/**
 * @swagger
 * /api/v1/users/updateMe:
 *   patch:
 *     summary: Оновлення даних поточного користувача
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               description:
 *                 type: string
 *                 example: "I love movies!"
 *     responses:
 *       200:
 *         description: Дані користувача успішно оновлено
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
 *                           example: John Doe
 *                         email:
 *                           type: string
 *                           example: john@example.com
 *                         role:
 *                           type: string
 *                           example: user
 *       400:
 *         description: Спроба оновити пароль через цей маршрут
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
 *         description: Користувач успішно видалений (деактивований)
 *       401:
 *         description: Не авторизований
 */
router.delete('/deleteMe', userController.deleteMe);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Отримати всіх користувачів
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Список всіх користувачів
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: John Doe
 *                           email:
 *                             type: string
 *                             example: john@example.com
 *                           role:
 *                             type: string
 *                             example: user
 */
router.get('/', userController.getAllUsers);

module.exports = router;
