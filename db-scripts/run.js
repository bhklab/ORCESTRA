/**
 * JS file used to run the DB scripts.
 */
const path = require('path')
const backup = require('./dbbackup')
const metrics = require('./metricdata')

// const connStrOrigin = '';
// const dbNameOrigin = 'orcestra-dev';
// const connStrDest = '';
// const dbNameDest = 'orcestra';
// const names = ['formdata', 'pset', 'req-config-master', 'metric-data']

// backup.insertBackup(connStrOrigin, dbNameOrigin, connStrDest, dbNameDest, names)

const connStr = 'mongodb+srv://orcestra-bhklab:JcL2ssoXsYGOojSf@cluster0-kqz6w.azure.mongodb.net/test?retryWrites=true&w=majority'
metrics.insertMetricData(connStr, 'orcestra', path.join(__dirname, 'data', 'metrics'))