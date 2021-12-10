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
        const collection = db.collection('dataset-notes');
        let data = fs.readFileSync('./data/new/new-dataset-notes.json');
        data = JSON.parse(data);

        await collection.insertOne(data);
    }catch(e){
        console.log(e);
    }finally{
        client.close();
        console.log('done');
    }
}

run();