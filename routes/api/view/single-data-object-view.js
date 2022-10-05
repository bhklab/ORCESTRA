const DataObject = require('../../../db/models/data-object').DataObject;
const Dataset = require('../../../db/models/dataset');
const DataFilter = require('../../../db/models/data-filter');
const PachydermPipeline = require('../../../db/models/pachyderm-pipeline');
const enums = require('../../../helper/enum');
const dataObjectHelper = require('../../../helper/data-object');
require('../../../db/models/dataset-note');

const getTabData = async (dataObject, dataset, filter) => {
    let tabData = [];

    if(dataset.datasetNote){
        tabData.push({
            header: 'Disclaimer',
            data: dataset.datasetNote
        });
    }
    
    let datasetTab = {
        header: 'Dataset', 
        data: {
            dataset: {
                name: dataset.name,
                version: dataset.version,
                sensitivity: dataset.sensitivity,
                publications: dataset.publications,
                filteredSensitivity: dataObject.info.filteredSensitivity
            }, 
            genome: dataObject.genome
        }
    }
    if(dataset.datasetType === enums.dataTypes.toxicogenomics){
        datasetTab.data.dataset.availableData = dataset.availableData;
    }
    tabData.push(datasetTab);
    
    if([enums.dataTypes.pharmacogenomics, enums.dataTypes.xenographic, enums.dataTypes.radiogenomics].includes(dataset.datasetType)){
        let rnaData = {};
        let dnaData = {};

        if(dataObject.tools && dataObject.tools.rna) {
            rnaData.rnaTool = filter.tools.find(item => item.name === dataObject.tools.rna);
        }
        if(dataObject.references && dataObject.references.rna) {
            rnaData.rnaRef = filter.references.find(item => item.name === dataObject.references.rna);
        }
        let rawSeqDataRNA = dataset.availableData.find(item => item.name === 'rnaseq');
        if(rawSeqDataRNA) {
            rnaData.rawSeqDataRNA = rawSeqDataRNA;
        }
        let processedDataSource = dataset.availableData.find(item => item.name === 'rnaseqProcessed');
        if(processedDataSource) {
            rnaData.processedDataSource = processedDataSource;
        }
        if(dataObject.availableDatatypes.length > 0) {
            let molDataTypes = filter.availableData.filter(item => item.genomicType === 'RNA' && !item.default);
            rnaData.accRNA = molDataTypes.filter(
                molData => dataObject.availableDatatypes.find(item => item.name === molData.name)
            ).map(molData => ({
                ...molData,
                source: dataset.availableData.find(item => item.name === molData.name).source
            }));

            molDataTypes = filter.availableData.filter(item => item.genomicType === 'DNA' && !item.default);
            dnaData.accDNA = molDataTypes.filter(
                molData => dataObject.availableDatatypes.find(item => item.name === molData.name)
            ).map(molData => ({
                ...molData,
                source: dataset.availableData.find(item => item.name === molData.name).source
            }));
        }
        if(Object.keys(rnaData).length > 0) {
            tabData.push({header: 'RNA', data: rnaData});
        }

        let rawSeqDataDNA = dataset.availableData.find(item => item.name === 'dnaseq');
        if(rawSeqDataDNA) {
            dnaData.rawSeqDataDNA = rawSeqDataDNA;
        }
        if(Object.keys(dnaData).length > 0) {
            tabData.push({header: 'DNA', data: dnaData});
        }
    }

    return tabData;
} 



/**
 * Retrives a dataset by datasettype, DOI and parses it into an object form to be used for the single dataset page.
 * @param {*} req 
 * @param {*} res 
 */
const get = async (req, res) => {
    let dataObj = {} 
    try{
        const dataObject = await DataObject.findOne({
            datasetType: req.query.datasetType, 
            'repositories.doi': req.query.doi
        }).lean();
        if(dataObject){
            const dataset = await Dataset.findOne({_id: dataObject.dataset}).select(['-stats']).populate('datasetNote').lean();
            const filter = await DataFilter.findOne({datasetType: 'pset'}).lean();

            // get the doi and downloadlink for specific data version. Only applicable to PSets. For other datasets, use 1.0.
            let repo = dataObject.repositories.find(r => r.version === dataObjectHelper.getDataVersion(req.query.datasetType));
            dataObj = {
                _id: dataObject._id,
                name: dataObject.name,
                info: dataObject.info,
                doi: repo.doi,
                downloadLink: dataObject.info.private ? `${repo.downloadLink}&access_token=${process.env.ZENODO_ACCESS_TOKEN}` : repo.downloadLink,
                bioComputeObject: repo.bioComputeObject
            }
            dataObj.tabData = [];
            dataObj.tabData = await getTabData(dataObject, dataset, filter);

            // add pachyderm pipeline config json: to be replaced with the new data processing layer API data.
            if(req.query.datasetType === enums.dataTypes.pharmacogenomics){
                const pipelines = await PachydermPipeline.find();
                console.log(dataObject._id.toString())
                let found = pipelines.find(pipeline => pipeline.data._id === dataObject._id.toString());
                let pipelineConfig = null;
                if(!found){
                    found = pipelines.find(pipeline => pipeline.original &&  (pipeline.data.pipeline.name === dataset.info.pachydermPipeline));
                    pipelineConfig = found ? found.data : null;
                }else{
                    pipelineConfig = found ? found.data.config : null;
                }
                if(pipelineConfig){
                    dataObj.tabData.push({
                        header: 'Pipeline', 
                        data: {
                            commitID: dataObject.info.commitID, 
                            config: pipelineConfig
                        }
                    });
                }
            }

            // add snakemake pipeline data 
            console.log(dataObject.info.other)
            if(dataObject.info.other && dataObject.info.other.pipeline){
                dataObj.tabData.push({
                    header: 'Pipeline',
                    data: {
                       pipeline: dataObject.info.other.pipeline,
                       additionalRepo: dataObject.info.other.additionalRepo ? dataObject.info.other.additionalRepo : []
                    }
                })
            }

            let molData = dataset.availableData.map(item => {
                let availData = dataObject.availableDatatypes.find(avail => avail.name === item.name);
                let filterItem = filter.availableData.find(avail => avail.name === item.name);
                let obj = { 
                    name: item.name,
                    label: filterItem ? filterItem.label : null, 
                };
                if(availData){
                    obj.expCount = item.expCount,
                    obj.noUpdates = item.noUpdates,
                    obj.available = true
                }
                return(obj);
            });
            let releaseNotesTab = {
                header: 'Release Notes', 
                data: {
                    datasetName: dataset.name,
                    releaseNotes: {
                        ...dataset.releaseNotes,
                        molData: molData.filter(item => item.label)
                    }
                }
            };

            dataObj.tabData.push(releaseNotesTab);
        }
    }catch(error){
        console.log(error);
        res.status(500);
    }finally{
        res.send(dataObj);
    }
}

module.exports = {
    get
}