const mongo = require('../../db/mongo');
const dataSubmission = require('../../db/helper/data-submission');
const mailer = require('../../mailer/mailer');
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

const getUserDataset = async (req, res) => {
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

        const submissions = await dataSubmission.list({'info.email': req.query.username}, {'projection': {'info': true}});
        
        res.send({datasets: userDatasets, submissions: submissions});
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

const submitDataset = async (req, res) => {
    try{
        let submission = req.body;
        submission.info.email = req.decoded.username;
        submission.info.status = 'submitted';
        // insert submission data to the database
        submission.info._id = await dataSubmission.insertOne(submission);
        // send email to admin
        await mailer.sendDataSubmissionEmail(submission.info);
    }catch(err){
        console.log(err);
        res.status(500);
    }finally{
        res.send();
    }
}

const check_access = async (req, res, next) => {
    let authorized = false;
    try{
        if(req.decoded.isAdmin){
            authorized = true;
        }else{
            let query = {'_id': mongo.ObjectID(req.params.id)}
            let data = await dataSubmission.findOne(query);
            if(data.info.email === req.decoded.username){
                authorized = true;
            }
        }
    }catch(err){
        console.log(err);
        res.status(500);
    }finally{
        if(authorized){
            req.authorized = true;
            next();
        }else{
            res.send({authorized: false});
        }
    }
}

const authorize = (req, res) => {
    res.send({authorized: req.authorized});
}

const getSubmittedData = async (req, res) => {
    let data = null;
    try{
        if(req.authorized){
            let query = {'_id': mongo.ObjectID(req.params.id)}
            data = await dataSubmission.findOne(query);
        }
    }catch(err){
        console.log(err);
        res.status(500);
    }finally{
        res.send(data);
    }
}

module.exports = {
    getUserDataset,
    addToUserPset,
    removeUserPSet,
    submitDataset,
    check_access,
    authorize,
    getSubmittedData
}