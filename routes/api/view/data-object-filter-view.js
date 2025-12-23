const DataObject = require('../../../db/models/data-object');
const Dataset = require('../../../db/models/dataset');
const DataFilter = require('../../../db/models/data-filter');
const enums = require('../../../helper/enum');

/**
 * Returns data object filter options to be used in the Search/Request page.
 * @param {*} req 
 * @param {*} res 
 */
const get = async (req, res) => {
	const { datatype } = req.params
	console.log(datatype)
    try{
		const datasets = await Dataset.find({datasetType: datatype}).lean();
		res.send(datasets)

    }catch(err){
        console.log(err);
        res.status(500);
    }
}

module.exports = {
    get
}