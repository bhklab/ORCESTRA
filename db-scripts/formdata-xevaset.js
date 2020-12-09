const mongo  = require('mongodb');
const mongoClient = mongo.MongoClient;

const dataset = [
    {
        label: 'PDXE', name: 'PDXE', 
        versions: [
            {
                version: '1.0', pipeline: "get_PDXE", label: '1.0(PDXE)',
                publication: [
                    {
                        citation: 'Gao H, Korn JM, Ferretti S, Monahan JE, Wang Y, Singh M, Zhang C, Schnell C, Yang G, Zhang Y, Balbin OA, Barbe S, Cai H, Casey F, Chatterjee S, Chiang DY, Chuai S, Cogan SM, Collins SD, Dammassa E, Ebel N, Embry M, Green J, Kauffmann A, Kowal C, Leary RJ, Lehar J, Liang Y, Loo A, Lorenzana E, Robert McDonald E 3rd, McLaughlin ME, Merkin J, Meyer R, Naylor TL, Patawaran M, Reddy A, Röelli C, Ruddy DA, Salangsang F, Santacroce F, Singh AP, Tang Y, Tinetto W, Tobler S, Velazquez R, Venkatesan K, Von Arx F, Wang HQ, Wang Z, Wiesmann M, Wyss D, Xu F, Bitter H, Atadja P, Lees E, Hofmann F, Li E, Keen N, Cozens R, Jensen MR, Pryer NK, Williams JA, Sellers WR. High-throughput screening using patient-derived tumor xenografts to predict clinical trial drug response. Nat Med. 2015 Nov;21(11):1318-25. doi: 10.1038/nm.3954. Epub 2015 Oct 19. PMID: 26479923.', 
                        link: 'https://pubmed.ncbi.nlm.nih.gov/26479923/'
                    },
                    {
                        citation: 'Arvind S. Mer, Wail Ba-Alawi, Petr Smirnov, Yi X. Wang, Ben Brew, Janosch Ortmann, Ming-Sound Tsao, David W. Cescon, Anna Goldenberg and Benjamin Haibe-Kains. (2019) Integrative Pharmacogenomics Analysis of Patient-Derived Xenografts. Cancer Res September 1 2019 (79) (17) 4539-4550; DOI: 10.1158/0008-5472.CAN-19-0349', 
                        link: 'https://cancerres.aacrjournals.org/content/79/17/4539'
                    }
                ], 
                data: {
                    cnv: 'https://static-content.springer.com/esm/art%3A10.1038%2Fnm.3954/MediaObjects/41591_2015_BFnm3954_MOESM10_ESM.xlsx',
                    rnaseq: 'https://static-content.springer.com/esm/art%3A10.1038%2Fnm.3954/MediaObjects/41591_2015_BFnm3954_MOESM10_ESM.xlsx',
                    mutation: 'https://static-content.springer.com/esm/art%3A10.1038%2Fnm.3954/MediaObjects/41591_2015_BFnm3954_MOESM10_ESM.xlsx', 
                    drugResponseData: {
                        version: '2015',
                        source: 'https://pubmed.ncbi.nlm.nih.gov/26479923/',
                        data: 'https://static-content.springer.com/esm/art%3A10.1038%2Fnm.3954/MediaObjects/41591_2015_BFnm3954_MOESM10_ESM.xlsx'
                    }
                }
            }
        ]
    }
];

/**
 * Inserts form data for XevaSet into MongoDB database.
 * @param {string} connStr connection string for the db
 * @param {string} dbName name of the database.
 */
const insertFormdata = async function(connStr, dbName){
    console.log('insertFormData')
    const form = {
        datasetType: 'xevaset',
        dataset: dataset
    };

    let client = {}
    try{
        client = await mongoClient.connect(connStr, {useNewUrlParser: true, useUnifiedTopology: true});
        const db = client.db(dbName);
        const formdata = db.collection('formdata');
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