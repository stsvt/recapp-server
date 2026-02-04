const express = require('express');
const personController = require('../controllers/personController');

const router = express.Router();

router.get('/:id/works', personController.getDirectorWorks);

module.exports = router;
