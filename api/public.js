const mongo = require('../db/mongo');

module.exports = {
    getAvailablePSets: async (req, res) => {
        console.log('getAvailablePSets')
        try{
            const form = await mongo.getFormData()
            let psets = await mongo.selectPSets({'status': 'complete'}, {'projection': {
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
            }})
            for(let i = 0; i < psets.length; i++){
                const version = form.dataset.find(
                    d => {return d.name === psets[i].dataset.name}
                ).versions.find(
                    version => {return(version.version === psets[i].dataset.versionInfo)}
                )
                psets[i].dataset.versionInfo = {
                    version: version.version, 
                    publication: version.publication, 
                    rawSeqDataRNA: version.rawSeqDataRNA, 
                    drugSensitivity: version.drugSensitiviry
                }
            }
            res.send(psets)
        }catch(error){
            console.log(error)
            res.status(500).send(error);
        }
    },

    getCanonicalPSets: async (req, res) => {
        console.log('getAvailablePSets')
        try{
            const form = await mongo.getFormData()
            let datasets = await mongo.getCanonicalPSets({'status': 'complete'}, {'projection': {
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
            }})
            
            let canonicals = []
            datasets.forEach(data => data.canonicals.forEach(c => canonicals.push(c)))

            // attach version / drug sensitivity info.
            for(let i = 0; i < canonicals.length; i++){
                const version = form.dataset.find(
                    d => {return d.name === canonicals[i].dataset.name}
                ).versions.find(
                    version => {return(version.version === canonicals[i].dataset.versionInfo)}
                )
                canonicals[i].dataset.versionInfo = {
                    version: version.version, 
                    publication: version.publication, 
                    rawSeqDataRNA: version.rawSeqDataRNA, 
                    drugSensitivity: version.drugSensitiviry
                }
            }
            res.send(canonicals)
        }catch(error){
            console.log(error)
            res.status(500).send(error);
        }
    },

    getPSet: async (req, res) => {
        console.log('getPSet')
        try{
            const doi = req.params.doi1 + '/' + req.params.doi2;
            console.log(doi)
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
            let result = await mongo.selectPSets({}, {'projection': {
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
            result.sort((a, b) => (a.download < b.download) ? 1 : -1)
            let num = parseInt(req.params.limit, 10)
            num = (isNaN(num) || num >= result.length ? result.length -1 : num)
            res.send(result.slice(0, num))
        }catch(error){
            console.log(error)
            res.status(500).send(error);
        }
    }
}