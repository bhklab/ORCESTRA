const path = require('path');
const fs = require('fs');
require('dotenv').config({path: path.join(__dirname, '../.env')});

const mongo  = require('mongodb');
const mongoClient = mongo.MongoClient;
const csv = require('csvtojson');

const run = async () => {
    let client;
    try{
        client = await mongoClient.connect(process.env.CONNECTION_STR, {useNewUrlParser: true, useUnifiedTopology: true});
        const db = await client.db(process.env.DB);
        console.log('connection open');
        const collection = db.collection('clinicalgenomics');

        let dataset = await collection.findOne({name: "TCGA_2.0.1"});
        dataset.downloadLink.forEach(link => {
            link.label = `${link.label} (${link.name})`;
        });
        await collection.updateOne({_id: dataset._id}, {$set: dataset}, {upsert: true});
    }catch(e){
        console.log(e);
    }finally{
        client.close();
        console.log('done');
    }
}

run();