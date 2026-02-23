const express = require('express');
const personController = require('../controllers/personController');

const router = express.Router();

router.get('/:id', personController.getPersonInfo);
router.get('/:id/works', personController.getDirectorWorks);
router.get('/:id/movies', personController.getActorMovies);

module.exports = router;
