const express = require('express');
const router = express.Router();

//const zenodo = require('../middleware/zenodo');
//const google = require('../middleware/google');

//middleware
const pset = require('./middleware/pset');
const user = require('./middleware/user');
const auth = require('./middleware/auth');
const request = require('./middleware/request');
const git = require('./middleware/git');
const db = require('./middleware/db');
const pachyderm = require('./middleware/pachyderm');
const email = require('./middleware/email');

//for development only
const script = require('./middleware/insert-script');


// pset
router.get('/pset', pset.getPsetList);
router.get('/pset/one/:id1/:id2', pset.getPSetByDOI);
router.get('/pset/sort', pset.getSortedPSets);
//router.post('/pset/request', middleware.sendPSetRequest, pset.postPsetData);

// router.post('/pset/request', 
//     middleware.receivePSetRequest, 
//     // middleware.buildPachydermReqJson, 
//     // middleware.pushPachydermReqJson, 
//     // pachyderm.createPipeline,
//     pset.postPsetData
// );

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

//router.get('/pset/pachyderm', pachyderm.createPipeline, pachyderm.listJob);

// router.get('/zenodo/upload/:name', 
//     zenodo.getDepositInfo, 
//     zenodo.uploadFile,
//     zenodo.addMetadata,
//     zenodo.publish
// );
// router.get('/googleapi/test', google.testAPI);


router.post('/pset/download', pset.downloadPSets);
router.post('/pset/complete', pset.updatePSetStatus, email.sendPSetEmail);
// prviate route
router.post('/pset/cancel', auth.checkToken, pset.cancelPSetRequest);

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
router.get('/user/pset', auth.checkToken, user.getUserPSet);
router.post('/user/pset/add', auth.checkToken, user.addToUserPset);
router.post('/user/pset/remove', auth.checkToken, user.removeUserPSet);
router.get('/user/checkToken', auth.checkToken, user.checkToken);

//formdata
router.get('/formdata', db.getFormData);

module.exports = router;