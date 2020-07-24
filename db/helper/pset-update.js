const mongo = require('../mongo');

module.exports = {
    updatePSetStatus: async function(id, update){
        const db = await mongo.getDB();
        const res = {status: 0, error: null, data: {}};
        try{
            const collection = db.collection('pset');
            res.data = await collection.findOneAndUpdate(
                { '_id': mongo.ObjectID(id) }, 
                { '$set': update} , 
                {returnOriginal: false, upsert: false}
            );
            res.status = 1
            return(res);
        }catch(err){
            console.log(err)
            throw err
        }         
    },
    
    updateDownloadCount: async function(doi){
        const db = await mongo.getDB();
        try{
            const collection = db.collection('pset');
            await collection.updateOne({'doi': doi}, {'$inc': {'download': 1}});
        }catch(error){
            console.log(error);
            throw error;
        }
    },

    updateCanonicalStatus : async function(canonicals){
        const db = await mongo.getDB();
        try{
            const ids = canonicals.map(c => {return(mongo.ObjectID(c))});
            const psets = db.collection('pset');
            await psets.updateMany({'_id': {'$in': ids}}, {'$set': {'canonical': true}}, {'upsert': true});
            await psets.updateMany({'_id': {'$nin': ids}}, {'$set': {'canonical': false}}, {'upsert': true});
        }catch(error){
            console.log(error)
            throw error
        }
    },
}