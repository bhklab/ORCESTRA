const mongo = require('../../db/mongo');
const { dataTypes } = require('../../helper/enum');

function getDatasetTypeLabel(datatype){
    switch(datatype){
        case dataTypes.pharmacogenomics:
            return 'Pharmacogenomics';
        case dataTypes.toxicogenomics:
            return 'Toxicogenomics';
        case dataTypes.xenographic:
            return 'Xenographic Pharmacogenomics';
        case dataTypes.clinicalgenomics:
            return 'Clinical Genomics';
        case dataTypes.radiogenomics:
            return 'Radiogenomics';
        default:
            return '';
    }
}

const getUserPSet = async (req, res) => {
    try{
        let userDatasets = [];
        const db = await mongo.getDB();
        const userCollection = db.collection('user');
        const user = await userCollection.findOne({'username': req.query.username});

        for(let i = 0; i < Object.keys(dataTypes).length; i++){
            let datasetType = dataTypes[Object.keys(dataTypes)[i]];
            const datasetCollection = await db.collection(datasetType);
            let found = await datasetCollection.find({'_id': {'$in': user.userDatasets}}).toArray();
            found = found.map(item => ({
                ...item, 
                datasetType: {
                    name: datasetType, 
                    label: getDatasetTypeLabel(datasetType)
                }
            }));
            userDatasets = userDatasets.concat(found);
        }
        
        res.send(userDatasets);
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

const addToUserPset = async (req, res) => {
    try{
        const db = await mongo.getDB();
        const user = db.collection('user');
        const objectIDArray = req.body.datasetId.map(str => mongo.ObjectID(str));
        await user.findOneAndUpdate(
            {'username': req.body.username},
            {'$addToSet': {'userDatasets': {'$each': objectIDArray}}}
        );
        res.send({summary: 'Datasets Saved', message: 'The selected datasets have been saved.'});
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

const removeUserPSet = async (req, res) => {
    try{
        const db = await mongo.getDB();
        const user = db.collection('user');
        let objectIDs = req.body.datasetId.map(str => mongo.ObjectID(str));
        await user.findOneAndUpdate(
            {'username': req.body.username},
            {'$pull': {'userDatasets': {'$in': objectIDs}}}
        );
        res.send({});
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

module.exports = {
    getUserPSet,
    addToUserPset,
    removeUserPSet
}