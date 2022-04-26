const Dataset = require('../../../db/models/dataset');
const DataFilter = require('../../../db/models/data-filter');
const enums = require('../../../helper/enum');

/**
 * Returns data object filter options to be used in the Search/Request page.
 * @param {*} req 
 * @param {*} res 
 */
const get = async (req, res) => {
    let objFilter = {
        dataset: [],
        molDataType: [],
        genome: [],
        rnaTool: [],
        rnaRef: []
    };
    try{
        let filter = await DataFilter.findOne({datasetType: req.query.datasetType}).lean();
        let datasets = await Dataset.find({
            datasetType: req.query.datasetType
        }).select({
            name: 1, 
            version: 1, 
            status: 1, 
            availableData: 1
        }).lean();
        datasets = datasets.filter(dataset => !dataset.status.unavailable);
        let datasetNames = [...new Set(datasets.map(item => item.name))];
        objFilter.dataset = datasetNames.map(name => {
            let filtered = datasets.filter(dataset => dataset.name === name);
            return({
                label: name,
                name: name,
                versions: filtered.map(dataset => ({
                            version: dataset.version, 
                            label: `${dataset.version}(${name})`, 
                            disabled: dataset.status.disabled
                        })).sort((a, b) => a.version.localeCompare(b.version)),
                accompanyData: [],
                unavailable: filtered[0].status.unavailable,
                requestDisabled: filtered[0].status.requestDisabled
            });
        });
        objFilter.dataset.sort((a, b) => a.name.localeCompare(b.name));

        if(req.query.datasetType === enums.dataTypes.pharmacogenomics){
            for(let filterDataset of objFilter.dataset){
                let filtered = datasets.filter(dataset => dataset.name === filterDataset.name);
                let accompanyData = [].concat(...filtered.map(item => item.availableData));
                let uniqueDataNames = [...new Set(accompanyData.map(item => item.name))];
                uniqueDataNames = uniqueDataNames.filter(name => filter.availableData.map(item => item.name).includes(name));
                filterDataset.accompanyData = uniqueDataNames.map(name => {
                    let moldata = accompanyData.find(item => item.name === name);
                    return({
                        label: filter.availableData.find(item => item.name === moldata.name).label, 
                        name: moldata.name,
                        type: moldata.datatype, 
                        dataset: filterDataset.name, 
                        options: moldata.options ? moldata.options : undefined,
                        hidden: false
                    });
                });
            };
            objFilter.genome = filter.genome.map(item => ({label: item, name: item}));
            objFilter.rnaTool = filter.tools.filter(item => item.genomicType === 'RNA').map(item => ({...item, hidden: false}));
            objFilter.rnaRef = filter.references.map(item => ({...item, hidden: false}));
            objFilter.molDataType = filter.availableData;
        }
    }catch(err){
        console.log(err);
        res.status(500);
    }finally{
        res.send(objFilter);
    }
}

module.exports = {
    get
}