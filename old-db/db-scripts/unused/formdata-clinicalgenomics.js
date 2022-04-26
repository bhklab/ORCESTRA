const mongo  = require('mongodb');
const mongoClient = mongo.MongoClient;

const dataset = [
    {
        label: 'MetaGxPancreas', name: 'MetaGxPancreas', 
        versions: [
            {
                version: '1.0', pipeline: "get_metagx", label: '1.0(EMetaGxPancreas)',
                publication: [
                    {
                        citation: 'Gendoo, D.M.A., Zon, M., Sandhu, V. et al. MetaGxData: Clinically Annotated Breast, Ovarian and Pancreatic Cancer Datasets and their Use in Generating a Multi-Cancer Gene Signature. Sci Rep 9, 8770 (2019). https://doi.org/10.1038/s41598-019-45165-4', 
                        link: 'https://www.nature.com/articles/s41598-019-45165-4'
                    }
                ], 
                data: {
                    rawMicroarrayData: 'http://bioconductor.org/packages/release/data/experiment/html/MetaGxPancreas.html', 
                    drugResponseData: undefined
                }
                
            }
        ]
    }
];

/**
 * Inserts form data for Toxico into MongoDB database.
 * @param {string} connStr connection string for the db
 * @param {string} dbName name of the database.
 */
const insertFormdata = async function(connStr, dbName){
    console.log('insertFormData')
    const form = {
        datasetType: 'clinicalgenomics',
        dataset: dataset
    };

    let client = {}
    try{
        client = await mongoClient.connect(connStr, {useNewUrlParser: true, useUnifiedTopology: true});
        const db = client.db(dbName);
        const formdata = db.collection('formdata');
        await formdata.deleteOne({'datasetType': 'clinicalgenomics'});
        await formdata.insertOne(form);
        client.close();
    }catch(error){
        console.log(error);
        client.close();
    }
}

module.exports = {
    insertFormdata
}