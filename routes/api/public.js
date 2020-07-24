const formdata = require('../../db/helper/formdata');
const psetSelect = require('../../db/helper/pset-select');
const psetUpdate = require('../../db/helper/pset-update');
const psetCanonical = require('../../db/helper/pset-canonical');

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
            'dataset.label': false,
            'dataset.unavailable': false
        }}

        let psets = []

        try{
            const form = await formdata.getFormData()
            
            if(req.params.filter === 'canonical'){
                let datasets = await psetCanonical.getCanonicalPSets(filter, projection)
                datasets.forEach(data => data.canonicals.forEach(c => psets.push(c)))
            }else{
                psets = await psetSelect.selectPSets(filter, projection)
            }

            for(let i = 0; i < psets.length; i++){
                const version = form.dataset.find(
                    d => {return d.name === psets[i].dataset.name}
                ).versions.find(
                    version => {return(version.version === psets[i].dataset.versionInfo)}
                )
                psets[i].dataset.versionInfo = {
                    version: version.version, 
                    type: version.type,
                    publication: version.publication, 
                    rawSeqDataRNA: version.rawSeqDataRNA, 
                    drugSensitivity: version.drugSensitiviry
                }

                psets[i].accompanyRNA = []
                psets[i].accompanyDNA = []
                let accRNA = psets[i].dataType.filter(dt => {return dt.type === 'RNA' && !dt.default})
                let accDNA = psets[i].dataType.filter(dt => {return dt.type === 'DNA' && !dt.default})

                // assign accompanying RNA and DNA metadata
                if(accRNA.length){
                    accRNA.forEach(rna => {
                        const data = form.accompanyRNA.find(acc => {return (psets[i].dataset.name === acc.dataset && rna.name === acc.name)})
                        psets[i].accompanyRNA.push(data)
                    })
                }
                if(accDNA.length){
                    accDNA.forEach(dna => {
                        const data = form.accompanyDNA.find(acc => {return (psets[i].dataset.name === acc.dataset && dna.name === acc.name)})
                        psets[i].accompanyDNA.push(data)
                    })
                }

                // delete unnecessary fields
                delete psets[i].dataType;
                delete psets[i].pipeline;
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
            const result = await psetSelect.selectPSetByDOI(doi, {'projection': {
                '_id': false,
                'status': false,
                'email': false, 
                'commitID': false, 
                'dateSubmitted': false,
                'dateProcessed': false,
                'dnaTool': false,
                'dnaRef': false,
                'genome': false,
                'dataset.label': false,
                'dataset.unavailable': false,
                'dataset.versionInfo.pipeline': false,
                'dataset.versionInfo.label': false
            }})
            
            // delete unnecessary fields
            delete result.dataType;
            delete result.pipeline;

            res.send(result)
        }catch(error){
            console.log(error)
            res.status(500).send(error);
        }
    },

    getStatistics: async (req, res) => {
        console.log('getStatistics')
        try{
            let result = await psetSelect.selectPSets({}, {'projection': {
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
    },

    updateDownloadCount: async (req, res) => {
        console.log('updateDownloadCount');
        try{
            const doi = req.params.doi1 + '/' + req.params.doi2;
            await psetUpdate.updateDownloadCount(doi);
            res.send({});
        }catch(error){
            console.log(error);
            res.send({});
        }
    }
}