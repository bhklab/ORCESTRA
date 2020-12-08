const mongo  = require('mongodb');
const mongoClient = mongo.MongoClient;


const buildInsertXevaSetObjects = async function(connStr, dbName){

    const client = await mongoClient.connect(connStr, {useNewUrlParser: true, useUnifiedTopology: true})
    const db = client.db(dbName)
    const form = db.collection('formdata')
    const formresult = await form.find({'datasetType': 'xevaset'}).toArray();
    const formdata = formresult[0]
    
    let xevasets = [
        {
            status: 'complete',
            name: 'PDXE',
            download: 0,
            doi: '10.5281/zenodo.4302463',
            commitID: '701326a68abe4a27a3e9a10597a6fda7',
            downloadLink: 'https://zenodo.org/record/4302463/files/Xeva_PDXE.rds?download=1',
            dataType: [
                {
                    label: 'RNA Sequence',
                    name: 'rnaseq',
                    type: 'RNA'
                },
                {
                    label: 'Microarray',
                    name: 'microarray',
                    type: 'RNA'
                },
                {
                    label: 'CNV',
                    name: 'cnv',
                    type: 'DNA'
                },
                {
                    label: 'Mutation',
                    name: 'mutation',
                    type: 'DNA'
                },
                {
                    label: 'Drug Response',
                    name: 'drugResponse'
                }
            ],
            dataset: {},
            createdBy: 'BHK Lab',
            dateCreated: new Date(Date.now()),
            canonical: true
        }
    ];

    xevasets.forEach(set => {
        let dataset = formdata.dataset.find(d => (d.name === set.name));
        set.dataset.name = dataset.name;
        set.dataset.label = dataset.label;
        set.dataset.versionInfo = dataset.versions[0].version;
    });

    xevasets.sort((a, b) => {
        return(a.name.toLowerCase() > b.name.toLowerCase() ? 1: -1)
    })

    console.log(xevasets)

    const collection = db.collection('xevaset');
    await collection.deleteMany({})
    await collection.insertMany(xevasets)
    
    client.close();
}

module.exports = {
    buildInsertXevaSetObjects
}