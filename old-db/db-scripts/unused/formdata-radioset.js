const mongo  = require('mongodb');
const mongoClient = mongo.MongoClient;

const dataset = [
    {
        label: 'Cleveland', name: 'Cleveland', 
        versions: [
            {
                version: '1.0', pipeline: "get_cleveland", label: '1.0(Cleveland)',
                publication: [
                    {
                        citation: 'Yard, B., Adams, D., Chie, E. et al. A genetic basis for the variation in the vulnerability of cancer to DNA damage. Nat Commun 7, 11428 (2016). https://doi.org/10.1038/ncomms11428.', 
                        link: 'https://www.nature.com/articles/ncomms11428'
                    }
                ], 
                rawSeqDataRNA: 'https://portal.gdc.cancer.gov/legacy-archive/search/f', 
                rawSeqDataDNA: 'https://portal.gdc.cancer.gov/legacy-archive/search/f', 
                radiationSensitivity: {
                    source: 'https://ctd2.nci.nih.gov/dataPortal/',
                    version: ""
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
        datasetType: 'radioset',
        dataset: dataset,
        rnaTool: [
            {label: 'Kallisto-0.46.1', name: 'kallisto_0_46_1', commands: ['kallisto index transcripts.fa.gz -i kallisto_index.idx', 'kallisto quant -i kallisto_index.idx -o output_dir -t 2 sample_1.fq.gz sample_2.fq.gz']}
        ],
        rnaRef: [
            {label: 'Gencode v33 Transcriptome', name: 'Gencode_v33', genome: 'GRCh38', source: 'ftp://ftp.ebi.ac.uk/pub/databases/gencode/Gencode_human/release_33/gencode.v33.transcripts.fa.gz'}
        ],
        accompanyRNA: [
            {label: 'Cleveland (microarray)', name: 'microarray', dataset: 'Cleveland', type: 'rna', source: 'https://data.broadinstitute.org/ccle_legacy_data/mRNA_expression/CCLE_Expression.Arrays_2013-03-18.tar.gz'}
        ],
        accompanyDNA: [
            {label: 'Cleveland (cnv)', name: 'cnv', dataset: 'Cleveland', type: 'cnv', source: 'https://data.broadinstitute.org/ccle_legacy_data'},
            {label: 'Cleveland (mutation)', name: 'mutation', dataset: 'Cleveland', type: 'mut', source: 'https://data.broadinstitute.org/ccle_legacy_data/hybrid_capture_sequencing/CCLE_hybrid_capture1650_hg19_NoCommonSNPs_NoNeutralVariants_CDS_2012.05.07.maf'}
        ],
    };

    let client = {}
    try{
        client = await mongoClient.connect(connStr, {useNewUrlParser: true, useUnifiedTopology: true});
        const db = client.db(dbName);
        const formdata = db.collection('formdata');
        await formdata.deleteOne({'datasetType': 'radioset'});
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