const path = require('path');
const fs = require('fs');
require('dotenv').config({path: path.join(__dirname, '../.env')});

const mongo  = require('mongodb');
const mongoClient = mongo.MongoClient;
const csv = require('csvtojson');

const insertNewDatasets = async () => {
    let client;
    try{
        client = await mongoClient.connect(process.env.CONNECTION_STR_Dev, {useNewUrlParser: true, useUnifiedTopology: true});
        const db = await client.db(process.env.DB);
        console.log('connection open');
        let collection = db.collection('formdata');
        let psetform = await collection.findOne({datasetType: "pset"});
        let newformdata = fs.readFileSync("./data/new/new-formdata.json");
        newformdata = JSON.parse(newformdata);
        psetform.dataset = psetform.dataset.concat(newformdata.dataset);
        psetform.accompanyRNA = psetform.accompanyRNA.concat(newformdata.accompanyRNA);
        psetform.accompanyDNA = psetform.accompanyDNA.concat(newformdata.accompanyDNA);
        psetform.molecularData = psetform.molecularData.concat(newformdata.molecularData);

        await collection.updateOne(
            {datasetType: "pset"}, 
            {$set: {
                dataset: psetform.dataset, 
                accompanyRNA: psetform.accompanyRNA,
                accompanyDNA: psetform.accompanyDNA,
                molecularData: psetform.molecularData
            }},
            {upsert: true}
        );

        collection = db.collection('pset');
        let newdatasets = fs.readFileSync("./data/new/new-dataset.json");
        newdatasets = JSON.parse(newdatasets);
        await collection.insertMany(newdatasets);

        collection = db.collection('dataset-notes');
        let newnotes = fs.readFileSync("./data/new/new-dataset-notes.json");
        newnotes = JSON.parse(newnotes);
        await collection.insertMany(newnotes);

        collection = db.collection('metric-data');
        let newmetricdata = fs.readFileSync("./data/new/new-metricdata.json");
        newmetricdata = JSON.parse(newmetricdata);
        await collection.insertMany(newmetricdata);

    }catch(e){
        console.log(e);
    }finally{
        client.close();
        console.log('done');
    }
}

const run = async () => {
    let client;
    try{
        client = await mongoClient.connect(process.env.CONNECTION_STR_Dev, {useNewUrlParser: true, useUnifiedTopology: true});
        const db = await client.db(process.env.DB);
        console.log('connection open');
        // const col = db.collection('formdata');
        // let existingform = await col.findOne({datasetType: "clinicalgenomics"});
        // let newformdata = fs.readFileSync("./data/new/new-formdata.json");
        // newformdata = JSON.parse(newformdata);
        // existingform.dataset.push(newformdata);

        // await col.updateOne(
        //     {datasetType: "clinicalgenomics"}, 
        //     {$set: {
        //         dataset: existingform.dataset,
        //     }},
        //     {upsert: true}
        // );

        // const collection = db.collection('clinicalgenomics');
        // let newdatasets = fs.readFileSync("./data/new/new-dataset.json");
        // newdatasets = JSON.parse(newdatasets);
        // await collection.insertOne(newdatasets);

        // const collection = db.collection('dataset-notes');
        // let newnotes = fs.readFileSync("./data/new/new-dataset-notes.json");
        // newnotes = JSON.parse(newnotes);
        // await collection.insertOne(newnotes);

        const collection = db.collection('metric-data');
        let newmetricdata = fs.readFileSync("./data/new/new-metricdata.json");
        newmetricdata = JSON.parse(newmetricdata);
        await collection.insertOne(newmetricdata);

    }catch(e){
        console.log(e);
    }finally{
        client.close();
        console.log('done');
    }
}

run();