const mongo = require('../../db/mongo');

const getUserPSet = async (req, res) => {
    try{
        const db = await mongo.getDB();
        const user = db.collection('user');
        const pset = db.collection('pset');
        const data = await user.findOne({'username': req.query.username});
        const psets = await pset.find({'_id': {'$in': data.userPSets}}).toArray();
        res.send(psets);
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

const addToUserPset = async (req, res) => {
    try{
        const db = await mongo.getDB();
        const user = db.collection('user');
        const objectIDArray = req.body.psetId.map(str => mongo.ObjectID(str));
        await user.findOneAndUpdate(
            {'username': req.body.username},
            {'$addToSet': {'userPSets': {'$each': objectIDArray}}}
        );
        res.send({summary: 'PSets Saved', message: 'The selected PSets have been saved.'});
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

const removeUserPSet = async (req, res) => {
    try{
        const db = await mongo.getDB();
        const user = db.collection('user');
        let objectIDs = req.body.psetID.map(str => mongo.ObjectID(str));
        await user.findOneAndUpdate(
            {'username': req.body.username},
            {'$pull': {'userPSets': {'$in': objectIDs}}}
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