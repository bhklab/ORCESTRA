const mongo  = require('mongodb');
const mongoClient = mongo.MongoClient;


const buildInsertDataSetObjects = async function(connStr, dbName){

    const client = await mongoClient.connect(connStr, {useNewUrlParser: true, useUnifiedTopology: true})
    const db = client.db(dbName)
    const form = db.collection('formdata')
    const formresult = await form.find({'datasetType': 'radioset'}).toArray();
    const formdata = formresult[0]
    
    let radiosets = [
        {
            status: 'complete',
            name: 'Cleveland',
            download: 0,
            doi: '10.5281/zenodo.4313029',
            commitID: '428fed7d972447758eb1ca8dc554388b',
            downloadLink: 'https://zenodo.org/record/4313029/files/Cleveland.rds?download=1',
            dataType: [
                {
                    label: "RNA Sequence",
                    name: "rnaseq",
                    type: "RNA",
                    default: true
                }, 
                {
                    label: "Microarray",
                    name: "microarray",
                    type: "RNA"
                }, 
                {
                    label: "Copy Number Variation",
                    name: "cnv",
                    type: "DNA"
                }, 
                {
                    label: "Mutation",
                    name: "mutation",
                    type: "DNA"
                },
                {
                    label: "Radiation Sensitivity",
                    name: "radiationSensitivity",
                    version: "2015"
                }
            ],
            dataset: {},
            genome: {
                label: "GRCh38",
                name: "GRCh38"
            },
            rnaTool: [
                {
                    name: "kallisto_0_46_1",
                    label: "Kallisto-0.46.1"
                }
            ],
            rnaRef: [
                {
                    name: "Gencode_v33",
                    label: "Gencode v33 Transcriptome"
                }
            ],
            createdBy: 'BHK Lab',
            dateCreated: new Date(Date.now()),
            canonical: true
        }
    ];

    radiosets.forEach(set => {
        let dataset = formdata.dataset.find(d => (d.name === set.name));
        set.dataset.name = dataset.name;
        set.dataset.label = dataset.label;
        set.dataset.versionInfo = dataset.versions[0].version;
    });

    radiosets.sort((a, b) => {
        return(a.name.toLowerCase() > b.name.toLowerCase() ? 1: -1)
    })

    console.log(radiosets)

    const collection = db.collection('radioset');
    await collection.deleteMany({})
    await collection.insertMany(radiosets)
    
    client.close();
}

module.exports = {
    buildInsertDataSetObjects
}