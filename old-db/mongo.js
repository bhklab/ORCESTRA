const mongo  = require('mongodb');
const mongoClient = mongo.MongoClient;
const ObjectID = mongo.ObjectID;

let db = null

const getDB = async () => {
    if(db){
        return db;
    }
    try{
        const client = await mongoClient.connect(process.env.CONNECTION_STR, {useNewUrlParser: true, useUnifiedTopology: true});
        db = client.db(process.env.DB);
    }catch(err){
        console.log('DB Unavailable');
    }
    return db;
}

module.exports = {

    ObjectID: ObjectID,

    getDB: async function(){
        try{
            const db = await getDB();
            return db;
        }catch(err){
            console.log(err);
            throw err;
        }
    },

    getObjectID: function(){
        return(new ObjectID());
    }
    
}