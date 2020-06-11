/**
 * JS file used to run the DB scripts.
 */
require('dotenv').config();
const path = require('path')
const backup = require('./dbbackup')
const metrics = require('./metricdata')
const form = require('./formdata')
const pset = require('./buildpsets')

// const connStrOrigin = '';
// const dbNameOrigin = 'orcestra-dev';
// const connStrDest = '';
// const dbNameDest = 'orcestra';
// const names = ['formdata', 'pset', 'req-config-master', 'metric-data']

// backup.insertBackup(connStrOrigin, dbNameOrigin, connStrDest, dbNameDest, names)
const connStr = 'mongodb+srv://root:root@development-cluster-ptdz3.azure.mongodb.net/test?retryWrites=true&w=majority'
//form.insertFormdata(connStr, 'orcestra-dev')
pset.buildInsertPSetObjects(connStr, 'orcestra-dev', path.join(__dirname, 'data/psets/Canonical_PSets.csv'))