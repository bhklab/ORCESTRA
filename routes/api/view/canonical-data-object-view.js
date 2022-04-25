const DataObject = require('../../../db/models/data-object').DataObject;
const DataFilter = require('../../../db/models/data-filter');
const dataObjectHelper = require('../../../helper/data-object');
require('../../../db/models/dataset');

const formatDataObjects = (objects, toolRefLabels) => {
    let repoVer = dataObjectHelper.getDataVersion('pset');
    return(
        objects.map(({repositories, ...obj}) => {
            let repository = repositories.find(repo => repo.version === repoVer);
            let tool = obj.tools ? toolRefLabels.tools.find(tool => tool.name === obj.tools.rna) : null;
            let reference = obj.references ? toolRefLabels.references.find(ref => ref.name === obj.references.rna) : null;
            return({
                ...obj,
                doi: repository.doi,
                downloadLink: repository.downloadLink,
                tools: {
                    rna: tool ? tool.label : ''
                },
                references: {
                    rna: reference ? reference.label : ''
                }
            })
        })
    );
}

const get = async (req, res) => {
    let result = [];
    try{
        const dataObjects = await DataObject.find({
            datasetType: req.query.datasetType, 
            'info.status': 'complete',
            'info.private': false,
            'info.createdBy': 'BHK Lab'
        }).populate('dataset', 'name version').lean();

        const toolRefLabels = await DataFilter.findOne({datasetType: req.query.datasetType}).select({tools: 1, references: 1});
        
        let datasetNames = [...new Set(dataObjects.map(obj => obj.dataset.name))].sort((a, b) => a.localeCompare(b));
        result = datasetNames.map(datasetName => {
            let canonicals = dataObjects.filter(obj => obj.dataset.name === datasetName && obj.info.canonical).sort((a, b) => a.name.localeCompare(b.name));
            let nonCanonicals = dataObjects.filter(obj => obj.dataset.name === datasetName && !obj.info.canonical).sort((a, b) => a.name.localeCompare(b.name));
            return({
                dataset: datasetName,
                canonicals: formatDataObjects(canonicals, toolRefLabels),
                nonCanonicals: formatDataObjects(nonCanonicals, toolRefLabels)
            })
        });
        result = result.filter(item => item.canonicals.length > 0);
    }catch(error){
        console.log(error);
        result = error;
        res.status(500);
    }finally{
        res.send(result);
    }
}

module.exports = {
    get
}