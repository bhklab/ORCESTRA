const mongo = require('../mongo');

module.exports = {
    selectUserPSets: async function(username, callback){
        const db = await mongo.getDB();
        try{
            const user = db.collection('user')
            const pset = db.collection('pset')
            const data = await user.findOne({'username': username})
            const psets = await pset.find({'_id': {'$in': data.userPSets}}).toArray()
            return psets
        }catch(err){
            console.log(err)
            throw err
        } 
    },

    addToUserPset: async function(userPSet, callback){
        const db = await mongo.getDB();
        try{
            const user = db.collection('user')
            const objectIDArray = userPSet.psetId.map(str => ObjectID(str))
            await user.findOneAndUpdate(
                {'username': userPSet.username},
                {'$addToSet': {'userPSets': {'$each': objectIDArray}}})
        }catch(err){
            console.log(err)
            throw err
        }
    },

    removeUserPSets: async function(username, userPSets, callback){
        const db = await mongo.getDB();
        try{
            const user = db.collection('user')
            await user.findOneAndUpdate(
                {'username': username},
                {'$pull': {'userPSets': {'$in': userPSets}}})
        }catch(err){
            console.log(err)
            throw err
        }
    },
}