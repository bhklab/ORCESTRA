/**
 * Includes API routes to fetch data for a single page.
 */
const Dataset = require('../../../new-db/models/dataset');
const DataObject = require('../../../new-db/models/data-object').DataObject;
const DataFilter = require('../../../new-db/models/data-filter');
const dataObjectHelper = require('../../../helper/data-object');

/**
 * Retrieves all the data to be rendered on the landing page.
 * @param {*} req 
 * @param {*} res 
 */
 const get = async (req, res) => {
    let data = {status: 0, err: {}, searchData: {}, downloadRanking: [], reqStatus: {}};
    try{
        // Get all pharmacogenomic datasets that are not 'hidden'
        const datasets = await Dataset.find({
            datasetType: req.query.datasetType,
            'status.unavailable': false
        })
        .select({
            name: 1,
            version: 1,
            status: 1,
            publications: 1,
            sensitivity: 1
        }).lean();
        // Get data for dataset modal
        data.searchData.numDataVersions = datasets.length;
        let uniqueDatasets = [...new Set(datasets.map(item => item.name))];
        uniqueDatasets.sort((a, b) => a.localeCompare(b));
        data.searchData.dataset = uniqueDatasets.map(item => ({
            name: item,
            versions: datasets.filter(d => d.name === item)
        }));
        // Get data for RNA modal
        const filters = await DataFilter.findOne({datasetType: req.query.datasetType}).lean();
        data.searchData.rnaTool = filters.tools.filter(item => item.genomicType === 'RNA');
        data.searchData.rnaRef = filters.references.filter(item => item.genomicType === 'RNA');

        // Get all PSets
        const objects = await DataObject.find({
            datasetType: req.query.datasetType,
        })
        .select({
            name: 1, 
            info: 1,
            repositories: 1
        }).lean();
        // Get download numbers for canonical PSets
        let canonicals = objects.filter(item => !item.info.unavailable && item.info.canonical);
        canonicals.sort((a, b) => b.info.numDownload - a.info.numDownload);
        data.downloadRanking = canonicals.splice(0, 5).map(item => ({
            name: item.name,
            numDownload: item.info.numDownload,
            doi: item.repositories.find(repo => repo.version === dataObjectHelper.getDataVersion(req.query.datasetType)).doi
        }));
        // Get number of pending/in-process data objects.
        data.reqStatus.pending = objects.filter(item => item.info.status === 'pending').length;
        data.reqStatus.inProcess = objects.filter(item => item.info.status === 'in-process').length;

        data.status = 1;
    }catch(err){
        console.log(err);
        data.err = err;
        res.status(500);
    }finally{
        res.send(data);
    }
}

module.exports = {
    get
}