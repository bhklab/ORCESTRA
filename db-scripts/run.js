/**
 * JS file used to run the DB scripts.
 */
const path = require('path')
const backup = require('./dbbackup')
const metrics = require('./metricdata')
const form = require('./formdata')
const mongo  = require('mongodb');
const mongoClient = mongo.MongoClient;
//const pset = require('./buildpsets')

// const connStrOrigin = '';
// const dbNameOrigin = 'orcestra-dev';
// const connStrDest = '';
// const dbNameDest = 'orcestra';
// const names = ['formdata', 'pset', 'req-config-master', 'metric-data']

// backup.insertBackup(connStrOrigin, dbNameOrigin, connStrDest, dbNameDest, names)
const connStr = ''
form.insertFormdata(connStr, 'orcestra')
//pset.buildInsertPSetObjects(connStr, 'orcestra-dev', path.join(__dirname, 'data/psets/Canonical_PSets.csv'))

// const run = async () => {
//     let client = {}
//     try{
//         console.log('start')
//         client = await mongoClient.connect(connStr, {useNewUrlParser: true, useUnifiedTopology: true})
//         const db = client.db('orcestra')
//         const pset = db.collection('pset')
//         const test = db.collection('pset-test')

//         let psets = await pset.find().toArray()

//         for(let i = 0; i < psets.length; i++){
//             psets[i].dataType.forEach((p) => {p.label='RNA Sequence'; p.name='rnaseq';})
//             psets[i].dataset.versionInfo = psets[i].dataset.versionInfo.version
//             psets[i].rnaTool.forEach((t) => {delete t.commands})
//             psets[i].rnaRef.forEach((r) => {delete r.genome; delete r.source;})
//         }
//         await test.deleteMany()
//         await test.insertMany(psets)
//         console.log('done')
//         client.close()
//     }catch(err){
//         console.log(err)
//         client.close()
//     }
// }

// run()

