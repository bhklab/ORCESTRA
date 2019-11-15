const express = require('express');
const router = express.Router();

// routes
const home = require('./index');
const pset = require('./pset');
const user = require('./user');

// configuring router
router.get('/', home.getHome);
router.get('/pset', pset.getPsetList);
router.post('/requestPset', pset.postPsetData);
router.post('/updateUserPSet', user.updateUserPset);

module.exports = router;