const mongo = require('../mongo');
const formdata = require('./formdata');
const psetCanonical = require('./pset-canonical');

module.exports = {

    getMetricData: async function(metricType, datasets){
        try{
            let querySet = datasets.length ? {'name':{$in: datasets}} : {}
            let field = 'versions.' + metricType
            let projection = {'projection': {
                'name': true,
                'versions.version': true,
                [field]: true
            }}
            
            const db = await mongo.getDB();
            const metricData = db.collection('metric-data');
            const metrics = await metricData.find(querySet, projection).toArray()

            return(metrics)
        }catch(err){
            console.log(err)
            throw err
        }
    },

    getAvailableDatasetForMetrics: async function(){
        try{
            let projection = {'projection': {
                'name': true,    
                'versions.version': true
                }
            }

            const db = await mongo.getDB();
            const metricData = db.collection('metric-data');
            const metrics = await metricData.find({}, projection).toArray()
            return(metrics)
        }catch(err){
            console.log(err)
            throw err
        }
    },

    getLandingData: async function(){
        const db = await mongo.getDB();
        const res = {status: 0, err: {}, form: {}, user: {}, pset: {}, dashboard: {}};
        try{
            const user = db.collection('user');
            const pset = db.collection('pset');

            res.form = await formdata.getFormData();

            res.user = await user.find({'registered': true}).count();

            const ranking = await psetCanonical.getCanonicalDownloadRanking();
            res.pset = ranking.splice(0,5);

            const array = await pset.find().toArray();
            const pending = await array.filter(pset => {
                return pset.status === 'pending'
            });
            const inProcess = await array.filter(pset => {
                return pset.status === 'in-process'
            })
            res.dashboard.pending = pending ? pending.length : 0;
            res.dashboard.inProcess = inProcess? inProcess.length: 0;

            res.status = 1;
        }catch(err){
            res.err = err
        }finally{
            return res;
        }
    },
}