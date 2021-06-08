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

const findOne = async (query) => {
    try{

    }catch(err){
        console.log(err);
        throw err;
    }
}

const list = async (query) => {
    try{

    }catch(err){
        console.log(err);
        throw err;
    }
}

module.exports = {
    insertOne,
    findOne,
    list
}