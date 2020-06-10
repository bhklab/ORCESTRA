const mongo  = require('mongodb');
const mongoClient = mongo.MongoClient;
const ObjectID = mongo.ObjectID;

let db = null

const getDB = async() => {
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

function getQueryFilterSet(query){
    let querySet = {}
    let queryArray = [];
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
        queryArray.push(getQueryFilter('dataset.versionInfo.version', query.dst));
    }

    if(query.status){
        queryArray.push(getQueryFilter('status', query.status));
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

    getObjectID: function(){
        return(new ObjectID());
    },
    
    selectPSetByDOI: async function(doi, projection=null){
        const db = await getDB();
        try{
            const collection = db.collection('pset')
            const data = await collection.findOne({'doi': doi, 'status' : 'complete'}, projection)
            return data
        }catch(err){
            console.log(err)
            throw err
        }
    },
    
    selectPSets: async function(query, projection=null){       
        const db = await getDB();
        try{
            const collection = db.collection('pset')
            let queryFilter = getQueryFilterSet(query);
            const data = await collection.find(queryFilter, projection).toArray()
            return data
        }catch(err){
            console.log(err)
            throw err
        } 
    },

    selectSortedPSets: async function(projection=null){
        const db = await getDB();
        try{
            const collection = db.collection('pset')
            const data = await collection.find({}, projection).sort({'download': -1}).toArray()
            return data
        }catch(err){
            console.log(err)
            throw err
        } 
    },

    updateDownloadNumber: async function(psetID){
        console.log(psetID)
        const db = await getDB();
        try{
            const collection = db.collection('pset');
            await collection.updateOne({'_id': ObjectID(psetID)}, {'$inc': {'download': 1}})
        }catch(error){
            console.log(error)
            throw error
        }
    },

    updatePSetStatus: async function(id, update){
        const db = await getDB();
        const res = {status: 0, error: null, data: {}};
        try{
            const collection = db.collection('pset');
            res.data = await collection.findOneAndUpdate(
                { '_id': ObjectID(id) }, 
                { '$set': update} , 
                {returnOriginal: false, upsert: false}
            );
            res.status = 1
            return(res);
        }catch(err){
            console.log(err)
            throw err
        }         
    },

    insertPSetRequest: async function(pset, username, config){
        const db = await getDB();
        const res = {status: 0, error: null, result: {}};
        if(db){   
            try{
                const psets = db.collection('pset');
                const user = db.collection('user');
                const reqConfig = db.collection('req-config');
                config._id = pset._id;
                res.result.config = await reqConfig.insertOne(config);
                res.result.pset = await psets.insertOne(pset);
                res.result.user = await user.findOneAndUpdate(
                    {'username': username},
                    {'$addToSet': {'userPSets': pset._id}},
                    {'upsert': true}
                );
                res.status = 1;
            }catch(err){
                res.error = err;
                res.status = 0;
            }finally{
                return(res);
            }
        }else{
            res.error = true;
            res.result = 'DB Unavailable';
            return(res);
        }
    },

    getRequestConfig: async function(id){
        const db = await getDB();
        const res = {status: 0, error: null, data: {}};
        try{
            const collection = db.collection('req-config');
            res.data = await collection.findOne({'_id': ObjectID(id)});
            res.status = 1;
        }catch(err){
            res.error = err;
        }finally{
            return(res);
        }
    },

    getMasterConfig: async function(pipeline){
        const db = await getDB();
        try{
            const collection = db.collection('req-config-master')
            const data = collection.findOne({'pipeline.name': pipeline}, {'projection': {'_id': false}})
            return data
        }catch(err){
            console.log(err)
            throw err
        }
    },

    selectUser: async function(username){
        const db = await getDB();
        try{
            const collection = db.collection('user')
            const data = await collection.findOne({'username': username})
            return data
        }catch(err){
            console.log(err)
            throw err
        }
    },

    addUser: async function(user){
        const db = await getDB();
        try{
            const collection = db.collection('user')
            const data = await collection.insertOne(
                {'username': user.username, 'password': user.password, 'userPSets': [], 'registered': true}
            )
            return data
        }catch(err){
            console.log(err)
            throw err
        }
    },

    registerUser: async function(user){
        const db = await getDB();
        try{
            const collection = db.collection('user')
            const data = await collection.findOneAndUpdate(
                {'username': user.username},
                {'$set': {'password': user.password, 'registered': true}},
                {'upsert': true}
            )
            return data.value
        }catch(err){
            console.log(err)
            throw err
        }
    },

    resetPassword: async function(user){
        const db = await getDB();
        try{
            const collection = db.collection('user')
            const data = await collection.findOneAndUpdate(
                {'username': user.username},
                {'$set': {'password': user.password}}
            )
            return data.value
        }catch(err){
            console.log(err)
            throw err
        }
    },

    setResetToken: async function(user){
        const db = await getDB();
        try{
            const collection = db.collection('user')
            // 30 minutes = 1800000 millisec
            // 30sec = 30000 millisec
            const data = await collection.findOneAndUpdate(
                {'username': user.username},
                {'$set': {'resetToken': user.token, 'expire': Date.now() + 30000}}
            )
            return data.value
        }catch(err){
            console.log(err)
            throw err
        }
    },

    selectUserPSets: async function(username, callback){
        const db = await getDB();
        try{
            const user = db.collection('user')
            const pset = db.collection('pset')
            const data = await user.findOne({'username': username})
            const psets = await pset.find({'_id': {'$in': data.userPSets}}).toArray()
            return psets
        }catch(err){
            console.log(err)
            throw err
        } 
    },

    addToUserPset: async function(userPSet, callback){
        const db = await getDB();
        try{
            const user = db.collection('user')
            const objectIDArray = userPSet.psetId.map(str => ObjectID(str))
            await user.findOneAndUpdate(
                {'username': userPSet.username},
                {'$addToSet': {'userPSets': {'$each': objectIDArray}}})
        }catch(err){
            console.log(err)
            throw err
        }
    },

    removeUserPSets: async function(username, userPSets, callback){
        const db = await getDB();
        try{
            const user = db.collection('user')
            await user.findOneAndUpdate(
                {'username': username},
                {'$pull': {'userPSets': {'$in': userPSets}}})
        }catch(err){
            console.log(err)
            throw err
        }
    },

    selectFormData: async function(){
        const db = await getDB();
        const collection = db.collection('formdata');
        const res = {status: 0, data: {}};
        try{
            res.data = await collection.find().toArray();
            res.status = 1;
        }catch(err){
            res.data = err
        }finally{
            return res;
        }
    },

    getLandingData: async function(){
        const db = await getDB();
        const res = {status: 0, err: {}, form: {}, user: {}, pset: {}, dashboard: {}};
        try{
            const form = db.collection('formdata');
            const user = db.collection('user');
            const pset = db.collection('pset');
            res.form = await form.find().toArray();
            res.user = await user.find({'registered': true}).count();
            const array = await pset.find().sort({'download': -1}).toArray();
            res.pset = array.splice(0,5);
            const pending = await array.filter(pset => {
                return pset.status === 'pending'
            });
            const inProcess = await array.filter(pset => {
                return pset.status === 'in-process'
            })
            res.dashboard.pending = pending ? pending.length : 0;
            res.dashboard.inProcess = inProcess? inProcess.length: 0;
            res.status = 1;
        }catch(err){
            res.err = err
        }finally{
            return res;
        }
    },

    getMetricData: async function(metricType, datasets){
        try{
            let querySet = datasets.length ? {'name':{$in: datasets}} : {}
            let field = 'versions.' + metricType
            let projection = {'projection': {
                'name': true,
                'versions.version': true,
                [field]: true
            }}
            
            const db = await getDB();
            const metricData = db.collection('metric-data');
            const metrics = await metricData.find(querySet, projection).toArray()

            return(metrics)
        }catch(err){
            console.log(err)
            throw err
        }
    },

    getAvailableDatasetForMetrics: async function(){
        try{
            let projection = {'projection': {
                'name': true,    
                'versions.version': true
                }
            }

            const db = await getDB();
            const metricData = db.collection('metric-data');
            const metrics = await metricData.find({}, projection).toArray()
            return(metrics)
        }catch(err){
            console.log(err)
            throw err
        }
    },

    getCanonicalPSets: async function(){
        try{
            let canonical = []
            let canonicalParameters = {rnaTool: 'kallisto_0_46_1', rnaRef: 'Gencode_v33'}
            const form = await this.selectFormData()
            const datasets = form.data[0].dataset
    
            let datasetVersion = []
            for(let i = 0; i < datasets.length; i++){
                let versions = datasets[i].versions.map(version => {
                    return(parseInt(version.version.substring(0, 4)))
                })
                versions.sort((a, b) => {return b - a})
                let unique = [...new Set(versions)]
                datasetVersion.push({name: datasets[i].name, versions: unique})
            }
            console.log(datasetVersion)
    
            const result = await this.selectPSets()
    
            const bhkPSets = result.filter(data => data.createdBy === 'BHK Lab')
    
            for(let i = 0; i < datasetVersion.length; i++){
                let datasets = bhkPSets.filter(data => data.dataset.name === datasetVersion[i].name)
                let canonicalSet = []
                let nonCanonicalSet = []
                for(let j = 0; j < datasets.length; j++){
                    let version = datasets[j].dataset.versionInfo.version.substring(0, 4)
                    if(version === datasetVersion[i].versions[0].toString()){ 
                        if(datasetVersion[i].name === 'FIMM' || datasetVersion[i].name === 'CTRPv2'){
                            canonicalSet.push(datasets[j])
                        }else{
                            if(datasets[j].rnaTool[0].name === canonicalParameters.rnaTool && 
                                datasets[j].rnaRef[0].name === canonicalParameters.rnaRef){
                                    canonicalSet.push(datasets[j])
                            }else{
                                nonCanonicalSet.push(datasets[j])
                            }
                        } 
                    }else{
                        nonCanonicalSet.push(datasets[j])
                    }
                }
                if(!canonicalSet.length){
                    canonicalSet.push(nonCanonicalSet.shift())
                }
                canonical.push({
                    dataset: datasetVersion[i].name, 
                    canonicals: canonicalSet, 
                    nonCanonicals: nonCanonicalSet
                })
            }
    
            return canonical
        }catch(error){
            console.log(error)
            throw error
        }
    }
}