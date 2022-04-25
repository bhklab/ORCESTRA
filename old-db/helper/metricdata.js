const mongo = require('../mongo');
const formdata = require('./formdata');
const datasetCanonical = require('./dataset-canonical');

module.exports = {

    /**
     * For Stats page
     * Returns metric data to be rendered on the stats page by looking for a type of metric data, and the list of datasets to retrieve the metric data from.
     * @param {*} metricType // type of metric data to be returned: drugs, cellLines, cellLineDrugPairs, genes, or tissues
     * @param {*} datasets // list of datasets to fetch the metric data from
     */
    getMetricData: async function(datasetType, metricType, datasets, isAPI){
        try{
            let querySet = datasets.length ? {'name':{$in: datasets}, 'datasetType': datasetType} : {'datasetType': datasetType};
            let field = 'versions.' + metricType;
            let projection = {};

            if(isAPI){
                projection = {
                        'projection': {
                        'name': true,
                        'versions.version': true,
                        'versions.genes': true,
                        'versions.releaseNotes': true,
                    }
                }
            }else{
                projection = metricType.length ? {
                        'projection': {
                        'name': true,
                        'versions.version': true,
                        [field]: true,
                        'versions.releaseNotes': true
                    }
                } : {};
            }
            
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
            const canonicals = await pset.find(
                {
                    'canonical': true,
                }, 
                {
                    'projection': {'dataset': true}
                }
            ).sort({'name': 1, 'version': 1}).toArray();
            
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
    // getLandingData: async function(datasetType){
    //     const db = await mongo.getDB();
    //     const res = {status: 0, err: {}, form: {}, user: {}, dataset: {}, dashboard: {}};
    //     try{
    //         //const user = db.collection('user');
    //         const dataset = db.collection(datasetType);

    //         res.form = await formdata.getFormData(datasetType);
    //         res.form.dataset = res.form.dataset.filter(item => !item.disabled);

    //         //res.user = await user.find({'registered': true}).count();

    //         const ranking = await datasetCanonical.getCanonicalDownloadRanking(datasetType);
    //         res.dataset = ranking.splice(0,5);

    //         const array = await dataset.find().toArray();
    //         const pending = await array.filter(dataset => {
    //             return dataset.status === 'pending'
    //         });
    //         const inProcess = await array.filter(dataset => {
    //             return dataset.status === 'in-process'
    //         })
    //         res.dashboard.pending = pending ? pending.length : 0;
    //         res.dashboard.inProcess = inProcess? inProcess.length: 0;

    //         res.status = 1;
    //     }catch(err){
    //         res.err = err
    //     }finally{
    //         return res;
    //     }
    // },

    /**
     * For single PSet page release notes
     * Returns an object containing metric data of a specific version of a dataset.
     * @param name string value for the name of the dataset
     * @param version string value for the dataset version
     */
    getMetricDataVersion: async function(datasetType, name, version, projectedField){
        try{
            console.log(`${datasetType} ${name} ${version}`);
            const db = await mongo.getDB();
            const metricData = db.collection('metric-data');
            let data = await metricData.aggregate([
                {
                    '$match': {
                        'datasetType': datasetType,
                        'name': name
                    }
                },
                {'$unwind': '$versions'},
                {'$match': {
                    'versions.version': version
                }},
                {
                    '$group': {
                        _id: '$_id',
                        version: { '$push':{
                            'version': '$versions.version',
                            [projectedField]: '$versions.' + projectedField
                        }}
                    }
                }
            ]).toArray();
            let metrics = {
                name: name,
                ...data[0].version[0]
            }
            return(metrics);
        }catch(error){
            console.log(error);
            throw error;
        }
        
    }
}