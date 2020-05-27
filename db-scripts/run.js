/**
 * JS file used to run the DB scripts.
 */
const backup = require('./dbbackup')

const connStrOrigin = '';
const dbNameOrigin = 'orcestra-dev';
const connStrDest = '';
const dbNameDest = 'orcestra';
const names = ['formdata', 'pset', 'req-config-master', 'metric-data']

backup.insertBackup(connStrOrigin, dbNameOrigin, connStrDest, dbNameDest, names)