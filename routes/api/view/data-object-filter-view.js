const DatasetObject = require('../../../db/models/dataset-object');
const DatasetNote = require('../../../db/models/dataset-note')

/**
 * Returns data object filter options to be used in the Search/Request page.
 * @param {*} req 
 * @param {*} res 
 */
const get = async (req, res) => {
	const { datatype } = req.params
    try {
		const datasetObjects = await DatasetObject.find({datasetType: datatype});
		const noteIDs = datasetObjects.map(obj =>  { // Store all ids for notes needed for datasetObjects
			return obj.datasetNote
		});
		const datasetNotes = await DatasetNote.find({ _id: { $in: noteIDs } }); // Retrieve needed dataset notes
		const noteMap = new Map(datasetNotes.map(note => [note._id.toString(), note])); // create map/dictionary for needed noteIDs --> note
		console.log(noteMap)
		datasetObjects.forEach(obj => {
			obj.datasetNote = noteMap.get(obj.datasetNote?.toString());
		});
		res.send(datasetObjects)
    } catch (err){
        console.log(err);
        res.status(500);
    }
}

module.exports = {
    get
}