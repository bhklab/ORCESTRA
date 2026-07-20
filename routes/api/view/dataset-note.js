import DatasetNote from '../../../db/models/dataset-note.js';

/**
 * Retrives a dataset by dataType and dataset_id to be used for the single dataset page.
 * @param {*} req datatype (dataset type, ex. pset), dataset_id (database _id)
 * @param {*} res datasetObject (extracted dataset information from db)
 */
const getAll = async (req, res) => {
	let datasetNotes = []
	try {
		datasetNotes = await DatasetNote.find(); // Retrieve all dataset notes
	} catch (error) {
		console.log(error);
		res.status(500);
	} finally {
		res.send(datasetNotes);
	}
};

export {
	getAll
}

