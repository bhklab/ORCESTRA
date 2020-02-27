const express = require('express');
const router = express.Router();

//middleware
const pset = require('./api/pset');
const user = require('./api/user');
const auth = require('./api/auth');
const db = require('./api/db');
const pachyderm = require('./api/pachyderm');
const email = require('./api/email');

// pset
router.get('/api/pset', pset.getPsetList);
router.get('/api/pset/one/:id1/:id2', pset.getPSetByDOI);
router.get('/api/pset/sort', pset.getSortedPSets);

router.get('/api/pachyderm/status', pachyderm.returnStatus);

router.post('/api/pset/request', pset.completeRequest);
router.post('/api/pset/process', pset.processRequest);

router.post('/api/pset/download', pset.downloadPSets);
router.post('/api/pset/complete', pset.updatePSetStatus, email.sendPSetEmail);

// prviate route
router.post('/api/pset/cancel', auth.checkToken, pset.cancelPSetRequest);

// user
router.get('/api/user', user.getUser);
router.get('/api/user/check', user.checkUser);
router.post('/api/user/login', user.loginUser);
router.post('/api/user/register', user.registerUser);
router.get('/api/user/logout/:username', user.logoutUser);
// private routes
router.get('/api/user/pset', auth.checkToken, user.getUserPSet);
router.post('/api/user/pset/add', auth.checkToken, user.addToUserPset);
router.post('/api/user/pset/remove', auth.checkToken, user.removeUserPSet);
router.get('/api/user/checkToken', auth.checkToken, user.checkToken);

//formdata
router.get('/api/formdata', db.getFormData);

//landing data
router.get('/api/landing/data', db.getLandingData)

module.exports = router;