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
    
    if(query.dsv){
        queryArray.push(getQueryFilter('datasetVersion', query.dsv));
    }

    if(query.dsn){
        queryArray.push(getQueryFilter('datasetName', query.dsn));
    }

    if(query.exot){
        queryArray.push(getQueryFilter('exomeTool', query.exot));
    }

    if(query.rnar){
        queryArray.push(getQueryFilter('rnaRef', query.rnar));
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
    }

}