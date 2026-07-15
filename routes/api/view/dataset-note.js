const DatasetNote = require('../../../db/models/dataset-note')

/**
 * Retrives a dataset by dataType and dataset_id to be used for the single dataset page.
 * @param {*} req datatype (dataset type, ex. pset), dataset_id (database _id)
 * @param {*} res datasetObject (extracted dataset information from db)
 */
const getAll = async (req, res) => {
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

export {
	getAll
}

