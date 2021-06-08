const mongo  = require('mongodb');
const mongoClient = mongo.MongoClient;


const buildInsertClinicalSetObjects = async function(connStr, dbName){

    const client = await mongoClient.connect(connStr, {useNewUrlParser: true, useUnifiedTopology: true})
    const db = client.db(dbName)
    const form = db.collection('formdata')
    const formresult = await form.find({'datasetType': 'clinicalgenomics'}).toArray();
    const formdata = formresult[0]
    
    let clinicalgenomics = [
        {
            status: 'complete',
            name: 'MetaGxPancreas',
            download: 0,
            doi: '10.5281/zenodo.4312144',
            commitID: 'b6d4503bb27c407ca4833a2d151e5078',
            downloadLink: 'https://zenodo.org/record/4312144/files/metagxpancreas.rds?download=1',
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
                }
            ],
            dataset: {},
            createdBy: 'BHK Lab',
            dateCreated: new Date(Date.now()),
            canonical: true
        }
    ];

    clinicalgenomics.forEach(set => {
        let dataset = formdata.dataset.find(d => (d.name === set.name));
        set.dataset.name = dataset.name;
        set.dataset.label = dataset.label;
        set.dataset.versionInfo = dataset.versions[0].version;
    });

    clinicalgenomics.sort((a, b) => {
        return(a.name.toLowerCase() > b.name.toLowerCase() ? 1: -1)
    })

    console.log(clinicalgenomics)

    const collection = db.collection('clinicalgenomics');
    await collection.deleteMany({})
    await collection.insertMany(clinicalgenomics)
    
    client.close();
}

module.exports = {
    buildInsertClinicalSetObjects
}