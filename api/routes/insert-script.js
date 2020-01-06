const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const psetDir = path.join(__dirname, '../psets');
const mongo  = require('mongodb');
const mongoClient = mongo.MongoClient;
const connStr = 'mongodb+srv://root:root@development-cluster-ptdz3.azure.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'orcestra-dev';

function buildPSetObject(row){
    let pset = {};
    pset._id = mongo.ObjectId(),
    pset.status = 'complete',
    pset.name = row.PSet;
    pset.download = 0;
    pset.doi = 'doi';
    pset.datasetName = row.Dataset;
    pset.datasetVersion = row.Version;
    pset.drugSensitivity = row['Drug Sensitivity'];
    pset.dataType = ['RNA'];
    pset.genome = row.Genome;
    pset.createdBy = 'BHK Lab';
    pset.dateCreated = row['Date Generated'];
    pset.rnaTool = getArray(row['RNA Tool(s)']);
    pset.rnaRef = getArray(row['RNA Reference']);
    pset.exomeTool = getArray(row['DNA Tool(s)']);
    pset.exomeRef = getArray(row['DNA Reference']);
    return(pset);
}

function getArray(data){
    const array = [];
    if(data.length){
        array.push(data);
    }
    return(array);
}

function readFromCSV(callback){
    const data = [];
    fs.createReadStream(path.join(psetDir, 'psets.csv'))
        .pipe(csv())
        .on('data', (row) => {
            data.push(buildPSetObject(row));
        })
        .on('end', () => {
            callback(data);
        });
}

const insert = function(req, res){
    console.log("bulk insert");
    readFromCSV((data) => {
            mongoClient.connect(connStr, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
                if(err){
                    console.log(err);
                    res.send(err);
                }
                const db = client.db(dbName);
                const collection = db.collection('pset');
                collection.insertMany(data.slice(0,2), (err, result) => {
                    client.close();
                    if(err){
                        console.log(err);
                        res.send(err);
                    }
                    res.send(result);
                });
            });
            //res.send(data.slice(0, 1));
    });
}

module.exports = {
    insert
}