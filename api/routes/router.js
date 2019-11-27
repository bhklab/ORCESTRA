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
// prviate route
router.post('/pset/cancel', helper.checkToken, pset.cancelPSetRequest);

// user
router.get('/user', user.getUser);
router.get('/user/check', user.checkUser);
router.post('/user/login', user.loginUser);
router.post('/user/register', user.registerUser);
router.get('/user/logout/:username', user.logoutUser);
// private routes
router.get('/user/pset', helper.checkToken, user.getUserPSet);
router.post('/user/pset/add', helper.checkToken, user.addToUserPset);
router.post('/user/pset/remove', helper.checkToken, user.removeUserPSet);
router.get('/user/checkToken', helper.checkToken, user.checkToken);


module.exports = router;