const mongo  = require('mongodb');
const mongoClient = mongo.MongoClient;

const dataset = [
    {
        label: 'CCLE', name: 'CCLE', 
        versions: [
            {
                version: '2015', pipeline: "get_ccle", label: '2015(CCLE)', type: 'sensitivity',
                publication: [
                    {citation: 'Barretina, Jordi et al. “The Cancer Cell Line Encyclopedia enables predictive modelling of anticancer drug sensitivity.” Nature vol. 483,7391 603-7. 28 Mar. 2012, doi:10.1038/nature11003', link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3320027/'}
                ], 
                rawSeqDataRNA: 'https://portal.gdc.cancer.gov/legacy-archive/search/f', 
                rawSeqDataDNA: 'https://portal.gdc.cancer.gov/legacy-archive/search/f',
                drugSensitivity: {version: '2015', source: 'https://data.broadinstitute.org/ccle_legacy_data/pharmacological_profiling/CCLE_NP24.2009_Drug_data_2015.02.24.csv'}
            }
        ],
        disabled: false
    },
    {
        label: 'FIMM', name: 'FIMM', 
        versions: [
            {
                version: '2016', pipeline: 'fimm', label: '2016(FIMM)', type: 'sensitivity',
                publication: [
                    {citation: 'Mpindi, J., Yadav, B., Östling, P. et al. Consistency in drug response profiling. Nature 540, E5–E6 (2016) doi:10.1038/nature20171', link: 'https://www.nature.com/articles/nature20171'}
                ], 
                rawSeqDataRNA: 'https://portal.gdc.cancer.gov/legacy-archive/search/f', 
                rawSeqDataDNA: 'https://portal.gdc.cancer.gov/legacy-archive/search/f',
                drugSensitivity: {version: '2016', source: ''}
            }
        ]
    },
    {
        label: 'GRAY', name: 'GRAY',
        versions: [
            {
                version: '2013', pipeline: "getGRAYP_2013", label: '2013(GRAY)', type: 'sensitivity',
                publication: [
                    {citation: 'Daemen, Anneleen et al. “Modeling precision treatment of breast cancer.” Genome biology vol. 14,10 (2013): R110. doi:10.1186/gb-2013-14-10-r110', link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3937590/'}
                ], 
                drugSensitivity: {version: '2013', source: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3937590/bin/gb-2013-14-10-r110-S9.txt'},
                rawSeqDataRNA: 'http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE48213', 
                rawSeqDataDNA: 'http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE48215'
            },
            {
                version: '2017', pipeline: "getGRAY_2017", label: '2017(GRAY)', type: 'sensitivity',
                publication: [
                    {citation: 'Hafner, Marc et al. “Quantification of sensitivity and resistance of breast cancer cell lines to anti-cancer drugs using GR metrics.” Scientific data vol. 4 170166. 7 Nov. 2017, doi:10.1038/sdata.2017.166', link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5674849/'}
                ], 
                drugSensitivity: {version: '2017', source: 'https://www.synapse.org/#!Synapse:syn8094063'},
                rawSeqDataRNA: 'http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE48213', 
                rawSeqDataDNA: 'http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE48215'
            }
        ]  
    },
    {
        label: 'CTRPv2', name: 'CTRPv2', 
        versions: [
            {
                version: '2015', pipeline: 'get_CTRP', label: '2015(CTRPv2)', type: 'sensitivity',
                publication: [
                    {citation: 'Rees, Matthew G et al. “Correlating chemical sensitivity and basal gene expression reveals mechanism of action.” Nature chemical biology vol. 12,2 (2016): 109-16. doi:10.1038/nchembio.1986', link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4718762/'},
                    {citation: 'Seashore-Ludlow, Brinton et al. “Harnessing Connectivity in a Large-Scale Small-Molecule Sensitivity Dataset.” Cancer discovery vol. 5,11 (2015): 1210-23. doi:10.1158/2159-8290.CD-15-0235', link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4631646/'},
                    {citation: 'Basu, Amrita et al. “An interactive resource to identify cancer genetic and lineage dependencies targeted by small molecules.” Cell vol. 154,5 (2013): 1151-1161. doi:10.1016/j.cell.2013.08.003', link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3954635/'}
                ], 
                rawSeqDataRNA: '', 
                rawSeqDataDNA: '',
                drugSensitivity: {version: '2015', source: 'ftp://anonymous:guest@caftpd.nci.nih.gov/pub/OCG-DCC/CTD2/Broad/CTRPv2.0_2015_ctd2_ExpandedDataset/CTRPv2.0_2015_ctd2_ExpandedDataset.zip'}
            }
        ] 
    },
    {
        label: 'gCSI', name: 'gCSI', 
        versions: [
            {
                version: '2017', pipeline: 'get_gCSI2017', label: '2017(gCSI)', type: 'sensitivity',
                publication: [
                    {citation: 'Haverty, P., Lin, E., Tan, J. et al. Reproducible pharmacogenomic profiling of cancer cell line panels. Nature 533, 333–337 (2016). https://doi.org/10.1038/nature17987', link: 'https://www.nature.com/articles/nature17987'},
                    {citation: 'Klijn, C., Durinck, S., Stawiski, E. et al. A comprehensive transcriptional portrait of human cancer cell lines. Nat Biotechnol 33, 306–312 (2015). https://doi.org/10.1038/nbt.3080', link: 'https://www.nature.com/articles/nbt.3080'}
                ], 
                rawSeqDataRNA: 'https://www.ebi.ac.uk/arrayexpress/experiments/E-MTAB-2706/', 
                rawSeqDataDNA: '',
                drugSensitivity: {version: '2017', source: 'http://research-pub.gene.com/gCSI-cellline-data/'},
            },
            {
                version: '2018', pipeline: 'get_gCSI2018', label: '2018(gCSI)',
                publication: [
                    {citation: 'Not Available', link: ''}
                ], 
                rawSeqDataRNA: 'https://www.ebi.ac.uk/arrayexpress/experiments/E-MTAB-2706/', 
                rawSeqDataDNA: '',
                drugSensitivity: {version: '2018', source: ''}
            }
        ]
        
    },
    {
        label: 'GDSC', name: 'GDSC', 
        versions: [
            {
                version: '2019(v1-8.0)', pipeline: 'getGDSCv1', label: '2019(v1-8.0)(GDSC)', type: 'sensitivity',
                publication: [
                    {citation: 'Yang, Wanjuan et al. “Genomics of Drug Sensitivity in Cancer (GDSC): a resource for therapeutic biomarker discovery in cancer cells.” Nucleic acids research vol. 41,Database issue (2013): D955-61. doi:10.1093/nar/gks1111', link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3531057/'},
                    {citation: 'Iorio F, Knijnenburg TA, Vis DJ, et al. A Landscape of Pharmacogenomic Interactions in Cancer. Cell. 2016;166(3):740‐754. doi:10.1016/j.cell.2016.06.017', link: 'https://pubmed.ncbi.nlm.nih.gov/27397505/'},
                    {citation: 'Garnett MJ, Edelman EJ, Heidorn SJ, et al. Systematic identification of genomic markers of drug sensitivity in cancer cells. Nature. 2012;483(7391):570‐575. Published 2012 Mar 28. doi:10.1038/nature11005', link: 'https://pubmed.ncbi.nlm.nih.gov/22460902/'}
                ], 
                rawSeqDataRNA: 'https://www.ebi.ac.uk/arrayexpress/experiments/E-MTAB-3983/', 
                rawSeqDataDNA: '',
                drugSensitivity: {version: '2019(v1-8.0)', source: 'ftp://ftp.sanger.ac.uk/pub/project/cancerrxgene/releases/release-8.0/GDSC1_public_raw_data_17Jul19.csv'}
            },
            {
                version: '2019(v2-8.0)', pipeline: 'GDSCv2', label: '2019(v2-8.0)(GDSC)', type: 'sensitivity',
                publication: [
                    {citation: 'Yang, Wanjuan et al. “Genomics of Drug Sensitivity in Cancer (GDSC): a resource for therapeutic biomarker discovery in cancer cells.” Nucleic acids research vol. 41,Database issue (2013): D955-61. doi:10.1093/nar/gks1111', link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3531057/'},
                    {citation: 'Iorio F, Knijnenburg TA, Vis DJ, et al. A Landscape of Pharmacogenomic Interactions in Cancer. Cell. 2016;166(3):740‐754. doi:10.1016/j.cell.2016.06.017', link: 'https://pubmed.ncbi.nlm.nih.gov/27397505/'},
                    {citation: 'Garnett MJ, Edelman EJ, Heidorn SJ, et al. Systematic identification of genomic markers of drug sensitivity in cancer cells. Nature. 2012;483(7391):570‐575. Published 2012 Mar 28. doi:10.1038/nature11005', link: 'https://pubmed.ncbi.nlm.nih.gov/22460902/'}
                ], 
                rawSeqDataRNA: 'https://www.ebi.ac.uk/arrayexpress/experiments/E-MTAB-3983/', 
                rawSeqDataDNA: '',
                drugSensitivity: {version: '2019(v2-8.0)', source: 'ftp://ftp.sanger.ac.uk/pub/project/cancerrxgene/releases/release-8.0/GDSC2_public_raw_data_17Jul19.csv'}
            },
            {
                version: '2020(v1-8.2)', pipeline: 'getGDSCv1', label: '2020(v1-8.2)(GDSC)', type: 'sensitivity',
                publication: [
                    {citation: 'Yang, Wanjuan et al. “Genomics of Drug Sensitivity in Cancer (GDSC): a resource for therapeutic biomarker discovery in cancer cells.” Nucleic acids research vol. 41,Database issue (2013): D955-61. doi:10.1093/nar/gks1111', link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3531057/'},
                    {citation: 'Iorio F, Knijnenburg TA, Vis DJ, et al. A Landscape of Pharmacogenomic Interactions in Cancer. Cell. 2016;166(3):740‐754. doi:10.1016/j.cell.2016.06.017', link: 'https://pubmed.ncbi.nlm.nih.gov/27397505/'},
                    {citation: 'Garnett MJ, Edelman EJ, Heidorn SJ, et al. Systematic identification of genomic markers of drug sensitivity in cancer cells. Nature. 2012;483(7391):570‐575. Published 2012 Mar 28. doi:10.1038/nature11005', link: 'https://pubmed.ncbi.nlm.nih.gov/22460902/'}
                ], 
                rawSeqDataRNA: 'https://www.ebi.ac.uk/arrayexpress/experiments/E-MTAB-3983/', 
                rawSeqDataDNA: '',
                drugSensitivity: {version: '2020(v1-8.2)', source: 'ftp://ftp.sanger.ac.uk/pub/project/cancerrxgene/releases/release-8.2/GDSC1_public_raw_data_25Feb20.csv'}
            },
            {
                version: '2020(v2-8.2)', pipeline: 'GDSCv2', label: '2020(v2-8.2)(GDSC)', type: 'sensitivity',
                publication: [
                    {citation: 'Yang, Wanjuan et al. “Genomics of Drug Sensitivity in Cancer (GDSC): a resource for therapeutic biomarker discovery in cancer cells.” Nucleic acids research vol. 41,Database issue (2013): D955-61. doi:10.1093/nar/gks1111', link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3531057/'},
                    {citation: 'Iorio F, Knijnenburg TA, Vis DJ, et al. A Landscape of Pharmacogenomic Interactions in Cancer. Cell. 2016;166(3):740‐754. doi:10.1016/j.cell.2016.06.017', link: 'https://pubmed.ncbi.nlm.nih.gov/27397505/'},
                    {citation: 'Garnett MJ, Edelman EJ, Heidorn SJ, et al. Systematic identification of genomic markers of drug sensitivity in cancer cells. Nature. 2012;483(7391):570‐575. Published 2012 Mar 28. doi:10.1038/nature11005', link: 'https://pubmed.ncbi.nlm.nih.gov/22460902/'}
                ], 
                rawSeqDataRNA: 'https://www.ebi.ac.uk/arrayexpress/experiments/E-MTAB-3983/', 
                rawSeqDataDNA: '',
                drugSensitivity: {version: '2020(v2-8.2)', source: 'ftp://ftp.sanger.ac.uk/pub/project/cancerrxgene/releases/release-8.2/GDSC2_public_raw_data_25Feb20.csv'}
            }
        ]
    },
    {
        label: 'UHNBreast', name: 'UHNBreast', 
        versions: [
            {
                version: '2019', pipeline: 'getUHN_2019', label: '2019(UHNBreast)', type: 'both',
                publication: [
                    {citation: 'Mammoliti, Anthony et al. “Creating reproducible pharmacogenomic analysis pipelines.” Scientific data vol. 6,1 166. 3 Sep. 2019, doi:10.1038/s41597-019-0174-7', link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6722117/'}
                ], 
                rawSeqDataRNA: 'https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE73526', 
                rawSeqDataDNA: '',
                drugSensitivity: {version: '2019', source: 'https://codeocean.com/capsule/6718332/'}
            }
        ]
    },
    {
        label: 'CMAP', name: 'CMAP', 
        versions: [
            {
                version: '2016', pipeline: '', label: '2016(CMAP)', type: 'perturbation',
                publication: [
                    {citation: 'Lamb J, Crawford ED, Peck D, et al. The Connectivity Map: using gene-expression signatures to connect small molecules, genes, and disease. Science. 2006;313(5795):1929-1935. doi:10.1126/science.1132939', link: 'https://pubmed.ncbi.nlm.nih.gov/17008526/'}
                ], 
                rawSeqDataRNA: '', 
                rawSeqDataDNA: '',
                drugSensitivity: {}
            }
        ],
        unavailable: true
    },
]

/**
 * Inserts form data into MongoDB database.
 * @param {string} connStr connection string for the db
 * @param {string} dbName name of the database.
 */
const insertFormdata = async function(connStr, dbName){
    console.log('insertFormData')
    const form = {
        dataType: [{label: 'RNA-seq', name: 'rnaseq'}, {label: 'DNA', name: 'DNA'}],
        dataset: dataset,
        genome: [{label: 'GRCh37', name: 'GRCh37'}, {label: 'GRCh38', name: 'GRCh38'}],
        rnaTool: [
            {label: 'Kallisto-0.43.0', name: 'kallisto_0_43_0', commands: ['kallisto index transcripts.fa.gz -i kallisto_index.idx', 'kallisto quant -i kallisto_index.idx -o output_dir -t 2 sample_1.fq.gz sample_2.fq.gz']},
            {label: 'Kallisto-0.46.1', name: 'kallisto_0_46_1', commands: ['kallisto index transcripts.fa.gz -i kallisto_index.idx', 'kallisto quant -i kallisto_index.idx -o output_dir -t 2 sample_1.fq.gz sample_2.fq.gz']},
            {label: 'Salmon-0.8.2', name: 'salmon_0_8_2', commands: ['salmon index -t transcripts.fa -i salmon_index', 'salmon quant -i salmon_index -o output_dir -l A -1 sample_1.fq.gz -2 sample_2.fq.gz -p 2']},
            {label: 'Salmon-1.1.0', name: 'salmon_1_1_0', commands: ['salmon index -t transcripts.fa -i salmon_index', 'salmon quant -i salmon_index -o output_dir -l A -1 sample_1.fq.gz -2 sample_2.fq.gz -p 2 --validateMappings']},
        ],
        rnaRef: [
            {label: 'Ensembl v99 Transcriptome', name: 'Ensembl_v99', genome: 'GRCh38', source: 'ftp://ftp.ensembl.org/pub/release-99/fasta/homo_sapiens/cdna/Homo_sapiens.GRCh38.cdna.all.fa.gz'},
            {label: 'Gencode v33 Transcriptome', name: 'Gencode_v33', genome: 'GRCh38', source: 'ftp://ftp.ebi.ac.uk/pub/databases/gencode/Gencode_human/release_33/gencode.v33.transcripts.fa.gz'},
            {label: 'Gencode v33lift37 Transcriptome', name: 'Gencode_v33lift37', genome: 'GRCh37', source: 'ftp://ftp.ebi.ac.uk/pub/databases/gencode/Gencode_human/release_23/GRCh37_mapping/gencode.v23lift37.annotation.gtf.gz'}
        ],
        accompanyRNA: [
            {label: 'CCLE (microarray)', name: 'microarray', dataset: 'CCLE', type: 'rna', source: 'https://data.broadinstitute.org/ccle_legacy_data/mRNA_expression/CCLE_Expression.Arrays_2013-03-18.tar.gz'},
            {label: 'CMAP (microarray)', name: 'microarray', dataset: 'CMAP', type: 'rna', source: 'https://portals.broadinstitute.org/cmap/'},
            {label: 'GDSC (microarray)', name: 'microarray', dataset: 'GDSC', type: 'rna', source: 'ftp://ftp.ebi.ac.uk//pub/databases/microarray/data/experiment/MTAB/E-MTAB-783'},
        ],
        accompanyDNA: [
            {label: 'CCLE (cnv)', name: 'cnv', dataset: 'CCLE', type: 'cnv', source: 'https://data.broadinstitute.org/ccle_legacy_data'},
            {label: 'CCLE (mutation)', name: 'mutation', dataset: 'CCLE', type: 'mut', source: 'https://data.broadinstitute.org/ccle_legacy_data/hybrid_capture_sequencing/CCLE_hybrid_capture1650_hg19_NoCommonSNPs_NoNeutralVariants_CDS_2012.05.07.maf'},
            {label: 'gCSI (cnv)', name: 'cnv', dataset: 'gCSI', type: 'cnv', source: 'https://www.ebi.ac.uk/ega/datasets/EGAD00010000951'},
            {label: 'gCSI (mutation)', name: 'mutation', dataset: 'gCSI', type: 'mut', source: 'http://research-pub.gene.com/gCSI-cellline-data/compareDrugScreens_current.tar.gz'},
            {label: 'GDSC (cnv)', name: 'cnv', dataset: 'GDSC', type: 'cnv', source: 'https://www.ebi.ac.uk/ega/studies/EGAS00001000978'},
            {label: 'GDSC (fusion)', name: 'fusion', dataset: 'GDSC', type: 'fusion', source: 'ftp://ftp.sanger.ac.uk/pub4/cancerrxgene/releases/release-5.0/gdsc_mutation_w5.csv'},
            {label: 'GDSC (mutation)', name: 'mutation', dataset: 'GDSC', type: 'mut', source: [
                {name: 'mutation', label: 'Mutation', source: 'ftp://ftp.sanger.ac.uk/pub4/cancerrxgene/releases/release-5.0/gdsc_mutation_w5.csv'},
                {name: 'mutation_exome', label: 'Exome Mutation', source: 'https://cog.sanger.ac.uk/cmp/download/mutations_latest.csv.gz'}
            ]}
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
        ],
        molecularData: [
            {label: 'RNA-seq', name: 'rnaseq', type: 'RNA' , default: true},
            {label: 'Microarray', name: 'microarray', type: 'RNA'},
            {label: 'Copy Number Variation', name: 'cnv', type: 'DNA'},
            {label: 'Fusion', name: 'fusion', type: 'DNA'},
            {label: 'Mutation', name: 'mutation', type: 'DNA'}
        ]
    };

    let client = {}
    try{
        client = await mongoClient.connect(connStr, {useNewUrlParser: true, useUnifiedTopology: true})
        const db = client.db(dbName)
        const formdata = db.collection('formdata')
        await formdata.insertOne(form)
        client.close()
        console.log('done')
    }catch(error){
        console.log(error)
        client.close()
    }
}

module.exports = {
    insertFormdata
}