const formdata = require('../../db/helper/formdata');
const datasetSelect = require('../../db/helper/dataset-select');
const datasetUpdate = require('../../db/helper/dataset-update');
const datasetCanonical = require('../../db/helper/dataset-canonical');
const metricData = require('../../db/helper/metricdata');
const path = require('path');

/**
 * Contains functions used for publically exposed API calls.
 */
module.exports = {

    getPSets: async (req, res) => {
        console.log('getPSets');
        let datasetType = req.params.datasetType.replace(/s([^s]*)$/, '$1');

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
            const form = await formdata.getFormData(datasetType);
            if(req.params.filter === 'canonical'){
                let datasets = await datasetCanonical.getCanonicalDatasets(datasetType, filter, projection)
                datasets.forEach(data => data.canonicals.forEach(c => psets.push(c)))
            }else{
                psets = await datasetSelect.selectDatasets(datasetType, filter, projection)
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

            res.send(psets);

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
            const result = await datasetSelect.selectDatasetByDOI(req.params.datasetType, doi, {'projection': {
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

    getDownloadStatistics: async (req, res) => {
        console.log('getStatistics');
        let datasetType = req.params.datasetType.replace(/s([^s]*)$/, '$1');
        try{
            let result = await datasetSelect.selectDatasets(datasetType, {}, {'projection': {
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

    /**
     * Returns metric data statistics
     * @param {*} req 
     * @param {*} res 
     */
    getMetricDataStatistics: async (req, res) => {
        console.log('getMetricDataStatistics');

        let datasetType = req.params.datasetType.replace(/s([^s]*)$/, '$1');
        try{
            let datasetVersions = [];
            let datasets = await datasetCanonical.getCanonicalDatasets(datasetType, {}, {});
            if(req.params.dataset !== 'all'){
                datasets = datasets.find(item => item.dataset === req.params.dataset);
                datasetVersions = datasets.canonicals.map(item => ({name: item.dataset.name, version: item.dataset.versionInfo}));
            }else{
                datasets.forEach(dataset => {
                    let canonicals = dataset.canonicals.map(item => ({name: item.dataset.name, version: item.dataset.versionInfo}));
                    datasetVersions = datasetVersions.concat(canonicals);
                })
            }

            let metrics = await metricData.getMetricData(datasetType, '', [...new Set(datasetVersions.map(item => item.name))], true);

            datasetVersions.forEach(dataset => {
                let found = metrics.find(metric => metric.name === dataset.name);
                let metricData = found.versions.find(version => version.version === dataset.version);
                dataset.genes = metricData.genes;
                dataset.cellLines = metricData.releaseNotes.cellLines;
                dataset.drugs = metricData.releaseNotes.drugs;
                dataset.experiments = metricData.releaseNotes.experiments;
                dataset.molData = metricData.releaseNotes.molData;
            });
            // console.log(datasetVersions);
            res.send(datasetVersions);
        }catch(error){
            console.log(error);
            res.status(500).send(error);
        }
        
    },

    /**
     * Used by PharmacoGx to update PSet download count when a user downloads a PSet from ORCESTRA through PharmacoGx
     */
    updateDownloadCount: async (req, res) => {
        console.log('updateDownloadCount');
        let datasetType = req.params.datasetType.replace(/s([^s]*)$/, '$1');
        try{
            const doi = req.params.doi1 + '/' + req.params.doi2;
            await datasetUpdate.updateDownloadCount(datasetType, doi);
            res.send({});
        }catch(error){
            console.log(error);
            res.send({});
        }
    },

    downloadExampleFile: async (req, res) => {
        let filePath = path.join(__dirname, '../../db/documentation-examples', req.params.file);
        res.download(filePath, (err) => {if(err)console.log(err)});
    }
}