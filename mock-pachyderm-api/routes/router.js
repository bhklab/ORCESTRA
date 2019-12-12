const express = require('express');
const router = express.Router();

const process = require('./process');

router.get('/pipeline/start', process.startPipeline);

module.exports = router;