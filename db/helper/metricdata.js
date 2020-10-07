const mongo = require('../mongo');
const formdata = require('./formdata');
const psetCanonical = require('./pset-canonical');

module.exports = {

    /**
     * For Stats page
     * Returns metric data to be rendered on the stats page by looking for a type of metric data, and the list of datasets to retrieve the metric data from.
     * @param {*} metricType // type of metric data to be returned: drugs, cellLines, cellLineDrugPairs, genes, or tissues
     * @param {*} datasets // list of datasets to fetch the metric data from
     */
    getMetricData: async function(metricType, datasets){
        try{
            let querySet = datasets.length ? {'name':{$in: datasets}} : {}
            let field = 'versions.' + metricType;
            let projection = {'projection': {
                'name': true,
                'versions.version': true,
                [field]: true
            }}
            
            const db = await mongo.getDB();
            const metricData = db.collection('metric-data');
            let metrics = await metricData.find(querySet, projection).toArray();
            
            return(metrics);
        }catch(err){
            console.log(err)
            throw err
        }
    },

    /**
     * For Stats page
     * Returns available datasets to render dataset metric data.
     * Filters the datasets used for canonical PSets only.
     */
    getAvailableDatasetForMetrics: async function(){
        try{
            const db = await mongo.getDB();

            // obtains dataset name and version of current canonical PSets.
            const pset = db.collection('pset');
            const canonicals = await pset.find({'canonical': true}, {'projection': {'dataset': true}}).sort({'name': 1, 'version': 1}).toArray();
            
            // converts it to an array of objects containing dataste name and version.
            const datasets = canonicals.map(pset => ({name: pset.dataset.name, version: pset.dataset.versionInfo}));

            return(datasets);
        }catch(err){
            console.log(err)
            throw err
        }
    },

    /**
     * For Main (landing) page
     * Returns an object containing dataset metric data to be rendered on the landing page.
     */
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