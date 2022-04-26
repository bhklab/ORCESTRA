/**
 * Contains functions to access dataset-notes collection.
 */
const mongo = require('../mongo');

const findOne = async (name) => {
    const db = await mongo.getDB();
    try{
        const collection = db.collection('dataset-notes');
        const note = await collection.findOne({'name': name});
        return note;
    }catch(error){
        console.log(error);
        throw error;
    }
} 

module.exports = {
    findOne
}