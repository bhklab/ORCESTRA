const mongo = require('../mongo');
const formdata = require('./formdata');

const insertPSetRequest = async (pset, username, config) => {
    try{
        const db = await mongo.getDB();
        const psets = db.collection('pset');
        const user = db.collection('user');
        const reqConfig = db.collection('req-config');
        config._id = pset._id;
        await reqConfig.insertOne(config);
        await psets.insertOne(pset);
        await user.findOneAndUpdate(
            {'username': username},
            {'$addToSet': {'userDatasets': pset._id}},
            {'upsert': true}
        );
    }catch(err){
        console.log(err);
        throw err;
    }
}

const getRequestConfig = async (id) => {
    const db = await mongo.getDB();
    const res = {status: 0, error: null, data: {}};
    try{
        const collection = db.collection('req-config');
        res.data = await collection.findOne({'_id': mongo.ObjectID(id)});
        res.status = 1;
    }catch(err){
        res.error = err;
    }finally{
        return(res);
    }
}

const getMasterConfig = async (datasetType, dataset) => {
    const db = await mongo.getDB();
    try{
        const form = await formdata.getFormData(datasetType)
        const versions = form.dataset.find(data => {return data.name === dataset.name}).versions
        const versionInfo = versions.find(version => {return version.version === dataset.versionInfo})
        const collection = db.collection('req-config-master')
        const data = await collection.findOne({'pipeline.name': versionInfo.pipeline}, {'projection': {'_id': false}})
        return data
    }catch(err){
        console.log(err)
        throw err
    }
}

module.exports = {
    insertPSetRequest,
    getRequestConfig,
    getMasterConfig
}