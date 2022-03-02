const path = require('path');
const fs = require('fs');
const axios = require('axios');
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
        let collection = null;
        
        // collection = db.collection('formdata');
        // let clingenform = await collection.findOne({datasetType: "clinicalgenomics"});
        // let newformdata = fs.readFileSync("./data/new/new-formdata.json");
        // newformdata = JSON.parse(newformdata);
        // clingenform.dataset.push(newformdata);
        // await collection.updateOne(
        //     {datasetType: "clinicalgenomics"}, 
        //     {$set: {dataset: clingenform.dataset}},
        //     {upsert: true}
        // );

        // let newdataset = fs.readFileSync("./data/new/new-dataset.json");
        // newdataset = JSON.parse(newdataset);
        // let links  = await csv().fromFile('./data/new/3ca_data_list.csv');
        // links = links.map(link => ({
        //     name: link.filename.match(/3CA_(.*?)\.rds/)[1],
        //     label: link.filename.match(/3CA_(.*?)\.rds/)[1],
        //     downloadLink: link.download_link
        // }))
        // newdataset.downloadLink = links;
        // collection = db.collection('clinicalgenomics');
        // await collection.insertOne(newdataset);

        // collection = db.collection('dataset-notes');
        // let newnotes = fs.readFileSync("./data/new/new-dataset-notes.json");
        // newnotes = JSON.parse(newnotes);
        // await collection.insertOne(newnotes);

        // collection = db.collection('metric-data');
        // let newmetricdata = fs.readFileSync("./data/new/new-metricdata.json");
        // newmetricdata = JSON.parse(newmetricdata);
        // await collection.insertOne(newmetricdata);

        let res = await axios.get('https://www.orcestra.ca/api/clinicalgenomics/10.5281/zenodo.5834545');
        let data = await JSON.stringify(res.data, null, 2);
        fs.writeFileSync('./data/new/3CA.json', data);

    }catch(e){
        console.log(e);
    }finally{
        client.close();
        console.log('done');
    }
}

run();