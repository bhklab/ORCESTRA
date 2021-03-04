const mongo  = require('mongodb');
const mongoClient = mongo.MongoClient;

const data = require('./seed-data/form-pset');

/**
 * Inserts form data for PSet into MongoDB database.
 * @param {string} connStr connection string for the db
 * @param {string} dbName name of the database.
 */
const insertFormdata = async function(connStr, dbName){
    console.log('insertFormData')

    let client = {}
    try{
        client = await mongoClient.connect(connStr, {useNewUrlParser: true, useUnifiedTopology: true})
        const db = client.db(dbName);
        const formdata = db.collection('formdata');
        await formdata.insertOne(data.form);
        client.close();
        console.log('done')
    }catch(error){
        console.log(error)
        client.close()
    }
}

module.exports = {
    insertFormdata
}