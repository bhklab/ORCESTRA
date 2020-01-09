const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const psetDir = path.join(__dirname, '../psets');
const mongo  = require('mongodb');
const mongoClient = mongo.MongoClient;
const connStr = 'mongodb+srv://root:root@development-cluster-ptdz3.azure.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'orcestra-dev';

const dataset = [
    {
        label: 'CCLE - 2015', name: 'CCLE', version: '2015', 
        publication: [
            {citation: 'Barretina, Jordi et al. “The Cancer Cell Line Encyclopedia enables predictive modelling of anticancer drug sensitivity.” Nature vol. 483,7391 603-7. 28 Mar. 2012, doi:10.1038/nature11003', link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3320027/'}
        ], 
        rawSeqDataRNA: 'https://portal.gdc.cancer.gov/legacy-archive/search/f', 
        rawSeqDataDNA: 'https://portal.gdc.cancer.gov/legacy-archive/search/f',
        drugSensitivity: {label: '2015', version: '2015', source: 'https://data.broadinstitute.org/ccle_legacy_data/pharmacological_profiling/CCLE_NP24.2009_Drug_data_2015.02.24.csv'}
    },
    {
        label: 'FIMM - 2016', name: 'FIMM', version: '2016', 
        publication: [
            {citation: 'Mpindi, J., Yadav, B., Östling, P. et al. Consistency in drug response profiling. Nature 540, E5–E6 (2016) doi:10.1038/nature20171', link: 'https://www.nature.com/articles/nature20171'}
        ], 
        rawSeqDataRNA: 'https://portal.gdc.cancer.gov/legacy-archive/search/f', 
        rawSeqDataDNA: 'https://portal.gdc.cancer.gov/legacy-archive/search/f',
        drugSensitivity: {label: '2016', version: '2016', source: ''}
    },
    {
        label: 'GRAY - 2013', name: 'GRAY', version: '2013', 
        publication: [
            {citation: 'Daemen, Anneleen et al. “Modeling precision treatment of breast cancer.” Genome biology vol. 14,10 (2013): R110. doi:10.1186/gb-2013-14-10-r110', link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3937590/'}
        ], 
        rawSeqDataRNA: 'https://portal.gdc.cancer.gov/legacy-archive/search/f', 
        rawSeqDataDNA: 'https://portal.gdc.cancer.gov/legacy-archive/search/f',
        drugSensitivity: {label: '2013', version: '2013', source: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3937590/bin/gb-2013-14-10-r110-S9.txt'}
    },
    {
        label: 'GRAY - 2017', name: 'GRAY', version: '2017', 
        publication: [
            {citation: 'Hafner, Marc et al. “Quantification of sensitivity and resistance of breast cancer cell lines to anti-cancer drugs using GR metrics.” Scientific data vol. 4 170166. 7 Nov. 2017, doi:10.1038/sdata.2017.166', link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5674849/'}
        ], 
        rawSeqDataRNA: 'http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE48213', 
        rawSeqDataDNA: 'http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE48215',
        drugSensitivity: {label: '2017', version: '2017', source: 'https://www.synapse.org/#!Synapse:syn8094063'}
    },
    {
        label: 'CTRPv2 - 2015', name: 'CTRPv2', version: '2015', 
        publication: [
            {citation: 'Rees, Matthew G et al. “Correlating chemical sensitivity and basal gene expression reveals mechanism of action.” Nature chemical biology vol. 12,2 (2016): 109-16. doi:10.1038/nchembio.1986', link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4718762/'},
            {citation: 'Seashore-Ludlow, Brinton et al. “Harnessing Connectivity in a Large-Scale Small-Molecule Sensitivity Dataset.” Cancer discovery vol. 5,11 (2015): 1210-23. doi:10.1158/2159-8290.CD-15-0235', link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4631646/'},
            {citation: 'Basu, Amrita et al. “An interactive resource to identify cancer genetic and lineage dependencies targeted by small molecules.” Cell vol. 154,5 (2013): 1151-1161. doi:10.1016/j.cell.2013.08.003', link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3954635/'}
        ], 
        rawSeqDataRNA: '', 
        rawSeqDataDNA: '',
        drugSensitivity: {label: '2015', version: '2015', source: 'ftp://anonymous:guest@caftpd.nci.nih.gov/pub/OCG-DCC/CTD2/Broad/CTRPv2.0_2015_ctd2_ExpandedDataset/CTRPv2.0_2015_ctd2_ExpandedDataset.zip'}
    },
    {
        label: 'gCSI - 2018', name: 'gCSI', version: '2018', 
        publication: [
            {citation: 'Not Available', link: ''}
        ], 
        rawSeqDataRNA: 'https://www.ebi.ac.uk/arrayexpress/experiments/E-MTAB-2706/', 
        rawSeqDataDNA: '',
        drugSensitivity: {label: '2018', version: '2018', source: ''}
    },
    {
        label: 'GDSC - 2012', name: 'GDSC', version: '2012', 
        publication: [
            {citation: 'Yang, Wanjuan et al. “Genomics of Drug Sensitivity in Cancer (GDSC): a resource for therapeutic biomarker discovery in cancer cells.” Nucleic acids research vol. 41,Database issue (2013): D955-61. doi:10.1093/nar/gks1111', link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3531057/'}
        ], 
        rawSeqDataRNA: 'https://www.ebi.ac.uk/arrayexpress/experiments/E-MTAB-3983/', 
        rawSeqDataDNA: '',
        drugSensitivity: {label: '2012', version: '2012', source: 'ftp://ftp.sanger.ac.uk/pub/project/cancerrxgene/releases/release-8.0/GDSC1_public_raw_data_17Jul19.csv'}
    },
    {
        label: 'GDSC - 2019', name: 'GDSC', version: '2019', 
        publication: [
            {citation: 'Yang, Wanjuan et al. “Genomics of Drug Sensitivity in Cancer (GDSC): a resource for therapeutic biomarker discovery in cancer cells.” Nucleic acids research vol. 41,Database issue (2013): D955-61. doi:10.1093/nar/gks1111', link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3531057/'}
        ], 
        rawSeqDataRNA: 'https://www.ebi.ac.uk/arrayexpress/experiments/E-MTAB-3983/', 
        rawSeqDataDNA: '',
        drugSensitivity: {label: '2019', version: '2019', source: 'ftp://ftp.sanger.ac.uk/pub/project/cancerrxgene/releases/release-8.0/GDSC2_public_raw_data_17Jul19.csv'}
    },
    {
        label: 'UHN Breast - 2019', name: 'UHN Breast', version: '2019', 
        publication: [
            {citation: 'Mammoliti, Anthony et al. “Creating reproducible pharmacogenomic analysis pipelines.” Scientific data vol. 6,1 166. 3 Sep. 2019, doi:10.1038/s41597-019-0174-7', link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6722117/'}
        ], 
        rawSeqDataRNA: 'https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE73526', 
        rawSeqDataDNA: '',
        drugSensitivity: {label: '2019', version: '2019', source: 'https://codeocean.com/capsule/6718332/'}
    },
    {
        label: 'Leuk AML - 2017', name: 'Leuk AML', version: '2017', 
        publication: [], 
        rawSeqDataRNA: '', 
        rawSeqDataDNA: '',
        drugSensitivity: {label: '2017', version: '2017', source: ''}
    },
    {
        label: 'Leuk AML - 2019', name: 'Leuk AML', version: '2019', 
        publication: [], 
        rawSeqDataRNA: '', 
        rawSeqDataDNA: '',
        drugSensitivity: {label: '2017', version: '2017', source: ''}
    },
    {
        label: 'Leuk Cell Line - 2017', name: 'Leuk Cell Line', version: '2017', 
        publication: [], 
        rawSeqDataRNA: '', 
        rawSeqDataDNA: '',
        drugSensitivity: {label: '2017', version: '2017', source: ''}
    },
    {
        label: 'Leuk Cell Line - 2019', name: 'Leuk Cell Line', version: '2019', 
        publication: [], 
        rawSeqDataRNA: '', 
        rawSeqDataDNA: '',
        drugSensitivity: {label: '2019', version: '2019', source: ''}
    },
]

function buildPSetObject(row){
    let pset = {};
    pset._id = mongo.ObjectId(),
    pset.status = 'complete',
    pset.name = row.PSet;
    pset.download = 0;
    pset.doi = row['Zenodo DOI'];
    
    pset.dataset = dataset.find(data => {
        return(data.name === row.Dataset && data.version === row.Version)
    });
    
    pset.drugSensitivity = {version: row['Drug Sensitivity'], source: row['Drug Raw Data Source']};
    pset.dataType = [{name: 'RNA'}];
    pset.genome = {name: row.Genome};
    pset.createdBy = 'BHK Lab';
    pset.dateCreated = getDate(row['Date Generated']);
    pset.rnaTool = getToolArray(row['RNA Tool(s)']);
    pset.rnaRef = getRefArray(row['RNA Reference'], row['RNA Reference Source']);
    pset.dnaTool = getToolArray(row['DNA Tool(s)']);
    pset.dnaRef = getRefArray(row['DNA Reference'], row['DNA Reference Source']);
    return(pset);
}

function getToolArray(data){
    const kallistoIndex = 'kallisto index gencode.v23.transcripts.fa.gz -i kallisto_hg38_v23.idx';
    const kallistoQuant = 'kallisto quant  -i kallisto_hg38_v23.idx -o output sample_1.fastq.gz sample_2.fastq.gz';

    const array = [];
    if(data.length){
        const tool = {};
        const commands = [kallistoIndex, kallistoQuant];
        tool.name = data;
        tool.commands = commands;
        array.push(tool);
    }
    return(array);
}

function getRefArray(data, source){
    const array = [];
    if(data.length){
        const ref = {};
        ref.name = data;
        ref.source = source;
        array.push(ref);
    }
    return(array);
}

function readFromCSV(callback){
    const data = [];
    fs.createReadStream(path.join(psetDir, 'psets.csv'))
        .pipe(csv())
        .on('data', (row) => {
            data.push(buildPSetObject(row));
        })
        .on('end', () => {
            callback(data);
        });
}

function getDate(dateStr){
    const [month, day, year] = dateStr.split('/');
    return new Date(year, month - 1, day);
}

const insert = function(req, res){
    console.log("bulk insert");
    readFromCSV((data) => {
            mongoClient.connect(connStr, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
                if(err){
                    console.log(err);
                    res.send(err);
                }
                const db = client.db(dbName);
                const collection = db.collection('pset');
                collection.insertMany(data, (err, result) => {
                    client.close();
                    if(err){
                        console.log(err);
                        res.send(err);
                    }
                    res.send(result);
                });
            });
            // console.log(data.slice(0, 1));
            // res.send(data.slice(0, 1).dateCreated);
    });
}

const insertFormdata = function(req, res){
    const meta = {
        dataType: [{label: 'DNA', name: 'DNA'}, {label: 'RNA', name: 'RNA'}],
        dataset: dataset,
        drugSensitivity: [
            {label: '2015(CCLE)', version: '2015', source: 'https://data.broadinstitute.org/ccle_legacy_data/pharmacological_profiling/CCLE_NP24.2009_Drug_data_2015.02.24.csv'},
            {label: '2013(GRAY)', version: '2013', source: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3937590/bin/gb-2013-14-10-r110-S9.txt'},
            {label: '2017(GRAY)', version: '2017', source: 'https://www.synapse.org/#!Synapse:syn8094063'},
            {label: '2015(CTRPv2)', version: '2015', source: 'ftp://anonymous:guest@caftpd.nci.nih.gov/pub/OCG-DCC/CTD2/Broad/CTRPv2.0_2015_ctd2_ExpandedDataset/CTRPv2.0_2015_ctd2_ExpandedDataset.zip'},
            {label: '2018(gCSI)', version: '2018', source: ''},
            {label: '2012(GDSC)', version: '2012', source: 'ftp://ftp.sanger.ac.uk/pub/project/cancerrxgene/releases/release-8.0/GDSC1_public_raw_data_17Jul19.csv'},
            {label: '2019(GDSC)', version: '2019', source: 'ftp://ftp.sanger.ac.uk/pub/project/cancerrxgene/releases/release-8.0/GDSC2_public_raw_data_17Jul19.csv'},
            {label: '2019(UHN)', version: '2019', source: 'https://codeocean.com/capsule/6718332/'}
        ],
        genome: [{label: 'GRCh37', name: 'GRCh37'}, {label: 'GRCh38', name: 'GRCh38'}],
        rnaTool: [
            {label: 'Kallisto/0.44.0', name: 'Kallisto/0.44.0', commands: ['kallisto index gencode.v23.transcripts.fa.gz -i kallisto_hg38_v23.idx', 'kallisto quant  -i kallisto_hg38_v23.idx -o output sample_1.fastq.gz sample_2.fastq.gz']},
            {label: 'Kallisto/0.43.1', name: 'Kallisto/0.43.1', commands: ['kallisto index gencode.v23.transcripts.fa.gz -i kallisto_hg38_v23.idx', 'kallisto quant  -i kallisto_hg38_v23.idx -o output sample_1.fastq.gz sample_2.fastq.gz']},
            {label: 'Salmon/11.3', name: 'Salmon/11.3', commands: []},
            {label: 'Salmon/11.2', name: 'Salmon/11.2', commands: []},
            {label: 'STAR/2.7.0', name: 'STAR/2.7.0', commands: []},
            {label: 'STAR/2.5.0', name: 'STAR/2.5.0', commands: []}
        ],
        rnaRef: [
            {label: 'Ensembl GRCh38 v89 Transcriptome', name: 'Ensembl GRCh38 v89 Transcriptome', genome: 'GRCh38', source: 'ftp://ftp.ensembl.org/pub/release-89/gtf/homo_sapiens/Homo_sapiens.GRCh38.89.gtf.gz'},
            {label: 'Ensembl GRCh37 v67 Transcriptome', name: 'Ensembl GRCh37 v67 Transcriptome', genome: 'GRCh37', source: 'ftp://ftp.ensembl.org/pub/release-67/gtf/homo_sapiens/Homo_sapiens.GRCh37.67.gtf.gz'},
            {label: 'Gencode v23 Transcriptome', name: 'Gencode v23 Transcriptome', genome: 'GRCh38', source: 'ftp://ftp.ebi.ac.uk/pub/databases/gencode/Gencode_human/release_23/gencode.v23.transcripts.fa.gz'},
            {label: 'Gencode v23lift37 Transcriptome', name: 'Gencode v23lift37 Transcriptome', genome: 'GRCh37', source: 'ftp://ftp.ebi.ac.uk/pub/databases/gencode/Gencode_human/release_23/GRCh37_mapping/gencode.v23lift37.annotation.gtf.gz'}
        ],
        dnaTool: [
            {label: 'MuTect1', name: 'MuTect1', commands: []},
            {label: 'MuTect2', name: 'MuTect2', commands: []}
        ],
        dnaRef: [
            {
                label: 'dbSNP_137.hg19.vcf', name: 'dbSNP_137.hg19.vcf', genome: 'GRCh37', source: 'https://console.cloud.google.com/storage/browser/_details/gatk-legacy-bundles/b37/dbsnp_137.b37.vcf', 
                cosmic: {name: 'COSMIC_v79.hg19.vcf', source: 'https://cancer.sanger.ac.uk/cosmic/download'}, 
                exonTarget: {name: 'SureSelect_Human_All_Exon_V4_hg19.bed', source: 'https://earray.chem.agilent.com/suredesign/search.htm'}
            },
            {
                label: 'dbSNP_138.hg19.vcf', name: 'dbSNP_138.hg19.vcf', genome: 'GRCh37', source: 'https://console.cloud.google.com/storage/browser/_details/gatk-legacy-bundles/b37/dbsnp_138.b37.vcf', 
                cosmic: {name: 'COSMIC_v79.hg19.vcf', source: 'https://cancer.sanger.ac.uk/cosmic/download'}, 
                exonTarget: {name: 'SureSelect_Human_All_Exon_V5_hg19.bed', source: 'https://earray.chem.agilent.com/suredesign/search.htm'}
            },
            {
                label: 'GRCh38 dbSNP', name: 'GRCh38 dbSNP', genome: 'GRCh38', source: '', 
                cosmic: {name: 'COSMIC_v79.hg38.vcf', source: 'https://cancer.sanger.ac.uk/cosmic/download'}, 
                exonTarget: {name: 'SureSelect_Human_All_Exon_V7_hg38.bed', source: 'https://earray.chem.agilent.com/suredesign/search.htm'}
            }
        ]
    };


    mongoClient.connect(connStr, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
        if(err){
            console.log(err);
            res.send(err);
        }
        const db = client.db(dbName);
        const collection = db.collection('formdata');
        collection.insert(meta, (err, result) => {
            client.close();
            if(err){
                console.log(err);
                res.send(err);
            }
            res.send(result);
        });
    });
}

module.exports = {
    insert,
    insertFormdata
}