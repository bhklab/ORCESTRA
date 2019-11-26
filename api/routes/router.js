const express = require('express');
const router = express.Router();
const helper = require('../helper/apiHelper');

// routes
const home = require('./index');
const pset = require('./pset');
const user = require('./user');

// configuring router
router.get('/', home.getHome);

// pset
router.get('/pset', pset.getPsetList);
router.post('/pset/request', pset.postPsetData);
router.post('/pset/cancel', pset.cancelPSetRequest);

// user
router.get('/user', user.getUser);
router.get('/user/check', user.checkUser);
router.post('/user/login', user.loginUser);
router.post('/user/register', user.registerUser);
router.get('/user/pset', user.getUserPSet);
router.post('/user/pset/add', user.addToUserPset);
router.post('/user/pset/remove', user.removeUserPSet);
router.get('/user/checkToken', helper.checkToken, user.checkToken);
router.get('/user/logout/:username', user.logoutUser);

module.exports = router;