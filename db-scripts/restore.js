/**
 * Script used to restore database data from backup data files.
 */

const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../.env')});
const fs = require('fs');
const mongo  = require('mongodb');
const mongoClient = mongo.MongoClient;

const restore = async (db, collectionName, filepath) => {
    let data = fs.readFileSync(filepath);
    data = JSON.parse(data);
    for(item of data){
        if(item._id){
            item._id = mongo.ObjectId(item._id);
        }
        if('dateSubmitted' in item){
            item.dateSubmitted = new Date(item.dateSubmitted);
        }
        if('dateProcessed' in item){
            item.dateProcessed = new Date(item.dateProcessed);
        }
        if('dateCreated' in item){
            item.dateCreated = new Date(item.dateCreated);
        }
        if('userDatasets' in item){
            item.userDatasets = item.userDatasets.map(id => mongo.ObjectId(id));
        }
    }
    const collection = db.collection(collectionName);
    await collection.deleteMany();
    await collection.insertMany(data);
}

(async () => {
    client = null;
    try{
        client = await mongoClient.connect(process.env.CONNECTION_STR, {useNewUrlParser: true, useUnifiedTopology: true});
        const db = await client.db(process.env.DB);
        console.log('connection open');

        // // restore formdata
        // await restore(db, 'formdata', './data/formdata.json');

        // // restore metric-data
        // await restore(db, 'metric-data', './data/metric-data.json');

        // // restore dataset-notes
        // await restore(db, 'dataset-notes', './data/dataset-notes.json');

        // // restore req-config
        // await restore(db, 'req-config', './data/req-config.json');

        // // restore req-config-master
        // await restore(db, 'reg-config-master', './data/req-config-master.json');

        // restore clinicalgenomics
        await restore(db, 'clinicalgenomics', './data/clinicalgenomics.json');

        // // restore pset
        // await restore(db, 'pset', './data/pset.json');

        // // restore radioset
        // await restore(db, 'radioset', './data/radioset.json');

        // // restore toxicoset
        // await restore(db, 'toxicoset', './data/toxicoset.json');

        // // restore xevaset
        // await restore(db, 'xevaset', './data/xevaset.json');

        // // restore user
        // await restore(db, 'user', './data/user.json');

    }catch(err){
        console.log(err);
    }finally{
        client.close();
        console.log('connection closed');
    }
})();