/**
 * Contains functions used for publically exposed API calls.
 */
const enums = require('../../helper/enum');
const DatasetObject = require('../../db/models/dataset-object');
const DatasetNote = require('../../db/models/dataset-note')

const parseDataObject = (dataObject, repoVersion) => {
    const findDataSource = (dataName) => {
        found = dataObject.dataset.availableData.find(avail => avail.name === dataName);
        return(found ? found.source : null); 
    };

    let repository = dataObject.repositories.find(repo => repo.version === repoVersion);
    return({
        name: dataObject.name,
        doi: repository.doi,
        downloadLink: repository.downloadLink,
        dateCreated: dataObject.info.date.created,
        dataset: {
            name: dataObject.dataset.name,
            versionInfo: {
                version: dataObject.dataset.version,
                type: dataObject.dataset.info ? dataObject.dataset.info.includedData : null,
                publication: dataObject.dataset.publications.map(({_id, ...item}) => item)
            },
            sensitivity: dataObject.dataset.sensitivity
        },
        availableDatatypes: dataObject.availableDatatypes.map(({_id, ...item}) => ({
            ...item,
            source: findDataSource(item.name)
        }))
    });
}

const getAllDatasets = async (req, res) => {
	try {
		const datasetObjects = await DatasetObject.find();
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

const getDatasets = async (req, res) => {
    const { datatype } = req.params
	try {
		const datasetObjects = await DatasetObject.find({datasetType: datatype});
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

const getDataset = async (req, res) => {
    const { datatype, id } = req.params
	try {
		const datasetObjects = await DatasetObject.find({_id: id, datasetType: datatype});
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


/**
 * Used by PharmacoGx to update PSet download count when a user downloads a PSet from ORCESTRA through PharmacoGx
 */
 const updateDownloadCount = async (req, res) => {
    let dataTypes = Object.values(enums.dataTypes);
    const doi = req.params.doi1 + '/' + req.params.doi2;
    let result = {};
    try{
        if(dataTypes.includes(req.params.datasetType)){
            let filter = { 
                datasetType: req.params.datasetType, 
                'info.status': 'complete', 
                'info.private': false,
                'repositories.doi': doi
            };
            await DataObject.updateOne(filter, {$inc: {'info.numDownload': 1}});
            result = 'success';
        }else{
            result = `Please use the correct dataset type. It should be one of [
                ${dataTypes.join(', ')}
            ].`;
        }
    } catch(error){
        console.log(error);
        result = error;
        res.status(500);
    } finally{
        res.send(result);
    }
}

module.exports = {
    getAllDatasets,
	getDatasets,
    getDataset,
    updateDownloadCount
}