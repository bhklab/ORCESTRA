const express = require('express');
const router = express.Router();

// routes
const home = require('./index');
const pset = require('./pset');
const psetReq = require('./psetReq');
const user = require('./user');

// configuring router
router.get('/', home.getHome);
router.get('/pset', pset.getPsetList);

module.exports = router;