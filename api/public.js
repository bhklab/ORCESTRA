const mongo = require('../db/mongo');

module.exports = {
    getAvailablePSets: async (req, res) => {
        console.log('getAvailablePSets')
        try{
            //const result = await mongo.selectPSets({'status': 'complete'})
            const result = await mongo.selectPSets({'status': 'complete'}, {'projection': {
                '_id': false,
                'status': false,
                'email': false, 
                'commitID': false, 
                'dateSubmitted': false,
                'dateProcessed': false,
                'dnaTool': false,
                'dnaRef': false,
                'genome': false,
                'dataType': false,
                'dataset.label': false,
                'dataset.versionInfo.pipeline': false,
                'dataset.versionInfo.label': false,
                'dataset.versionInfo.rawSeqDataDNA': false
            }})
            res.send(result)
        }catch(error){
            console.log(error)
            res.status(500).send(error);
        }
    },

    getPSet: async (req, res) => {
        console.log('getPSet')
        try{
            const doi = req.params.doi1 + '/' + req.params.doi2;
            const result = await mongo.selectPSetByDOI(doi, {'projection': {
                '_id': false,
                'status': false,
                'email': false, 
                'commitID': false, 
                'dateSubmitted': false,
                'dateProcessed': false,
                'dnaTool': false,
                'dnaRef': false,
                'genome': false,
                'dataType': false,
                'dataset.label': false,
                'dataset.versionInfo.pipeline': false,
                'dataset.versionInfo.label': false,
                'dataset.versionInfo.rawSeqDataDNA': false
            }})
            res.send(result)
        }catch(error){
            console.log(error)
            res.status(500).send(error);
        }
    },

    getStatistics: async (req, res) => {
        console.log('getStatistics')
        try{
            const result = await mongo.selectSortedPSets({'projection': {
                '_id': false,
                'status': false,
                'email': false, 
                'commitID': false, 
                'dateSubmitted': false,
                'dateProcessed': false,
                'rnaTool': false,
                'rnaRef': false,
                'dnaTool': false,
                'dnaRef': false,
                'genome': false,
                'dataType': false,
                'dataset': false
            }})
            let num = parseInt(req.params.limit, 10)
            num = (isNaN(num) || num >= result.length ? result.length -1 : num)
            res.send(result.slice(0, num))
        }catch(error){
            console.log(error)
            res.status(500).send(error);
        }
    }
}