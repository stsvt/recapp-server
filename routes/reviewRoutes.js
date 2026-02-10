const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management
 */

/**
 * @swagger
 * /api/v1/reviews/{movieId}:
 *   get:
 *     summary: Отримати всі відгуки до фільму
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID фільму (TMDB ID)
 *     responses:
 *       200:
 *         description: Список відгуків успішно отримано
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
 *                   example: 5
 *                 data:
 *                   type: object
 *                   properties:
 *                     reviews:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           review:
 *                             type: string
 *                             example: "Great movie!"
 *                           rating:
 *                             type: number
 *                             example: 8.5
 *                           user:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 example: "John Doe"
 *   post:
 *     summary: Створити відгук до фільму
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID фільму (TMDB ID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - review
 *               - rating
 *             properties:
 *               review:
 *                 type: string
 *                 example: "Amazing movie, highly recommended!"
 *               rating:
 *                 type: number
 *                 min: 1
 *                 max: 10
 *                 example: 9
 *     responses:
 *       201:
 *         description: Відгук успішно створено
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
 *                     review:
 *                       type: object
 *       401:
 *         description: Не авторизований
 */
router
  .route('/:movieId')
  .get(reviewController.getAllReviews)
  .post(authController.protect, reviewController.createReview);

/**
 * @swagger
 * /api/v1/reviews/{reviewId}:
 *   delete:
 *     summary: Видалити відгук
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID відгуку
 *     responses:
 *       204:
 *         description: Відгук успішно видалено
 *       401:
 *         description: Не авторизований
 *       403:
 *         description: Немає прав на видалення цього відгуку
 *   patch:
 *     summary: Оновити відгук
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID відгуку
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               review:
 *                 type: string
 *                 example: "Updated review text"
 *               rating:
 *                 type: number
 *                 example: 8
 *     responses:
 *       200:
 *         description: Відгук успішно оновлено
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
 *                     review:
 *                       type: object
 *       401:
 *         description: Не авторизований
 *       403:
 *         description: Немає прав на редагування цього відгуку
 */
router
  .route('/:reviewId')
  .delete(authController.protect, reviewController.deleteReview)
  .patch(authController.protect, reviewController.updateReview);

module.exports = router;
