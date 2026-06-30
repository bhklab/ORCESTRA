/**
 * Contains functions used for publically exposed API calls.
 */
const { dataTypes } = require('../../helper/enum');
const DatasetObject = require('../../db/models/dataset-object');
const DatasetNote = require('../../db/models/dataset-note')

const getAllDatasets = async (req, res) => {
	const { info } = req.params
	try {
		if (info === "full" || info === "") {
			const datasetObjects = await DatasetObject.find({}, "-availableData -availableDatatypes -status");
			const noteIDs = datasetObjects.map(obj =>  { // Store all ids for notes needed for datasetObjects
				return obj.datasetNote
			});
			const datasetNotes = await DatasetNote.find({ _id: { $in: noteIDs } }); // Retrieve needed dataset notes
			const noteMap = new Map(datasetNotes.map(note => [note._id.toString(), note])); // create map/dictionary for needed noteIDs --> note
			datasetObjects.forEach(obj => {
				obj.datasetNote = noteMap.get(obj.datasetNote?.toString());
			});
			datasetObjects.sort((a, b) => a.name.localeCompare(b.name));
			res.send(datasetObjects)
		} 
		else if (info === "concise") {
			const datasetObjects = await DatasetObject.find({}, "name _id info description dataSources repositories.downloadLink");
			const noteIDs = datasetObjects.map(obj =>  { // Store all ids for notes needed for datasetObjects
				return obj.datasetNote
			});
			const datasetNotes = await DatasetNote.find({ _id: { $in: noteIDs } }); // Retrieve needed dataset notes
			const noteMap = new Map(datasetNotes.map(note => [note._id.toString(), note])); // create map/dictionary for needed noteIDs --> note
			datasetObjects.forEach(obj => {
				obj.datasetNote = noteMap.get(obj.datasetNote?.toString());
			});
			datasetObjects.sort((a, b) => a.name.localeCompare(b.name));
			res.send(datasetObjects)
		}
		else {
			res.status(500).send(`Missing info parameter, can be either 'full' or 'concise'.
				Example: https://orcestra.ca/api/public/datasets/all/concise`);
		}
	} catch (err){
		console.log(err);
		res.status(500);
	}
}

const getDatasets = async (req, res) => {
    const { datatype, info } = req.params
	if (Object.keys(dataTypes).includes(datatype)) {
		if (info === "full"){
			try {
				const datasetObjects = await DatasetObject.find({datasetType: dataTypes[datatype]}, '-availableData -availableDatatypes -status');
				const noteIDs = datasetObjects.map(obj =>  { // Store all ids for notes needed for datasetObjects
					return obj.datasetNote
				});
				const datasetNotes = await DatasetNote.find({ _id: { $in: noteIDs } }); // Retrieve needed dataset notes
				const noteMap = new Map(datasetNotes.map(note => [note._id.toString(), note])); // create map/dictionary for needed noteIDs --> note
				datasetObjects.forEach(obj => {
					obj.datasetNote = noteMap.get(obj.datasetNote?.toString());
				});
				datasetObjects.sort((a, b) => a.name.localeCompare(b.name));
				res.send(datasetObjects)
			} catch (err){
				console.log(err);
				res.status(500);
			}
		} 
		else if (info === "concise") {
			try {
				const datasetObjects = await DatasetObject.find({datasetType: dataTypes[datatype]}, 'name _id info description dataSources repositories');
				const outputObjects = datasetObjects.map(obj => {
					return {
						name: obj.name,
						dateCreated: obj.info.dateCreated,
						doi: obj.repositories.doi,
						main_downloads: obj.repositories.downloadLink,
						secondary_downloads: obj.repositories.csvLinks,
						data: obj.dataSources,
					}
				});
				res.send(outputObjects)
			} catch (err){
				console.log(err);
				res.status(500);
			}
		} else {
			res.status(500).send(`Missing info parameter, can be either 'full' or 'concise'.
				Example: https://orcestra.ca/api/public/datasets/pharmacogenomics/concise`);
		}
	} else {
		res.status(500).send(`Please use the correct dataset type. It should be one of 
                [${Object.keys(dataTypes).join(', ')}].
				Example: https://orcestra.ca/api/public/datasets/pharmacogenomics/concise`);
	}
}

const getDataset = async (req, res) => {
    const { id, info } = req.params
	if (info === "full" || info === "") {
		try {
			const datasetObjects = await DatasetObject.find({ _id: id}, '-availableData -availableDatatypes -status');
			const noteIDs = datasetObjects.map(obj =>  { // Store all ids for notes needed for datasetObjects
				return obj.datasetNote
			});
			const datasetNotes = await DatasetNote.find({ _id: { $in: noteIDs } }); // Retrieve needed dataset notes
			const noteMap = new Map(datasetNotes.map(note => [note._id.toString(), note])); // create map/dictionary for needed noteIDs --> note
			datasetObjects.forEach(obj => {
				obj.datasetNote = noteMap.get(obj.datasetNote?.toString());
			});
			datasetObjects.sort((a, b) => a.name.localeCompare(b.name));
			res.send(datasetObjects)
		} catch (err){
			console.log(err);
			res.status(500);
		}
	} else if (info === "concise" || info === "") {
		try {
			const datasetObjects = await DatasetObject.find({ _id: id}, 'name _id info description dataSources repositories');
			const outputObjects = datasetObjects.map(obj => {
				return {
					name: obj.name,
					dateCreated: obj.info.dateCreated,
					doi: obj.repositories.doi,
					main_downloads: obj.repositories.downloadLink,
					secondary_downloads: obj.repositories.csvLinks,
					data: obj.dataSources,
				}
			});
			res.send(outputObjects)
		} catch (err){
			console.log(err);
			res.status(500);
		}
	}
	else {
		res.status(500).send(`Missing info parameter, can be either 'full' or 'concise'.
			Example: https://orcestra.ca/api/public/dataset/61dd8f80bcf33b679faebc3d/concise`);
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