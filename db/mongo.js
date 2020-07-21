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

    if(query.dataType && query.dataType.length){
        queryArray.push(getQueryFilter('dataType.name', query.dataType.map(dt => {return(dt.name)}), true));
    }
    
    if(query.dataset && query.dataset.length){
        queryArray.push(getQueryFilter('dataset.name', query.dataset.map(ds => {return(ds.name)})));
    }

    if(query.drugSensitivity && query.drugSensitivity.length){
        queryArray.push(getQueryFilter('dataset.versionInfo', query.drugSensitivity.map(dsen => {return(dsen.version)})));
    }

    if(query.genome && query.genome.length){
        queryArray.push(getQueryFilter('genome.name', query.genome.map(g => {return(g.name)})));
    }

    if(query.rnaTool && query.rnaTool.length){
        queryArray.push(getQueryFilter('rnaTool.name', query.rnaTool.map(rt => {return(rt.name)})));
    }

    if(query.rnaRef && query.rnaRef.length){
        queryArray.push(getQueryFilter('rnaRef.name', query.rnaRef.map(rref => {return(rref.name)})));
    }

    if(query.status){
        queryArray.push(getQueryFilter('status', query.status));
    }

    if(queryArray.length){
        querySet = {$and: queryArray};
    }

    return(querySet);
}

function getQueryFilter(keyName, filterValue, all=false){
    var filterObj = {};
    if(!Array.isArray(filterValue)){
        filterObj[keyName] = filterValue;
        return(filterObj);
    }
    filterObj[keyName] = all ? {$all: filterValue} : {$in: filterValue};
    return(filterObj);
}

async function buildPSetObject(pset, formdata){
    let psetObj = await JSON.parse(JSON.stringify(pset))
    const dataset = await formdata.dataset.find(data => {return data.name === pset.dataset.name})
    
    // assign versionInfo metadata
    psetObj.dataset.versionInfo = await dataset.versions.find(version => {return version.version === pset.dataset.versionInfo})
    
    // assign rnaTool commands
    for(let i = 0; i < psetObj.rnaTool.length; i++){
        psetObj.rnaTool[i].commands = await formdata.rnaTool.find(tool => {return tool.name === psetObj.rnaTool[i].name}).commands
    }

    //assign rnaRef commands
    for(let i = 0; i < psetObj.rnaRef.length; i++){
        const ref = await formdata.rnaRef.find(ref=> {return ref.name === psetObj.rnaRef[i].name})
        psetObj.rnaRef[i].genome = ref.genome
        psetObj.rnaRef[i].source = ref.source
    }
    
    psetObj.accompanyRNA = []
    psetObj.accompanyDNA = []
    let accRNA = psetObj.dataType.filter(dt => {return dt.type === 'RNA' && !dt.default})
    let accDNA = psetObj.dataType.filter(dt => {return dt.type === 'DNA' && !dt.default})

    // assign accompanying RNA and DNA metadata
    if(accRNA.length){
        accRNA.forEach(rna => {
            const data = formdata.accompanyRNA.find(acc => {return (psetObj.dataset.name === acc.dataset && rna.name === acc.name)})
            psetObj.accompanyRNA.push(data)
        })
    }
    if(accDNA.length){
        accDNA.forEach(dna => {
            const data = formdata.accompanyDNA.find(acc => {return (psetObj.dataset.name === acc.dataset && dna.name === acc.name)})
            psetObj.accompanyDNA.push(data)
        })
    }

    return psetObj
}

