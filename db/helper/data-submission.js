const mongo = require('../mongo');

const insertOne = async (data) => {
    try{
        const db = await mongo.getDB();
        const collection = db.collection('data-submission');
        let result = await collection.insertOne(data);
        return result.insertedId;
    }catch(err){
        console.log(err);
        throw err;
    }
}

const findOne = async (query, projection) => {
    try{
        const db = await mongo.getDB();
        const collection = db.collection('data-submission');
        let data = await collection.findOne(query);
        return data;
    }catch(err){
        console.log(err);
        throw err;
    }
}

const list = async (query, projection) => {
    try{
        const db = await mongo.getDB();
        const collection = db.collection('data-submission');
        let data = await collection.find(query, projection).toArray();
        return data;
    }catch(err){
        console.log(err);
        throw err;
    }
}

const updateOne = async (query, update) => {
    try{
        const db = await mongo.getDB();
        const collection = db.collection('data-submission');
        await collection.updateOne(query, {'$set': update});
    }catch(err){
        console.log(err);
        throw err;
    }
}

module.exports = {
    insertOne,
    findOne,
    list,
    updateOne
}