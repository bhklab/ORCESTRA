/**
 * @fileoverview routing specification for the web app backend
 */
const express = require('express');
const router = express.Router();

//api
const dataset = require('./api/dataset');
const psetRequest = require('./api/pset-request');
const user = require('./api/user');
const auth = require('./api/auth');
const formMetric = require('./api/form-metric');
const pachyderm = require('./api/pachyderm');
const public = require('./api/public');

// dataset
router.post('/:datasetType/search', dataset.searchDatasets);
router.get('/:datasetType/one/:id1/:id2', dataset.getDatasetByDOI);
router.get('/pset/releasenotes/:name/:version/:type', dataset.getReleaseNotesData);
router.get('/canonical/:datasetType', dataset.getCanonicalDatasets);
router.post('/pset/canonical/update', dataset.updateCanonicalPSets);
router.post('/:datasetType/download', dataset.downloadDatasets);
router.get('/pachyderm/status', pachyderm.returnStatus);
router.post('/pset/request', psetRequest.processOnlineRequest);
router.post('/pset/process', psetRequest.processOfflineRequest);
router.post('/pset/complete', psetRequest.completeRequest);

// user
router.post('/user/submit', user.submit);
router.get('/user/signout', user.signout);
router.get('/user/session', auth.verifyToken, user.getSession);

router.get('/user', user.getUser);
router.get('/user/check', user.checkUser);
router.post('/user/login', user.loginUser);
router.post('/user/register', user.registerUser);
router.get('/user/logout/:username', user.logoutUser);
router.post('/user/reset/email', user.sendResetPwdEmail);
router.post('/user/reset/token', user.resetPwdWithToken);

// private routes
router.get('/user/pset', auth.verifyToken, user.getUserPSet);
router.post('/user/pset/add', auth.verifyToken, user.addToUserPset);
router.post('/user/pset/remove', auth.verifyToken, user.removeUserPSet);
router.get('/user/checkToken', auth.verifyToken, user.checkToken);
router.post('/user/reset', auth.verifyToken, user.resetPwd);

//formdata and stats
router.get('/:datasetType/formdata', formMetric.getFormData);
router.get('/:datasetType/stats/data', formMetric.getDataForStats);
router.get('/stats/metrics/options', formMetric.getMetricDataOptions);
router.post('/stats/metrics/data', formMetric.getMetricData);

//landing data
router.get('/:datasetType/landing/data', formMetric.getLandingData);

// documentation
router.get('/example-download/:file', public.downloadExampleFile);

//public api
router.get('/:datasetType/:filter', public.getDatasets);
router.get('/:datasetType/:doi1/:doi2', public.getDataset);
router.get('/:datasetType/statistics/download/:limit', public.getDownloadStatistics);
router.get('/:datasetType/statistics/metrics/:dataset', public.getMetricDataStatistics);
router.get('/:datasetType/update-download/:doi1/:doi2', public.updateDownloadCount);

module.exports = router;