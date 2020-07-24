const express = require('express');
const router = express.Router();

//api
const pset = require('./api/pset');
const psetRequest = require('./api/pset-request');
const user = require('./api/user');
const auth = require('./api/auth');
const formMetric = require('./api/form-metric');
const pachyderm = require('./api/pachyderm');
const public = require('./api/public');

// pset
router.post('/pset/search', pset.searchPSets);
router.get('/pset/one/:id1/:id2', pset.getPSetByDOI);
router.get('/pset/canonical', pset.getCanonicalPSets);
router.post('/pset/canonical/update', pset.updateCanonicalPSets);
router.post('/pset/download', pset.downloadPSets);
router.get('/pachyderm/status', pachyderm.returnStatus);
router.post('/pset/request', psetRequest.processOnlineRequest);
router.post('/pset/process', psetRequest.processOfflineRequest);
router.post('/pset/complete', psetRequest.completeRequest);

// user
router.get('/user', user.getUser);
router.get('/user/check', user.checkUser);
router.post('/user/login', user.loginUser);
router.post('/user/register', user.registerUser);
router.get('/user/logout/:username', user.logoutUser);
router.post('/user/reset/email', user.sendResetPwdEmail);
router.post('/user/reset/token', user.resetPwdWithToken);

// private routes
router.get('/user/pset', auth.checkToken, user.getUserPSet);
router.post('/user/pset/add', auth.checkToken, user.addToUserPset);
router.post('/user/pset/remove', auth.checkToken, user.removeUserPSet);
router.get('/user/checkToken', auth.checkToken, user.checkToken);
router.post('/user/reset', auth.checkToken, user.resetPwd);

//formdata
router.get('/formdata', formMetric.getFormData);
router.get('/stats/data', formMetric.getDataForStats);
router.get('/stats/metrics/options', formMetric.getMetricDataOptions);
router.post('/stats/metrics/data', formMetric.getMetricData);

//landing data
router.get('/landing/data', formMetric.getLandingData);

//public api
router.get('/psets/:filter', public.getPSets);
router.get('/pset/:doi1/:doi2', public.getPSet);
router.get('/psets/statistics/:limit', public.getStatistics);
router.get('/psets/update-download/:doi1/:doi2', public.updateDownloadCount);

module.exports = router;