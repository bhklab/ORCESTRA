const mongo  = require('mongodb');
const mongoClient = mongo.MongoClient;
const connStr = 'mongodb+srv://root:root@development-cluster-ptdz3.azure.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'orcestra-dev';
const testDB = 'orcestra-test';
const ObjectID = mongo.ObjectID;

function connectWithClient(callback){
    mongoClient.connect(connStr, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
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
        queryArray.push(getQueryFilter('dataType.name', query.dtp));
    }
    
    if(query.dsv){
        queryArray.push(getQueryFilter('dataset.version', query.dsv));
    }

    if(query.dsn){
        queryArray.push(getQueryFilter('dataset.name', query.dsn));
    }

    if(query.gnm){
        queryArray.push(getQueryFilter('genome.name', query.gnm));
    }

    if(query.rnat){
        queryArray.push(getQueryFilter('rnaTool.name', query.rnat));
    }

    if(query.dnat){
        queryArray.push(getQueryFilter('dnaTool.name', query.dnat));
    }

    if(query.rnar){
        queryArray.push(getQueryFilter('rnaRef.name', query.rnar));
    }

    if(query.dnar){
        queryArray.push(getQueryFilter('dnaRef.name', query.dnar));
    }

    if(query.dst){
        queryArray.push(getQueryFilter('drugSensitivity.version', query.dst));
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

function getResult(err, data){
    if(err){
        return({status: 0, data: err});
    }
    return({status: 1, data: data});
}

module.exports = {

    getObjectID: function(){
        return(new ObjectID());
    },
    
    selectPSetByDOI: function(doi, callback){
        connectWithClient((err, client) => {
            if(err){
                callback({status: 0, data: err});
            }
            const db = client.db(dbName);
            const pset = db.collection('pset');
            pset.findOne({'doi': doi, 'status' : 'complete'}, (err, data) => {
                client.close();
                callback(getResult(err, data));
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
                client.close();
                callback(getResult(err, data));
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
                client.close();
                callback(getResult(err, data));
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
            const objectIDArray = psetIDs.map(str => ObjectID(str));
            collection.updateMany({'_id': {'$in': objectIDArray}}, {'$inc': {'download': 1}}, (err, result) => {
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

    updatePSetStatus: function(update, callback){
        connectWithClient((err, client) => {
            if(err){
                callback({status: 0, data: err});
            }
            //const db = client.db(dbName);
            const db = client.db(testDB);
            const collection = db.collection('pset');
            collection.findOneAndUpdate(
                {'_id': ObjectID(update.id)}, 
                {'$set': {'status': 'complete', 'doi': update.doi, 'dateCreated': new Date(Date.now())}}, 
                {returnOriginal: false, upsert: false}, 
                (err, data) => {
                    client.close();
                    callback(getResult(err, data));
                }
            );         
        });
    },

    insertPSetRequest: function(pset, username, callback){
        connectWithClient((err, client) => {
            if(err){
                callback({status: 0, data: err});
            }
            //const db = client.db(dbName);
            const db = client.db(testDB);
            const collection = db.collection('pset');
            collection.insertOne(pset, (err, result) => {
                if(err){
                    client.close();
                    callback({status: 0, data: err});
                }else{
                    callback({status: 1, data: result});
                }
                // const user = db.collection('user');
                // user.findOneAndUpdate(
                //     {'username': username},
                //     {'$addToSet': {'userPSets': pset._id}},
                //     {'upsert': true},
                //     (err, data) => {
                //         client.close();
                //         callback(getResult(err, data));
                //     }
                // );
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
                client.close();
                callback(getResult(err, data));
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
                    callback(getResult(err, data));
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
                    callback(getResult(err, data));
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
                    client.close();
                    callback(getResult(err, data));
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
            const objectIDArray = userPSet.psetId.map(str => ObjectID(str));
            collection.findOneAndUpdate(
                {'username': userPSet.username},
                {'$addToSet': {'userPSets': {'$each': objectIDArray}}},
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
                client.close();
                callback(getResult(err, data));
            });
        });
    },

    selectFormData: function(callback){
        connectWithClient((err, client) => {
            if(err){
                callback({status: 0, data: err});
            }
            const db = client.db(dbName);
            const collection = db.collection('formdata');
            collection.find().toArray((err, data) => {
                client.close();
                callback(getResult(err, data));
            });
        });
    },

    // For development use only
    insertCompleteRequest: function(data, callback){
        connectWithClient((err, client) => {
            if(err){
                callback({status: 0, data: err});
            }
            const db = client.db(testDB);
            const collection = db.collection('complete-requests');
            collection.insertOne(data, (err, result) => {
                client.close();
                if(err){
                    callback({status: 0, data: err});
                }else{
                    callback({status: 1, data: result});
                }
            })
        })
    }
}
