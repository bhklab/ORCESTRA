/**
 * @fileoverview routing specification for the web app backend
 */
const express = require('express');
const router = express.Router();

//api
const dataObject = require('./api/data-object');
const psetRequest = require('./api/pset-request');
const user = require('./api/user');
const admin = require('./api/admin');
const userDataset = require('./api/user-dataset');
const auth = require('./api/auth');
const formMetric = require('./api/form-metric');
const pachyderm = require('./api/pachyderm');
const public = require('./api/public');

const landingView = require('./api/view/landing-view');
const dataObjectFilter = require('./api/view/data-object-filter-view');
const singleDataObject = require('./api/view/single-data-object-view');

// data object
router.get('/data-objects/search', dataObject.search);
router.get('/data-object/check_private', dataObject.checkPrivate, (req, res) => {res.send({authorized: req.authorized})});

router.get('/:datasetType/share_link/:id1/:id2', auth.verifyToken, dataObject.createPrivateShareLink);
router.get('/:datasetType/publish/:id1/:id2', auth.verifyToken, dataObject.publishDataset);
router.get('/canonical/:datasetType', dataObject.getCanonicalDatasets);
router.post('/:datasetType/download', dataObject.downloadDatasets);
router.get('/pachyderm/status', pachyderm.returnStatus);

router.post('/pset/request', psetRequest.processOnlineRequest);
router.post('/pset/process', psetRequest.processOfflineRequest);
router.post('/pset/complete', psetRequest.completeRequest);

// user
router.get('/user/find', user.find);
router.post('/user/submit', user.submit);
router.get('/user/logout', user.logout);
router.get('/user/session', auth.verifyToken, user.getSession);

router.get('/user', user.getUser);
router.post('/user/reset/email', user.sendResetPwdEmail);
router.post('/user/reset/token', user.resetPwdWithToken);
router.post('/user/reset', auth.verifyToken, user.resetPwd);

// user-dataset routes
router.get('/view/user/profile/main', auth.verifyToken, userDataset.getUserDataset);
router.post('/user/dataset/add', auth.verifyToken, userDataset.addToUserPset);
router.post('/user/dataset/remove', auth.verifyToken, userDataset.removeUserPSet);
router.post('/user/dataset/submit', auth.verifyToken, userDataset.submitDataset);
router.get('/user/dataset/submit/check_private/:id', auth.verifyToken, userDataset.check_access, userDataset.authorize);
router.get('/user/dataset/submitted/:id', auth.verifyToken, userDataset.check_access, userDataset.getSubmittedData);

// admin routes
router.get('/view/admin', auth.verifyToken, auth.isAdmin, admin.initialize);
router.post('/admin/dataset/canonical/update', auth.verifyToken, auth.isAdmin, dataObject.updateCanonicalPSets);
router.post('/admin/submission/complete/:id', auth.verifyToken, auth.isAdmin, admin.updateSubmission);
router.get('/admin/submission/list', auth.verifyToken, auth.isAdmin, admin.getSubmissionList);

//formdata and stats
// router.get('/:datasetType/formdata', formMetric.getFormData);
router.get('/:datasetType/stats/data', formMetric.getDataForStats);
router.get('/stats/metrics/options', formMetric.getMetricDataOptions);
router.post('/stats/metrics/data', formMetric.getMetricData);

// view/component data
router.get('/view/landing', landingView.get);
router.get('/view/data-object-filter', dataObjectFilter.get);
router.get('/view/single-data-object', dataObject.checkPrivate, singleDataObject.get);

// documentation
router.get('/example-download/:file', public.downloadExampleFile);

//public api
router.get('/:datasetType/:filter', public.getDatasets);
router.get('/:datasetType/:doi1/:doi2', public.getDataset);
router.get('/:datasetType/statistics/download/:limit', public.getDownloadStatistics);
router.get('/:datasetType/statistics/metrics/:dataset', public.getMetricDataStatistics);
router.get('/:datasetType/update-download/:doi1/:doi2', public.updateDownloadCount);

module.exports = router;