module.exports = {

    getObjectID: function(){
        return(new ObjectID());
    },
    
    selectPSetByDOI: async function(doi, projection=null){
        const db = await getDB();
        try{
            const form = await this.getFormData()
            const collection = db.collection('pset')
            const pset = await collection.findOne({'doi': doi, 'status' : 'complete'}, projection)
            const psetObj = await buildPSetObject(pset, form)
            const reqConfig = db.collection('req-config')
            let pipelineConfig = {}
            pipelineConfig = await reqConfig.findOne({'_id': psetObj._id})
            if(!pipelineConfig){
                const masterConfig = db.collection('req-config-master')
                pipelineConfig = await masterConfig.findOne({'pipeline.name': psetObj.dataset.versionInfo.pipeline})
            }
            psetObj.pipeline = pipelineConfig
            return psetObj
        }catch(err){
            console.log(err)
            throw err
        }
    },
    
    selectPSets: async function(query, projection=null){       
        const db = await getDB();
        try{
            const collection = db.collection('pset')
            console.log(query)
            let queryFilter = getQueryFilterSet(query);
            const data = await collection.find(queryFilter, projection).toArray()
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

    getMasterConfig: async function(dataset){
        const db = await getDB();
        try{
            const form = await this.getFormData()
            const versions = form.dataset.find(data => {return data.name === dataset.name}).versions
            const versionInfo = versions.find(version => {return version.version === dataset.versionInfo})
            const collection = db.collection('req-config-master')
            const data = collection.findOne({'pipeline.name': versionInfo.pipeline}, {'projection': {'_id': false}})
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
                {'$set': {'resetToken': user.token, 'expire': Date.now() + 1800000}}
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

    getFormData: async function(){
        try{
            const db = await getDB();
            const collection = db.collection('formdata');
            const form = await collection.find().toArray();
            return form[0]
        }catch(err){
            console.log(err)
            throw err
        }
    },

    getLandingData: async function(){
        const db = await getDB();
        const res = {status: 0, err: {}, form: {}, user: {}, pset: {}, dashboard: {}};
        try{
            const user = db.collection('user');
            const pset = db.collection('pset');

            res.form = await this.getFormData();

            res.user = await user.find({'registered': true}).count();

            const ranking = await this.getCanonicalDownloadRanking();
            res.pset = ranking.splice(0,5);

            const array = await pset.find().toArray();
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

    getCanonicalPSets: async function(query={}, projection=null){
        try{
            let canonical = []
            const form = await this.getFormData()
            const datasets = form.dataset.filter(ds => {return !ds.unavailable});
    
            let datasetVersion = []
            for(let i = 0; i < datasets.length; i++){
                let versions = datasets[i].versions.map(version => {
                    return(parseInt(version.version.substring(0, 4)))
                })
                versions.sort((a, b) => {return b - a})
                let unique = [...new Set(versions)]
                datasetVersion.push({name: datasets[i].name, versions: unique})
            }
    
            const result = await this.selectPSets({}, projection)
    
            const bhkPSets = result.filter(data => data.createdBy === 'BHK Lab')
    
            for(let i = 0; i < datasetVersion.length; i++){
                
                let datasets = bhkPSets.filter(data => data.dataset.name === datasetVersion[i].name)
                let canonicalSet = []
                let nonCanonicalSet = []
                
                for(let j = 0; j < datasets.length; j++){
                    if(datasets[j].canonical){ 
                        canonicalSet.push(datasets[j])
                    }else{
                        nonCanonicalSet.push(datasets[j])
                    }
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
    },

    updateCanonicalPSets : async function(canonicals){
        const db = await getDB();
        try{
            const ids = canonicals.map(c => {return(ObjectID(c))});
            const psets = db.collection('pset')
            await psets.updateMany({'_id': {'$in': ids}}, {'$set': {'canonical': true}}, {'upsert': true})
            await psets.updateMany({'_id': {'$nin': ids}}, {'$set': {'canonical': false}}, {'upsert': true})
            const result = await this.selectPSets({status: 'complete'})
            return result
        }catch(error){
            console.log(error)
            throw error
        }
    },

    getCanonicalDownloadRanking: async function(){
        try{
            const canDataset = await this.getCanonicalPSets()
            let psets = []
            for(let i = 0; i < canDataset.length; i++){
                if(canDataset[i].dataset === 'GDSC'){
                    for(let j = 0; j < canDataset[i].canonicals.length; j++){
                        let canDownload = canDataset[i].canonicals[j].download
                        let version = canDataset[i].canonicals[j].dataset.versionInfo.match(/\((.*?)\)/)
                        let v = version[1].split('-')[0] 
                        for(let k = 0; k < canDataset[i].nonCanonicals.length; k++){
                            let nonCanVersion = canDataset[i].nonCanonicals[k].dataset.versionInfo.match(/\((.*?)\)/)
                            if(nonCanVersion[1].split('-')[0] === v){
                                canDownload += canDataset[i].nonCanonicals[k].download
                            }
                        }
                        canDataset[i].canonicals[j].download = canDownload
                        psets.push({
                            download: canDataset[i].canonicals[j].download,
                            name: canDataset[i].canonicals[j].name,
                            doi: canDataset[i].canonicals[j].doi,
                            dataset: canDataset[i].canonicals[j].dataset.name,
                            version: canDataset[i].canonicals[j].dataset.versionInfo
                        })
                    }
                }else{
                    if(canDataset[i].canonicals.length){
                        let canDownload = canDataset[i].canonicals[0].download

                        for(let j = 0; j < canDataset[i].nonCanonicals.length; j++){
                            canDownload += canDataset[i].nonCanonicals[j].download
                        }
                        canDataset[i].canonicals[0].download = canDownload
                        psets.push({
                            download: canDataset[i].canonicals[0].download,
                            name: canDataset[i].canonicals[0].name,
                            doi: canDataset[i].canonicals[0].doi,
                            dataset: canDataset[i].canonicals[0].dataset.name,
                            version: canDataset[i].canonicals[0].dataset.versionInfo
                        })
                    }
                }
            }
            psets.sort((a, b) => (a.download < b.download) ? 1 : -1)
            return psets
        }catch(error){
            console.log(error)
            throw error
        }
        
    },

    updateDownloadCount: async function(doi){
        console.log(doi);
        const db = await getDB();
        try{
            const collection = db.collection('pset');
            await collection.updateOne({'doi': doi}, {'$inc': {'download': 1}});
        }catch(error){
            console.log(error);
            throw error;
        }
    }
}