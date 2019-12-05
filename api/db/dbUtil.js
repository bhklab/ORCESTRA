const mongo = require('mongodb').MongoClient;
const connStr = 'mongodb+srv://root:root@development-cluster-ptdz3.azure.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'orcestra-dev';

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
        queryArray.push(getQueryFilter('dataType', query.dtp));
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

    queryArray.push({'status': 'complete'});

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
    
    selectPSetByID: function(id, callback){
        connectWithClient((err, client) => {
            if(err){
                callback({status: 0, data: err});
            }
            const db = client.db(dbName);
            const pset = db.collection('pset');
            const meta = db.collection('metadata');
            meta.find().toArray((err, data) => {
                if(err){
                    client.close();
                    callback({status: 0, data: err});
                }
                const metadata = data[0];
                pset.findOne({'_id': id}, (err, data) => {
                    if(err){
                        client.close();
                        callback({status: 0, data: err});
                    }
                    client.close();
                    callback({status: 1, data: {pset: data, metadata: metadata}});
                });
            });
        });
    },
    
    selectPSets: function(query, callback){       
        connectWithClient((err, client) => {
            if(err){
                callback({status: 0, data: err});
            }
            const db = client.db(dbName);
            const collection = db.collection('pset');
            var queryFilterSet = getQueryFilterSet(query); 
            collection.find(queryFilterSet).toArray((err, data) => {
                if(err){
                    client.close();
                    callback({status: 0, data: err});
                }
                client.close();
                callback({status: 1, data: data});
            });
        });   
    },

    selectSortedPSets: function(callback){
        connectWithClient((err, client) => {
            if(err){
                callback({status: 0, data: err});
            }
            const db = client.db(dbName);
            const collection = db.collection('pset');
            collection.find().sort({'download': -1}).toArray((err, data) => {
                if(err){
                    client.close();
                    callback({status: 0, data: err});
                }
                client.close();
                callback({status: 1, data: data});
            });
        });
    },

    updateDownloadNumber: function(psetIDs, callback){
        connectWithClient((err, client) => {
            if(err){
                callback({status: 0, data: err});
            }
            const db = client.db(dbName);
            const collection = db.collection('pset');
            collection.updateMany({'_id': {'$in': psetIDs}}, {'$inc': {'download': 1}}, (err, result) => {
                if(err){
                    client.close();
                    callback({status: 0, data: err});
                }
                client.close();
                callback({
                    status: 1, data: {
                            summary: 'PSet(s) Download',
                            message: 'The selected PSets will be downloaded.'
                    }
                });
            });         
        });
    },

    insertPSetRequest: function(pset, username, callback){
        connectWithClient((err, client) => {
            if(err){
                callback({status: 0, data: err});
            }
            const db = client.db(dbName);
            setId(db, 'pset', (error, counter) => {
                if(error){
                    callback({status: 0, data: error});
                }
                pset._id = counter.count;
                const collection = db.collection('pset');
                collection.insertOne(pset, (err, result) => {
                    if(err){
                        client.close();
                        callback({status: 0, data: err});
                    }
                    const user = db.collection('user');
                    user.findOneAndUpdate(
                        {'username': username},
                        {'$addToSet': {'userPSets': pset._id}},
                        {'upsert': true},
                        (err, result) => {
                            if(err){
                                client.close();
                                callback({status: 0, data: err});
                            }
                            client.close();
                            callback({
                                status: 1, 
                                data: {
                                    summary: 'Request Submitted',
                                    message: 'Your request has been successfully submitted'
                                }
                            });
                    });
                });      
            });   
        });
    },

    cancelPSetRequest: function(psetID, username=null, callback){
        connectWithClient((err, client) => {
            if(err){
                callback({status: 0, data: err});
            }
            const db = client.db(dbName);
            const pset = db.collection('pset');
            pset.deleteMany({'_id': {'$in': psetID}}, (err, data) => {
                if(err){
                    client.close();
                    callback({status: 0, data: err});
                }
                const user = db.collection('user');
                user.findOneAndUpdate(
                    {'username': username},
                    {'$pull': {'userPSets': {'$in': psetID}}},
                    (err, result) => {
                        if(err){
                            client.close();
                            callback({status: 0, data: err});
                        }
                        client.close();
                        callback({
                            status: 1, 
                            data: {
                                summary: 'PSet Request(s) Cancelled',
                                message: 'The selected PSet request(s) have been cancelled.'
                            }
                        });
                    }
                );
            });
        });
    },

    selectUser: function(username, callback){
        connectWithClient((err, client) => {
            if(err){
                callback({status: 0, data: err});
            }
            const db = client.db(dbName);
            const user = db.collection('user');
            user.findOne({'username': username}, (err, data) => {
                if(err){
                    client.close();
                    callback({status: 0, data: err});
                }
                client.close();
                callback({status: 1, data: data});
            });
        });
    },

    addUser: function(user, callback){
        connectWithClient((err, client) => {
            if(err){
                callback({status: 0, data: err});
            }
            const db = client.db(dbName);
            const users = db.collection('user');
            users.insertOne(
                {'username': user.username, 'password': user.password, 'userPSets': [], 'registered': true},
                (err, data) => {
                    client.close();
                    if(err){
                        callback({status: 0, data: err});
                    }
                    callback({status: 1, data: data});
                }
            );
        });
    },

    registerUser: function(user, callback){
        connectWithClient((err, client) => {
            if(err){
                callback({status: 0, data: err});
            }
            const db = client.db(dbName);
            const users = db.collection('user');
            users.findOneAndUpdate(
                {'username': user.username},
                {'$set': {'password': user.password, 'registered': true}},
                {'upsert': true},
                (err, data) => {
                    client.close();
                    if(err){
                        callback({status: 0, data: err});
                    }
                    callback({status: 1, data: data});
                }
            );
        });
    },

    selectUserPSets: function(username, callback){
        connectWithClient((err, client) => {
            if(err){
                callback({status: 0, data: err});
            }
            const db = client.db(dbName);
            const user = db.collection('user');
            user.findOne({'username': username}, (err, user) => {
                if(err){
                    client.close();
                    callback({status: 0, data: err});
                }
                const pset = db.collection('pset');
                pset.find({'_id': {'$in': user.userPSets}}).toArray((err, data) => {
                    if(err){
                        client.close();
                        callback({status: 0, data: err});
                    }
                    client.close();
                    callback({status: 1, data: data});
                });
            });
        });
    },

    addToUserPset: function(userPSet, callback){
        connectWithClient((err, client) => {
            if(err){
                callback({status: 0, data: err});
            }
            const db = client.db(dbName);
            const collection = db.collection('user');
            collection.findOneAndUpdate(
                {'username': userPSet.username},
                {'$addToSet': {'userPSets': {'$each': userPSet.psetId}}},
                (err, result) => {
                    if(err){
                        client.close();
                        callback({status: 0, data: err});
                    }
                    client.close();
                    callback({status: 1, 
                        data: {
                            summary: 'PSets Saved',
                            message: 'The selected PSets have been saved.'
                        }});
                }
            );
        });
    },

    removeUserPSets: function(username, userPSets, callback){
        connectWithClient((err, client) => {
            if(err){
                callback({status: 0, data: err});
            }
            const db = client.db(dbName);
            const collection = db.collection('user');
            collection.findOneAndUpdate(
                {'username': username},
                {'$pull': {'userPSets': {'$in': userPSets}}},
                (err, result) => {
                    if(err){
                        client.close();
                        callback({status: 0, data: err});
                    }
                    client.close();
                    callback({status: 1, 
                        data: {
                            summary: 'Updated Saved PSets',
                            message: 'The selected PSet(s) have been removed from the saved list.'
                        }});
                }
            );
        });
    },

    selectMetadata: function(callback){
        connectWithClient((err, client) => {
            if(err){
                callback({status: 0, data: err});
            }
            const db = client.db(dbName);
            const collection = db.collection('metadata');
            collection.find((err, data) => {
                if(err){
                    client.close();
                    callback({status: 0, data: err});
                }
                client.close();
                callback({status: 1, data: data});
            });
        });
    }

}
