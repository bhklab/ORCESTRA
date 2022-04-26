const mongo = require('../mongo');

module.exports = {
    getFormData: async function(datasetType){
        try{
            const db = await mongo.getDB();
            const collection = db.collection('formdata');
            const form = await collection.findOne({'datasetType': datasetType});
            return form;
        }catch(err){
            console.log(err)
            throw err
        }
    }
}