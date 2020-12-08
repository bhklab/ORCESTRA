const mongo  = require('mongodb');
const mongoClient = mongo.MongoClient;

const dataset = [
    {
        label: 'EMEXP2458', name: 'EMEXP2458', 
        versions: [
            {
                version: '1.0', pipeline: "get_EXP2458", label: '1.0(EMEXP2458)',
                publication: [
                    {
                        citation: 'Jennen DG, Magkoufopoulou C, Ketelslegers HB, van Herwijnen MH, Kleinjans JC, van Delft JH. Comparison of HepG2 and HepaRG by whole-genome gene expression analysis for the purpose of chemical hazard identification. Toxicol Sci. 2010 May;115(1):66-79. doi: 10.1093/toxsci/kfq026. Epub 2010 Jan 27. PMID: 20106945.', 
                        link: 'https://pubmed.ncbi.nlm.nih.gov/20106945/'
                    }
                ], 
                data: {
                    rawMicroarrayData: 'https://www.ebi.ac.uk/arrayexpress/experiments/E-MEXP-2458/', 
                    drugResponseData: ''
                }
                
            }
        ]
    },
    {
        label: 'DrugMatrix', name: 'DrugMatrix', 
        versions: [
            {
                version: '1.0', pipeline: "getDrugMat", label: '1.0(DrugMatrix)',
                publication: [
                    {
                        citation: 'Svoboda D.L., Saddler T., Auerbach S.S. (2019) An Overview of National Toxicology Program’s Toxicogenomic Applications: DrugMatrix and ToxFX. In: Hong H. (eds) Advances in Computational Toxicology. Challenges and Advances in Computational Chemistry and Physics, vol 30. Springer, Cham. https://doi.org/10.1007/978-3-030-16443-0_8', 
                        link: 'https://link.springer.com/chapter/10.1007/978-3-030-16443-0_8'
                    }
                ], 
                data: {
                    rawMicroarrayData: 'ftp://ftp.ebi.ac.uk/pub/databases/microarray/data/dixa/DrugMatrix/archive/hepatocyte/', 
                    drugResponseData: ''
                }
            }
        ]
    },
    {
        label: 'TGGATE-Rat', name: 'TGGATE-Rat', 
        versions: [
            {
                version: '1.0', pipeline: "getTG_rat", label: '1.0(TGGATE-Rat)',
                publication: [
                    {
                        citation: 'Igarashi Y, Nakatsu N, Yamashita T, Ono A, Ohno Y, Urushidani T, Yamada H. Open TG-GATEs: a large-scale toxicogenomics database. Nucleic Acids Res. 2015 Jan;43(Database issue):D921-7. doi: 10.1093/nar/gku955. Epub 2014 Oct 13. PMID: 25313160; PMCID: PMC4384023.', 
                        link: 'https://pubmed.ncbi.nlm.nih.gov/25313160/'
                    }
                ], 
                data: {
                    rawMicroarrayData: 'ftp://ftp.biosciencedbc.jp/archive/open-tggates/LATEST/Rat/in_vitro/', 
                    drugResponseData: 'ftp://ftp.biosciencedbc.jp/archive/open-tggates/LATEST/Open-tggates_AllAttribute.zip'
                }
            }
        ] 
    },
    {
        label: 'TGGATE-Human', name: 'TGGATE-Human', 
        versions: [
            {
                version: '1.0', pipeline: "getTG_human", label: '1.0(TGGATE-Human)',
                publication: [
                    {
                        citation: 'Igarashi Y, Nakatsu N, Yamashita T, Ono A, Ohno Y, Urushidani T, Yamada H. Open TG-GATEs: a large-scale toxicogenomics database. Nucleic Acids Res. 2015 Jan;43(Database issue):D921-7. doi: 10.1093/nar/gku955. Epub 2014 Oct 13. PMID: 25313160; PMCID: PMC4384023.', 
                        link: 'https://pubmed.ncbi.nlm.nih.gov/25313160/'
                    }
                ],
                data: {
                    rawMicroarrayData: 'ftp://ftp.biosciencedbc.jp/archive/open-tggates/LATEST/Human/in_vitro/', 
                    drugResponseData: 'ftp://ftp.biosciencedbc.jp/archive/open-tggates/LATEST/Open-tggates_AllAttribute.zip'
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
        datasetType: 'toxicoset',
        dataset: dataset
    };

    let client = {}
    try{
        client = await mongoClient.connect(connStr, {useNewUrlParser: true, useUnifiedTopology: true});
        const db = client.db(dbName);
        const formdata = db.collection('formdata');
        await formdata.deleteOne({'datasetType': 'toxicoset'});
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