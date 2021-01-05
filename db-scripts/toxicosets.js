const mongo  = require('mongodb');
const mongoClient = mongo.MongoClient;


const buildInsertToxicoSetObjects = async function(connStr, dbName){

    const client = await mongoClient.connect(connStr, {useNewUrlParser: true, useUnifiedTopology: true})
    const db = client.db(dbName)
    const form = db.collection('formdata')
    const formresult = await form.find({'datasetType': 'toxicoset'}).toArray();
    const formdata = formresult[0]
    
    let toxicosets = [
        {
            status: 'complete',
            name: 'EMEXP2458',
            download: 0,
            doi: '10.5281/zenodo.4302212',
            commitID: 'ce2f820e58144ec08e2a99a2ec33f336',
            downloadLink: 'https://zenodo.org/record/4302212/files/EMEXP2458.rds?download=1',
            dataType: [
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
        },
        {
            status: 'complete',
            name: 'DrugMatrix',
            download: 0,
            doi: '10.5281/zenodo.4302202',
            commitID: '780b1fd9afc942ab93226fbde07bd0e9',
            downloadLink: 'https://zenodo.org/record/4302202/files/drugMatrix.rds?download=1',
            dataType: [
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
        },
        {
            status: 'complete',
            name: 'TGGATE-Rat',
            download: 0,
            doi: '10.5281/zenodo.4302230',
            commitID: 'de889018574445aea2c8ab81e1bb1953',
            downloadLink: 'https://zenodo.org/record/4302230/files/TGGATES_ratldh.rds?download=1',
            dataType: [
                {
                    label: 'Microarray',
                    name: 'microarray',
                    type: 'RNA'
                },
                {
                    label: 'Drug Response',
                    name: 'drugResponse',
                    version: '2015'
                }
            ],
            dataset: {},
            createdBy: 'BHK Lab',
            dateCreated: new Date(Date.now()),
            canonical: true
        },
        {
            status: 'complete',
            name: 'TGGATE-Human',
            download: 0,
            doi: '10.5281/zenodo.4302218',
            commitID: '14ea976c3d0d48c68222bf9a7b138504',
            downloadLink: 'https://zenodo.org/record/4302218/files/TGGATES_humanldh.rds?download=1',
            dataType: [
                {
                    label: 'Microarray',
                    name: 'microarray',
                    type: 'RNA'
                },
                {
                    label: 'Drug Response',
                    name: 'drugResponse',
                    version: '2015'
                }
            ],
            dataset: {},
            createdBy: 'BHK Lab',
            dateCreated: new Date(Date.now()),
            canonical: true
        },
    ];

    toxicosets.forEach(set => {
        let dataset = formdata.dataset.find(d => (d.name === set.name));
        set.dataset.name = dataset.name;
        set.dataset.label = dataset.label;
        set.dataset.versionInfo = dataset.versions[0].version;
    });

    toxicosets.sort((a, b) => {
        return(a.name.toLowerCase() > b.name.toLowerCase() ? 1: -1)
    })

    console.log(toxicosets)

    const collection = db.collection('toxicoset')
    await collection.deleteMany({})
    await collection.insertMany(toxicosets)
    
    client.close();
}

module.exports = {
    buildInsertToxicoSetObjects
}