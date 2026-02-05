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
 * /api/v1/movies/genres:
 *   get:
 *     summary: Отримати жанри фільмів
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Список жанрів
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
 *                   example: 19
 *                 data:
 *                   type: object
 *                   properties:
 *                     genres:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 28
 *                           name:
 *                             type: string
 *                             example: Action
 */
router.get('/genres', movieController.getMovieGenres);

/**
 * @swagger
 * /api/v1/movies/top-rated:
 *   get:
 *     summary: Отримати фільми з найвищим рейтингом
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Номер сторінки
 *     responses:
 *       200:
 *         description: Список фільмів з найвищим рейтингом
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
 *                   example: 20
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: object
 *                   properties:
 *                     movies:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 278
 *                           title:
 *                             type: string
 *                             example: "The Shawshank Redemption"
 *                           poster_path:
 *                             type: string
 *                             example: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg"
 *                           release_date:
 *                             type: string
 *                             format: date
 *                             example: "1994-09-23"
 *                           vote_average:
 *                             type: number
 *                             format: float
 *                             example: 8.7
 */
router.get('/top-rated', movieController.getTopRatedMovies);

/**
 * @swagger
 * /api/v1/movies/upcoming:
 *   get:
 *     summary: Отримати фільми, що скоро вийдуть
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Номер сторінки
 *     responses:
 *       200:
 *         description: Список фільмів, що скоро вийдуть
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
 *                   example: 20
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: object
 *                   properties:
 *                     movies:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 12345
 *                           title:
 *                             type: string
 *                             example: "Upcoming Movie Title"
 *                           poster_path:
 *                             type: string
 *                             example: "/path/to/poster.jpg"
 *                           release_date:
 *                             type: string
 *                             format: date
 *                             example: "2023-12-25"
 *                           vote_average:
 *                             type: number
 *                             format: float
 *                             example: 8.5
 */
router.get('/upcoming', movieController.getUpcomingMovies);

/**
 * @swagger
 * /api/v1/movies/search:
 *   get:
 *     summary: Пошук фільмів
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Пошуковий запит (назва фільму)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер сторінки
 *     responses:
 *       200:
 *         description: Результати пошуку
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
 *                     results:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         results:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 27205
 *                               title:
 *                                 type: string
 *                                 example: "Inception"
 *                               poster_path:
 *                                 type: string
 *                                 example: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg"
 *                               release_date:
 *                                 type: string
 *                                 format: date
 *                                 example: "2010-07-15"
 *                               vote_average:
 *                                 type: number
 *                                 format: float
 *                                 example: 8.364
 *                         total_pages:
 *                           type: integer
 *                           example: 5
 *                         total_results:
 *                           type: integer
 *                           example: 85
 *       400:
 *         description: Не вказано пошуковий запит
 */
router.get('/search', movieController.searchMovies);

/**
 * @swagger
 * /api/v1/movies/now_playing:
 *   get:
 *     summary: Отримати фільми, що зараз у прокаті
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Номер сторінки
 *     responses:
 *       200:
 *         description: Список фільмів, що зараз у прокаті
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
 *                   example: 20
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: object
 *                   properties:
 *                     movies:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 67890
 *                           title:
 *                             type: string
 *                             example: "Now Playing Movie"
 *                           poster_path:
 *                             type: string
 *                             example: "/path/to/poster.jpg"
 *                           release_date:
 *                             type: string
 *                             format: date
 *                             example: "2023-10-01"
 *                           vote_average:
 *                             type: number
 *                             format: float
 *                             example: 7.2
 */
router.get('/now_playing', movieController.getNowPlayingMovies);

/**
 * @swagger
 * /api/v1/movies:
 *   get:
 *     summary: Отримати всі фільми з фільтрацією та пагінацією
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Пошуковий запит за назвою фільму
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Номер сторінки
 *     responses:
 *       200:
 *         description: Список фільмів
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
 *                   example: 20
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: object
 *                   properties:
 *                     movies:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 11111
 *                           title:
 *                             type: string
 *                             example: "Movie Title"
 *                           poster_path:
 *                             type: string
 *                             example: "/path/to/poster.jpg"
 *                           release_date:
 *                             type: string
 *                             format: date
 *                             example: "2023-01-01"
 *                           vote_average:
 *                             type: number
 *                             format: float
 *                             example: 6.5
 */
router.get('/', movieController.getAllMovies);

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
 *         description: Деталі фільму
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
 *                         id:
 *                           type: integer
 *                           example: 550
 *                         title:
 *                           type: string
 *                           example: "Fight Club"
 *                         overview:
 *                           type: string
 *                           example: "A ticking-time-bomb insomniac..."
 *                         poster_path:
 *                           type: string
 *                           example: "/path/to/poster.jpg"
 *                         release_date:
 *                           type: string
 *                           format: date
 *                           example: "1999-10-15"
 *                         vote_average:
 *                           type: number
 *                           format: float
 *                           example: 8.4
 *       404:
 *         description: Фільм не знайдено
 */
router.get('/:id', movieController.getMovieById);

module.exports = router;
