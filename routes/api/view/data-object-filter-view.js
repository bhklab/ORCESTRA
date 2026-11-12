const DatasetObject = require('../../../db/models/dataset-object');
const DatasetNote = require('../../../db/models/dataset-note');
const User = require('../../../db/models/user');
const auth = require('../auth');

/**
 * Returns data object filter options to be used in the Search/Request page.
 * Hides private datasets unless owned by the logged-in user.
 * @param {*} req 
 * @param {*} res 
 */
const get = async (req, res) => {
	const { datatype } = req.params;
    try {
		let userOwnedIds = [];
		if (req.cookies && req.cookies.orcestratoken) {
			const username = auth.getUsername(req.cookies.orcestratoken);
			if (username) {
				const user = await User.findOne({ email: username }).select('userDataObjects').lean();
				if (user && user.userDataObjects) {
					userOwnedIds = user.userDataObjects;
				}
			}
		}

		const query = {
			datasetType: datatype,
			$or: [
				{ 'info.private': { $ne: true } },
				...(userOwnedIds.length > 0 ? [{ _id: { $in: userOwnedIds } }] : [])
			]
		};

		const datasetObjects = await DatasetObject.find(query);
		const noteIDs = datasetObjects.map(obj =>  { // Store all ids for notes needed for datasetObjects
			return obj.datasetNote
		});
		const datasetNotes = await DatasetNote.find({ _id: { $in: noteIDs } }); // Retrieve needed dataset notes
		const noteMap = new Map(datasetNotes.map(note => [note._id.toString(), note])); // create map/dictionary for needed noteIDs --> note
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