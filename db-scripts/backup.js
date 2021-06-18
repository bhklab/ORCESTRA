/**
 * Script used to back up current instance of database data.
 * Extracts everything in the database and stores data in json files in the 'data' folder.
 */

const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../.env')});
const fs = require('fs');
const mongo  = require('mongodb');
const mongoClient = mongo.MongoClient;

const backup = async (db, collectionName, outputPath) => {
    const collection = db.collection(collectionName);
    const data = await collection.find({}).toArray();
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
};

(async () => {
    client = null;
    try{
        client = await mongoClient.connect(process.env.CONNECTION_STR, {useNewUrlParser: true, useUnifiedTopology: true});
        const db = await client.db(process.env.DB);
        console.log('connection open');

        // // backup formdata
        await backup(db, 'formdata', './data/formdata.json');

        // // backup metric-data
        await backup(db, 'metric-data', './data/metric-data.json');

        // backup metric-data
        // await backup(db, 'dataset-notes', './data/dataset-notes.json');

        // // backup req.-config
        // await backup(db, 'req.-config', './data/req.config.json');

        // // backup req-config-master
        // await backup(db, 'req-config-master', './data/req-config-master.json');

        // // backup clinicalgenomics
        // await backup(db, 'clinicalgenomics', './data/clinicalgenomics.json');

        // // backup pset
        await backup(db, 'pset', './data/pset.json');

        // // backup radioset
        // await backup(db, 'radioset', './data/radioset.json');

        // // backup toxicoset
        // await backup(db, 'toxicoset', './data/toxicoset.json');

        // // backup xevaset
        // await backup(db, 'xevaset', './data/xevaset.json');

        // // backup user
        // await backup(db, 'user', './data/user.json');

    }catch(err){
        console.log(err);
    }finally{
        client.close();
        console.log('connection closed');
    }
})();