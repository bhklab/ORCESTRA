const mongo = require('../mongo');
const formdata = require('./formdata');

module.exports = {
    insertPSetRequest: async function(pset, username, config){
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
                {'$addToSet': {'userPSets': pset._id}},
                {'upsert': true}
            );
        }catch(err){
            console.log(err);
            throw err;
        }
    },

    getRequestConfig: async function(id){
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
    },

    getMasterConfig: async function(dataset){
        const db = await mongo.getDB();
        try{
            const form = await formdata.getFormData()
            const versions = form.dataset.find(data => {return data.name === dataset.name}).versions
            const versionInfo = versions.find(version => {return version.version === dataset.versionInfo})
            const collection = db.collection('req-config-master')
            const data = collection.findOne({'pipeline.name': versionInfo.pipeline}, {'projection': {'_id': false}})
            return data
        }catch(err){
            console.log(err)
            throw err
        }
    }
}