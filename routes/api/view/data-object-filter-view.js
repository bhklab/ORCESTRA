const DatasetObject = require('../../../db/models/dataset-object');
const DatasetNote = require('../../../db/models/dataset-note')

/**
 * Returns data object filter options to be used in the Search/Request page.
 * @param {*} req 
 * @param {*} res 
 */
const get = async (req, res) => {
	const { datatype } = req.params
	console.log(datatype)
    try{
		const datasetObjects = await DatasetObject.find({datasetType: datatype}).lean();
		console.log(typeof(datasetObjects['dataset']))
		// datasetObjects.datasetNote = await DatasetNote.find({_id: datasetObjects.datasetNote})
		console.log(datasetObjects)
		res.send(datasetObjects)

    } catch (err){
        console.log(err);
        res.status(500);
    }
}

module.exports = {
    get
}