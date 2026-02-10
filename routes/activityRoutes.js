const express = require('express');
const authController = require('../controllers/authController');
const { activityController } = require('../controllers/activityController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Activity
 *   description: User activity management (likes, views)
 */

router.use(authController.protect);

/**
 * @swagger
 * /api/v1/activity:
 *   post:
 *     summary: Змінити статус активності (лайк/переглянуто)
 *     tags: [Activity]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mediaType
 *               - mediaId
 *               - actionType
 *             properties:
 *               mediaType:
 *                 type: string
 *                 enum: [movie, tv]
 *                 description: Тип медіа
 *               mediaId:
 *                 type: string
 *                 description: ID медіа (TMDB ID)
 *               actionType:
 *                 type: string
 *                 enum: [like, watched]
 *                 description: Тип дії
 *     responses:
 *       200:
 *         description: Статус успішно оновлено
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
 *                     isActive:
 *                       type: boolean
 *                       description: Новий статус активності (true - додано, false - видалено)
 *       401:
 *         description: Не авторизований
 */
router.post('/', activityController.toggleActivity);

/**
 * @swagger
 * /api/v1/activity/status/{tmdbId}:
 *   get:
 *     summary: Перевірити статус фільму/серіалу для поточного користувача
 *     tags: [Activity]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tmdbId
 *         required: true
 *         schema:
 *           type: string
 *         description: TMDB ID фільму або серіалу
 *     responses:
 *       200:
 *         description: Статус отримано успішно
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
 *                     isLiked:
 *                       type: boolean
 *                     isWatched:
 *                       type: boolean
 *       401:
 *         description: Не авторизований
 */
router.get('/status/:tmdbId', activityController.checkMovieStatus);

module.exports = router;
