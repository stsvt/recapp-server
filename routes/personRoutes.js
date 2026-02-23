const express = require('express');
const personController = require('../controllers/personController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: People
 *   description: Person management
 */

router.get('/:id', personController.getPersonInfo);

/**
 * @swagger
 * /api/v1/person/{id}/works:
 *   get:
 *     summary: Отримати роботи режисера
 *     tags: [People]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Person ID
 *     responses:
 *       200:
 *         description: Список робіт
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
 *                     person:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 550
 *                           title:
 *                             type: string
 *                             example: "Fight Club"
 *                           media_type:
 *                             type: string
 *                             example: "movie"
 *                           poster_path:
 *                             type: string
 *                             example: "/path/to/poster.jpg"
 *                           release_date:
 *                             type: string
 *                             format: date
 *                             example: "1999-10-15"
 *                           vote_average:
 *                             type: number
 *                             format: float
 *                             example: 8.4
 */
router.get('/:id/works', personController.getDirectorWorks);

/**
 * @swagger
 * /api/v1/person/{id}/movies:
 *   get:
 *     summary: Отримати фільми актора
 *     tags: [People]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID актора в TMDB
 *     responses:
 *       200:
 *         description: Список фільмів та серіалів
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: "Fight Club"
 *                       character:
 *                         type: string
 *                         example: "Tyler Durden"
 *                       media_type:
 *                         type: string
 *                         example: "movie"
 */
router.get('/:id/movies', personController.getActorMovies);

module.exports = router;
