const mongo = require('../db/mongo');

module.exports = {

    getPSets: async (req, res) => {
        console.log('getPSets')

        const filter = {'status': 'complete'}

        const projection = {'projection': {
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
        }}

        let psets = []

        try{
            const form = await mongo.getFormData()
            
            if(req.params.filter === 'canonical'){
                let datasets = await mongo.getCanonicalPSets(filter, projection)
                datasets.forEach(data => data.canonicals.forEach(c => psets.push(c)))
            }else{
                psets = await mongo.selectPSets(filter, projection)
            }

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

                // attach accompanyRNA data if exists
                if(psets[i].accompanyRNA.length){
                    const accRNA = form.accompanyRNA.filter(acc => {
                        return acc.dataset === psets[i].dataset.name
                    })
                    psets[i].accompanyRNA = accRNA
                }

                // attach accompanyDNA data if exists
                if(psets[i].accompanyRNA.length){
                    const accDNA = form.accompanyDNA.filter(acc => {
                        return acc.dataset === psets[i].dataset.name
                    })
                    psets[i].accompanyDNA = accDNA
                }
            }

            res.send(psets)

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