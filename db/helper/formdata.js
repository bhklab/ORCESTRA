const mongo = require('../mongo');

module.exports = {
    getFormData: async function(){
        try{
            const db = await mongo.getDB();
            const collection = db.collection('formdata');
            const form = await collection.find().toArray();
            return form[0]
        }catch(err){
            console.log(err)
            throw err
        }
    }
}