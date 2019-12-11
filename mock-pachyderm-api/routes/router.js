const express = require('express');
const router = express.Router();

const process = require('./process');

router.get('/process/pipeline/:id', process.startPipeline);
//router.get('/request', process.sendRequest);

module.exports = router;