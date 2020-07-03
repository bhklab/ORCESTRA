const fs = require('fs');
const path = require('path');
const mongo  = require('mongodb');
const mongoClient = mongo.MongoClient;

/**
 * Reads pachyderm config json files, and inserts them to req-config-master collection of MongoDB.
 * @param {string} connStr connection string for the db
 * @param {string} dbName name of the database.
 * @param {string} configDir directory where all the config json files are located
 */
const insertPachConfig = async function(connStr, dbName, configDir){
    console.log('insertPachConfig')
    let configs = []
    const files = fs.readdirSync(configDir)
    console.log(files)
    for(let i = 0; i < files.length; i++){
        const raw = fs.readFileSync(path.join(configDir, files[i]))
        const json = JSON.parse(raw)
        configs.push(json)
    }
    let client = {}
    try{
        client = await mongoClient.connect(connStr, {useNewUrlParser: true, useUnifiedTopology: true})
        const db = client.db(dbName)
        const reqConfig = db.collection('req-config-master');
        await reqConfig.insertMany(configs);
        client.close()
        console.log('done')
    }catch(err){
        console.log(err)
        client.close()
    }
}

const updatePachConfig = async function(connStr, dbName, update, config){
    console.log('updatePachConfig')
    try{
        client = await mongoClient.connect(connStr, {useNewUrlParser: true, useUnifiedTopology: true})
        const db = client.db(dbName)
        const reqConfig = db.collection('req-config-master');
        await reqConfig.updateMany({}, update, config);
        client.close()
        console.log('done')
    }catch(err){
        console.log(err)
        client.close()
    }
}

module.exports = {
    insertPachConfig,
    updatePachConfig
}