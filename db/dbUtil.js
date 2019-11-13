let mongo = require('mongodb').MongoClient;
let connStr = 'mongodb+srv://root:root@development-cluster-ptdz3.azure.mongodb.net/test?retryWrites=true&w=majority'

function connectWithClient(callback){
    mongo.connect(connStr, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
        callback(err, client);
    });
}

function getQueryFilterSet(query){
    var querySet = {};
    var queryArray = [];
    if(!query){
        return(querySet);
    } 

    if(query.dtp){
        queryArray.push(getQueryFilter('datatype', query.dtp));
    }
    
    if(query.dsv){
        queryArray.push(getQueryFilter('datasetVersion', query.dsv));
    }

    if(query.dsn){
        queryArray.push(getQueryFilter('datasetName', query.dsn));
    }

    if(query.gnm){
        queryArray.push(getQueryFilter('genome', query.gnm));
    }

    if(query.rnat){
        queryArray.push(getQueryFilter('rnaTool', query.rnat));
    }

    if(query.exot){
        queryArray.push(getQueryFilter('exomeTool', query.exot));
    }

    if(query.rnar){
        queryArray.push(getQueryFilter('rnaRef', query.rnar));
    }

    if(query.exor){
        queryArray.push(getQueryFilter('exomeRef', query.exor));
    }

    if(query.dst){
        queryArray.push(getQueryFilter('drugSensitivity', query.dst));
    }

    if(queryArray.length){
        querySet = {$and: queryArray};
    }
    return(querySet);
}

function getQueryFilter(keyName, filterValue){
    var filterObj = {};
    if(!Array.isArray(filterValue)){
        filterObj[keyName] = filterValue;
        return(filterObj);
    }
    filterObj[keyName] = {$in: filterValue};
    return(filterObj);
}

function setId(db, collectionName, callback){
    const collection = db.collection('counters');
    collection.findOneAndUpdate(
        { '_id': collectionName },
        { '$inc': {'count': 1} },
        { upsert: true, returnOriginal: false }, 
        (err, result) => {
            if(err){
                callback(err, result);
            }
            callback(err, result.value);
    });
}


module.exports = {
    
    selectPSets: function(query, callback){       
        connectWithClient((err, client) => {
            if(err){
                callback({status: 'error', data: err});
            }
            const db = client.db('orcestra-dev');
            const collection = db.collection('pset');
            var queryFilterSet = getQueryFilterSet(query); 
            console.log(queryFilterSet);
            collection.find(queryFilterSet).toArray((err, data) => {
                if(err){
                    client.close();
                    callback({status: 'error', data: err});
                }
                client.close();
                callback({status: 'success', data: data});
            });
        });   
    },

    insertPSetRequest: function(pset, callback){
        connectWithClient((err, client) => {
            if(err){
                callback({status: 'error', data: err});
            }
            const db = client.db('orcestra-dev');
            setId(db, 'pset', (error, counter) => {
                if(error){
                    callback({status: 'error', data: error});
                }
                pset._id = counter.count;
                const collection = db.collection('pset');
                collection.insertOne(pset, (err, result) => {
                    if(err){
                        client.close();
                        callback({status: 'error', data: err});
                    }
                    client.close();
                    callback({status: 'success', data: {message: 'success'}});
                });      
            });   
        });
    }

}