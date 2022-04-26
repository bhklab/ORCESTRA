const mongo  = require('mongodb');
const mongoClient = mongo.MongoClient;
const path = require('path');
const fs = require('fs');

/**
 * Obtains data from database of origin.
 * Inserts them into destination database.
 * @param {string} connStrOrigin connection string for the db of origin
 * @param {string} dbNameOrigin name of the database of origin.
 * @param {string} connStrDest connection string for the destination db.
 * @param {string} dbNameDest name of the destination database.
 * @param {array} collectionNames Names of collections to be inserted.
 */
const insertBackup = async (connStrOrigin, dbNameOrigin, connStrDest, dbNameDest, collectionNames) => {
    console.log('insertBackup')
    let client = {}
    let backupData = {}
    try{
        client = await mongoClient.connect(connStrOrigin, {useNewUrlParser: true, useUnifiedTopology: true})
        let db = client.db(dbNameOrigin)
        for(let i = 0; i < collectionNames.length; i++){
            let collection = db.collection(collectionNames[i])
            let data = await collection.find({}).toArray()
            backupData[collectionNames[i]] = data
        }
        client.close()
        console.log('read collections')

        client = await mongoClient.connect(connStrDest, {useNewUrlParser: true, useUnifiedTopology: true})
        db = client.db(dbNameDest)
        for(let i = 0; i < collectionNames.length; i++){
            let data = backupData[collectionNames[i]]
            let collection = db.collection(collectionNames[i])
            collection.deleteMany({})
            if(data.length > 1){
                //insertMany
                await collection.insertMany(data)
            }else{
                //insertOne
                await collection.insertOne(data[0])
            }
            console.log(collectionNames[i] + ': inseretd')
        }

        client.close()
        console.log('done')
    }catch(err){
        console.log(err)
        client.close()
    }
}

module.exports = {
    insertBackup
}