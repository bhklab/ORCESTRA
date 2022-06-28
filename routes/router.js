/**
 * @fileoverview routing specification for the web app backend
 */
const express = require('express');
const router = express.Router();

const landing = require('./api/view/landing-view');
const dataObjectFilter = require('./api/view/data-object-filter-view');
const singleDataObject = require('./api/view/single-data-object-view');
const canonicalDataObjects = require('./api/view/canonical-data-object-view');
const statistics = require('./api/view/statistics-view');
const profile = require('./api/view/profile-view');
const documentation = require('./api/view/documentation-view');
const admin = require('./api/view/admin');

const dataObject = require('./api/data-object');
const userDataObject = require('./api/user-data-object');
const user = require('./api/user');
const auth = require('./api/auth');
const public = require('./api/public');

// view/component-specific routes
router.get('/view/landing', landing.get);
router.get('/view/data-object-filter', dataObjectFilter.get);
router.get('/view/single-data-object', dataObject.checkPrivate, singleDataObject.get);
router.get('/view/canonical-data-objects', canonicalDataObjects.get);
router.get('/view/statistics', statistics.get);
router.get('/view/statistics/upset-plot', statistics.upsetPlot);
router.get('/view/user/profile/main', auth.verifyToken, profile.get);
router.get('/view/documentation/example-download/:file', documentation.downloadExampleFile);
router.get('/view/admin/canonical_psets', auth.verifyToken, auth.isAdmin, admin.canonicalPSets);
router.get('/view/admin/processed_data_obj', auth.verifyToken, auth.isAdmin, admin.processedDataObjects);

// data object
router.get('/data-objects/search', dataObject.search);
router.get('/data-object/check_private', dataObject.checkPrivate, (req, res) => {res.send({authorized: req.authorized})});
router.post('/data-object/download', dataObject.download);
router.post('/data-object/sharelink', auth.verifyToken, dataObject.createShareLink);
router.post('/data-object/publish', auth.verifyToken, dataObject.publish);
router.post('/data-objects/update_canonical', auth.verifyToken, auth.isAdmin, dataObject.updateCanonical);


// user
router.get('/user/find', user.find);
router.post('/user/submit', user.submit);
router.get('/user/logout', user.logout);
router.get('/user/session', auth.verifyToken, user.session);
router.post('/user/reset/email', user.sendResetPwdEmail);
router.post('/user/reset/token', user.resetPwdWithToken);
router.post('/user/reset', auth.verifyToken, user.resetPwd);

// user-dataset routes
router.post('/user/dataset/add', auth.verifyToken, userDataObject.add);
router.post('/user/dataset/remove', auth.verifyToken, userDataObject.remove);
// router.post('/user/dataset/submit', auth.verifyToken, userDataset.submitDataset);
// router.get('/user/dataset/submit/check_private/:id', auth.verifyToken, userDataset.check_access, userDataset.authorize);
// router.get('/user/dataset/submitted/:id', auth.verifyToken, userDataset.check_access, userDataset.getSubmittedData);

// admin routes
// router.post('/admin/submission/complete/:id', auth.verifyToken, auth.isAdmin, admin.updateSubmission);
// router.get('/admin/submission/list', auth.verifyToken, auth.isAdmin, admin.getSubmissionList);

// data object requests: to be replaced with new data processing layer API.
// router.get('/pachyderm/status', pachyderm.returnStatus);
// router.post('/pset/request', psetRequest.processOnlineRequest);
// router.post('/pset/process', psetRequest.processOfflineRequest);
// router.post('/pset/complete', psetRequest.completeRequest);

//public api
router.get('/:datasetType/:filter', public.getDatasets);
router.get('/:datasetType/:doi1/:doi2', public.getDataset);
router.get('/:datasetType/update-download/:doi1/:doi2', public.updateDownloadCount);

module.exports = router;