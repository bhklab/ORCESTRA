const express = require('express')
const router = express.Router()

//middleware
const pset = require('./api/pset')
const user = require('./api/user')
const auth = require('./api/auth')
const db = require('./api/db')
const pachyderm = require('./api/pachyderm')
const public = require('./api/public')

// pset
router.get('/pset', pset.getPsetList)
router.post('/pset/search', pset.searchPSets)
router.get('/pset/one/:id1/:id2', pset.getPSetByDOI)
router.get('/pset/canonical', pset.getCanonicalPSets)
router.get('/pachyderm/status', pachyderm.returnStatus)
router.post('/pset/request', pset.processOnlineRequest)
router.post('/pset/process', pset.processOfflineRequest)
router.post('/pset/download', pset.downloadPSets)
router.post('/pset/complete', pset.completeRequest)
router.post('/pset/canonical/update', pset.updateCanonicalPSets)

// prviate route
//router.post('/pset/cancel', auth.checkToken, pset.cancelPSetRequest);

// user
router.get('/user', user.getUser)
router.get('/user/check', user.checkUser)
router.post('/user/login', user.loginUser)
router.post('/user/register', user.registerUser)
router.get('/user/logout/:username', user.logoutUser)
router.post('/user/reset/email', user.sendResetPwdEmail)
router.post('/user/reset/token', user.resetPwdWithToken)

// private routes
router.get('/user/pset', auth.checkToken, user.getUserPSet)
router.post('/user/pset/add', auth.checkToken, user.addToUserPset)
router.post('/user/pset/remove', auth.checkToken, user.removeUserPSet)
router.get('/user/checkToken', auth.checkToken, user.checkToken)
router.post('/user/reset', auth.checkToken, user.resetPwd)

//formdata
router.get('/formdata', db.getFormData)
router.get('/stats/data', db.getDataForStats)
router.get('/stats/metrics/options', db.getMetricDataOptions)
router.post('/stats/metrics/data', db.getMetricData)

//landing data
router.get('/landing/data', db.getLandingData)

//public api
router.get('/psets/:filter', public.getPSets);
router.get('/pset/:doi1/:doi2', public.getPSet);
router.get('/psets/statistics/:limit', public.getStatistics);
router.get('/psets/update-download/:doi1/:doi2', public.updateDownloadCount);

module.exports = router;