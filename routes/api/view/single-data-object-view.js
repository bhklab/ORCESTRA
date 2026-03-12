const DatasetObject = require('../../../db/models/dataset-object');
const DatasetNote = require('../../../db/models/dataset-note')

/**
 * Retrives a dataset by datasettype, DOI and parses it into an object form to be used for the single dataset page.
 * @param {*} req
 * @param {*} res
 */
const get = async (req, res) => {
	const { datatype, dataset_id } = req.params
	let datasetObject = {}
	try {
		datasetObject = await DatasetObject.findOne({datasetType: datatype, _id: dataset_id});
		const datasetNote = await DatasetNote.findOne({ _id: { $in: datasetObject.datasetNote } }); // Retrieve needed dataset notes
		datasetObject.datasetNote = datasetNote;
	} catch (error) {
		console.log(error);
		res.status(500);
	} finally {
		res.send(datasetObject);
	}
};

module.exports = {
  	get,
};
