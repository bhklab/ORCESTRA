const express = require('express');
const router = express.Router();

//middleware
const pset = require('./middleware/pset');
const user = require('./middleware/user');
const auth = require('./middleware/auth');
const request = require('./middleware/request');
const git = require('./middleware/git');
const db = require('./middleware/db');
const pachyderm = require('./middleware/pachyderm');
const email = require('./middleware/email');


// pset
router.get('/pset', pset.getPsetList);
router.get('/pset/one/:id1/:id2', pset.getPSetByDOI);
router.get('/pset/sort', pset.getSortedPSets);

router.get('/pachyderm/status', pachyderm.checkOnline, pachyderm.returnStatus);

router.post('/pset/request', 
    request.receivePSetRequest, 
    request.buildPachydermConfigJson,
    pset.postPSetData,
    pachyderm.checkOnline,
    request.savePachydermConfigJson,
    git.pushPachydermConfigJson,
    pachyderm.createPipeline,
    pset.completePSetReqProcess
);

// 1. check online, 2. get config json, 3. save config json file, 4. git push, 5. create pipeline, 6. complete process
router.post('/pset/process', 
    pachyderm.checkOnline,
    pachyderm.handleOffline,
    request.getPachydermConfigJson,
    git.pushPachydermConfigJson,
    pachyderm.createPipeline,
    pset.completePSetReqProcess
);

router.post('/pset/download', pset.downloadPSets);
router.post('/pset/complete', pset.updatePSetStatus, email.sendPSetEmail);

// prviate route
router.post('/pset/cancel', auth.checkToken, pset.cancelPSetRequest);

// user
router.get('/user', user.getUser);
router.get('/user/check', user.checkUser);
router.post('/user/login', user.loginUser);
router.post('/user/register', user.registerUser);
router.get('/user/logout/:username', user.logoutUser);
// private routes
router.get('/user/pset', auth.checkToken, user.getUserPSet);
router.post('/user/pset/add', auth.checkToken, user.addToUserPset);
router.post('/user/pset/remove', auth.checkToken, user.removeUserPSet);
router.get('/user/checkToken', auth.checkToken, user.checkToken);

//formdata
router.get('/formdata', db.getFormData);

//landing data
router.get('/landing/data', db.getLandingData)

module.exports = router;