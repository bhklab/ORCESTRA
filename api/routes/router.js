const express = require('express');
const router = express.Router();
const middleware = require('../middleware/middleware');

// routes
const home = require('./index');
const pset = require('./pset');
const user = require('./user');
const metadata = require('./metadata');

const script = require('./insert-script');

// configuring router
// router.get('/', home.getHome);

// pset
router.get('/pset', pset.getPsetList);
router.get('/pset/one/:id1/:id2', pset.getPSetByDOI);
router.get('/pset/sort', pset.getSortedPSets);
router.post('/pset/request', middleware.sendPSetRequest, middleware.buildPachydermReqJson, middleware.pushPachydermReqJson, pset.postPsetData);
//router.get('/pset/request', middleware.sendPSetRequest, middleware.buildPachydermReqJson, middleware.pushPachydermReqJson, pset.postPsetData);
router.post('/pset/download', pset.downloadPSets);
router.get('/pset/complete', middleware.updatePSetStatus, pset.sendPSetEmail);
// prviate route
router.post('/pset/cancel', middleware.checkToken, pset.cancelPSetRequest);

// insert script
router.get('/script/bulk', script.insert);
router.get('/script/formdata', script.insertFormdata);


// user
router.get('/user', user.getUser);
router.get('/user/check', user.checkUser);
router.post('/user/login', user.loginUser);
router.post('/user/register', user.registerUser);
router.get('/user/logout/:username', user.logoutUser);
// private routes
router.get('/user/pset', middleware.checkToken, user.getUserPSet);
router.post('/user/pset/add', middleware.checkToken, user.addToUserPset);
router.post('/user/pset/remove', middleware.checkToken, user.removeUserPSet);
router.get('/user/checkToken', middleware.checkToken, user.checkToken);

//meadata
router.get('/metadata', metadata.getMetadata);
router.get('/formdata', metadata.getFormData);
router.get('/test', metadata.testRequest);
router.get('/receive', metadata.receiveRequest);

module.exports = router;