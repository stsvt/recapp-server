const express = require('express');
const personController = require('../controllers/personController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: People
 *   description: Person management
 */

/**
 * @swagger
 * /api/v1/person/{id}/works:
 *   get:
 *     summary: Get works of a director
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
 *         description: List of works
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     person:
 *                       type: array
 *                       items:
 *                         type: object
 */
router.get('/:id/works', personController.getDirectorWorks);

module.exports = router;
