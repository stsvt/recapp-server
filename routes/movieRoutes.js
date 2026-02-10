const express = require('express');
const movieController = require('../controllers/movieController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Movie management
 */

/**
 * @swagger
 * /api/v1/movies:
 *   get:
 *     summary: Отримати список всіх фільмів
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Список фільмів успішно отримано
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
 *                     movies:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           year:
 *                             type: integer
 *                           rating:
 *                             type: number
 *       404:
 *         description: Фільми не знайдено
 */
router.route('/').get(movieController.getAllMovies);

/**
 * @swagger
 * /api/v1/movies/{id}:
 *   get:
 *     summary: Отримати фільм за ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID фільму
 *     responses:
 *       200:
 *         description: Фільм успішно отримано
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
 *                     movie:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: Titanic
 *                         year:
 *                           type: integer
 *                           example: 1997
 *       404:
 *         description: Фільм з таким ID не знайдено
 */
router.route('/:id').get(movieController.getMovieById);

module.exports = router;
