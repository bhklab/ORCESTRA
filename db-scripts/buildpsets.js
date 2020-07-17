const csv = require('csvtojson')
const mongo  = require('mongodb');
const mongoClient = mongo.MongoClient;

/**
 * Reads a csv file that contains PSet information, and builds PSet objects using formdata.
 * Inserts all the PSets into pset collection of MongoDB database.
 * @param {string} filePath path to the csv file.
 */
const buildInsertPSetObjects = async function(connStr, dbName, filePath){
    const csvjson = await csv().fromFile(filePath)
    console.log('read the csv file')

    const client = await mongoClient.connect(connStr, {useNewUrlParser: true, useUnifiedTopology: true})
    const db = client.db(dbName)
    const form = db.collection('formdata')
    const formresult = await form.find().toArray()
    const formdata = formresult[0]
    
    let psets = []
    for(let i = 0; i < csvjson.length; i++){
        let pset = {}
        pset._id = mongo.ObjectId(),
        pset.status = 'complete',
        pset.name = csvjson[i]['Dataset'] + '_' + csvjson[i]['Drug Sensitivity']
        pset.download = 0;
        pset.doi = csvjson[i]['DOI']
        pset.commitID = csvjson[i]['Pachyderm Commit ID']
        pset.downloadLink = csvjson[i]['Download']

        const formdataset = formdata.dataset.find(data => {
            return data.name === csvjson[i]['Dataset']
        })

        pset.dataType = [{name: 'rnaseq', label: 'RNA Sequence'}];

        pset.dataset = {
            label:csvjson[i]['Dataset'], 
            name:csvjson[i]['Dataset'], 
            versionInfo: formdataset.versions.find(version => {return version.version === csvjson[i]['Drug Sensitivity']}).version
        }

        const genome = formdata.genome.find(g => {return g.name === csvjson[i]['Genome']})
        pset.genome = typeof genome === 'undefined' ? {} : genome
        pset.createdBy = 'BHK Lab';
        pset.dateCreated = new Date(Date.now());
        const tool = formdata.rnaTool.find(tool => {return tool.label === csvjson[i]['RNA-tool']}) 
        pset.rnaTool = typeof tool === 'undefined' ? [] : [{name: tool.name, label: tool.label}]
        const ref = formdata.rnaRef.find(ref => {return ref.name === csvjson[i]['Transcriptome']})
        pset.rnaRef = typeof ref === 'undefined' ? [] : [{name: ref.name, label: ref.label}]
        pset.dnaTool = [];
        pset.dnaRef = [];

        psets.push(pset)
    }

    psets.sort((a, b) => {
        return(a.name.toLowerCase() > b.name.toLowerCase() ? 1: -1)
    })

    console.log(psets)

    const pset_collection = db.collection('pset')
    await pset_collection.deleteMany({})
    await pset_collection.insertMany(psets)
    
    client.close()
    console.log('done')
}

const updatePSets = async function(connStr, dbName){
    const client = await mongoClient.connect(connStr, {useNewUrlParser: true, useUnifiedTopology: true})
    try{
        const db = client.db(dbName)
        
        const form = await db.collection('formdata').find().toArray()
        const psets = await db.collection('pset').find().toArray()
        
        const accRNA = form[0].accompanyRNA
        const accDNA = form[0].accompanyDNA
        const molecular = form[0].molecularData

        for(let i = 0; i < psets.length; i++){
            let molData = [];

            if(psets[i].rnaTool.length && psets[i].rnaRef.length){
                molData.push(molecular.find(mol => {return mol.name === 'rnaseq'}))
            }
            
            let rna = accRNA.filter(r => {
                return r.dataset === psets[i].dataset.name
            })
            if(rna.length){
                molecular.forEach(mol => {
                    if(rna.find(r => {return r.name === mol.name})){
                        molData.push(mol)
                    }
                })
            }
            
            let dna = accDNA.filter(d => {
                return d.dataset === psets[i].dataset.name
            })
            if(dna.length){
                molecular.forEach(mol => {
                    if(dna.find(d => {return d.name === mol.name})){
                        molData.push(mol)
                    }
                })
            }

            psets[i].dataType = molData;
            delete psets[i].accompanyDNA;
            delete psets[i].accompanyRNA;
            
            await db.collection('pset').updateOne(
                {'_id': psets[i]._id}, 
                {'$set': psets[i], '$unset': {'accompanyRNA': "", 'accompanyDNA': ""}}, 
                {upsert: true}
            )
        }

        client.close()
        console.log('done')
    }catch(error){
        console.log(error)
        client.close()
    }
}

module.exports = {
    buildInsertPSetObjects,
    updatePSets
}