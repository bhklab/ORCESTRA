const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../../.env')});
const mongoose = require('mongoose');
const fs = require('fs');
const axios = require('axios');

const DatasetNote = require('../models/dataset-note');
const Dataset = require('../models/dataset');
const DataFilter = require('../models/data-filter');
const ObjSchema = require('../models/data-object');
const User = require('../models/user');
const PachydermPipeline = require('../models/pachyderm-pipeline');

const datasetInfo = [
    {
        name: 'ICB_Hwang',
        citation: "Hwang, S., et al. 2020. Immune gene signatures for predicting durable clinical benefit of anti-pd-1 immunotherapy in patients with non-small cell lung cancer. Sci Rep, 2020. 10(1): p.643.",
        link: "https://pubmed.ncbi.nlm.nih.gov/31959763/",
        availableData: [
            {name: 'rnaseq', datatype: 'RNA', source: ''}
        ]
    },
    {
        name: 'ICB_Jerby_Arnon',
        citation: "Jerby-arnon, L., et al. 2018. A Cancer Cell Program Promotes T Cell Exclusion and Resistance to Checkpoint Blockade. Cell, 2018. 175(4): p.984-997.e24.",
        link: 'https://pubmed.ncbi.nlm.nih.gov/30388455/',
        availableData: [
            {name: 'rnaseq', datatype: 'RNA', source: ''}
        ]
    },
    {
        name: 'ICB_Jung',
        citation: "	Jung, H., et al. 2019. DNA methylation loss promotes immune evasion of tumours with high mutation and copy number load. Nat Commun, 2019. 10(1): p.4278.",
        link: 'https://pubmed.ncbi.nlm.nih.gov/31537801/',
        availableData: [
            {name: 'rnaseq', datatype: 'RNA', source: ''},
            {name: 'cna', datatype: 'DNA', source: ''},
            {name: 'snv', datatype: 'DNA', source: ''}
        ]
    },
    {
        name: 'ICB_Miao1',
        citation: "Miao, D., et al. 2018. Genomic correlates of response to immune checkpoint therapies in clear cell renal cell carcinoma. Science, 2018. 359(6377): p.801-806.",
        link: 'https://pubmed.ncbi.nlm.nih.gov/29301960/',
        availableData: [
            {name: 'rnaseq', datatype: 'RNA', source: ''},
            {name: 'snv', datatype: 'DNA', source: ''}
        ]
    },
    {
        name: 'ICB_Riaz',
        citation: "Riaz, N., et al. 2015. Tumor and Microenvironment Evolution during Immunotherapy with Nivolumab. Cell, 2017. 171(4): p.934-949.e16.",
        link: 'https://pubmed.ncbi.nlm.nih.gov/29033130/',
        availableData: [
            
        ]
    },
    {
        name: 'ICB_Rizvi15',
        citation: "Rizvi, N.A., et al. 2015. Cancer immunology. Mutational landscape determines sensitivity to PD-1 blockade in non-small cell lung cancer. Science, 2015. 348(6230): p.124-8.",
        link: 'https://pubmed.ncbi.nlm.nih.gov/25765070/',
        availableData: [
            {name: 'cna', datatype: 'DNA', source: ''},
            {name: 'snv', datatype: 'DNA', source: ''}
        ]
    },
    {
        name: 'ICB_Rizvi18',
        citation: "Rizvi, H., et al. 2018. Molecular Determinants of Response to Anti-Programmed Cell Death (PD)-1 and Anti-Programmed Death-Ligand 1 (PD-L1) Blockade in Patients With Non-Small-Cell Lung Cancer Profiled With Targeted Next-Generation Sequencing. J Clin Oncol, 2018. 36(7): p. 633-641.",
        link: 'https://pubmed.ncbi.nlm.nih.gov/29337640/',
        availableData: [
            {name: 'cna', datatype: 'DNA', source: ''},
            {name: 'snv', datatype: 'DNA', source: ''} 
        ]
    },
    {
        name: 'ICB_Roh',
        citation: "Roh, W., et al. 2017. Integrated molecular analysis of tumor biopsies on sequential CTLA-4 and PD-1 blockade reveals markers of response and resistance. Sci Transl Med, 2017. 9(379).",
        link: 'https://pubmed.ncbi.nlm.nih.gov/28251903/',
        availableData: [
            {name: 'snv', datatype: 'DNA', source: ''}
        ]
    },
    {
        name: 'ICB_Samstein',
        citation: "Samstein, R.M., et al. 2019. Tumor mutational load predicts survival after immunotherapy across multiple cancer types. Nat Genet, 2019. 51(2): p.202-206.",
        link: 'https://pubmed.ncbi.nlm.nih.gov/30643254/',        
        availableData: [
            {name: 'cna', datatype: 'DNA', source: ''},
            {name: 'snv', datatype: 'DNA', source: ''} 
        ]
    }
]

const getDatasetNote = (name) => {
    return( {
        citations: datasets.filter(item => item.name === name).map(item => item.citation),
        name: name,
        disclaimer: `The ${name} data were re-processed and shared by the Haibe-Kains Lab (University Health Network). The Haibe-Kains Lab has re-annotated the data to maximize overlap with other clinical datasets.`,
        usagePolicy: "The data is under <a href='https://creativecommons.org/licenses/by/4.0/'>Creative Commons Attribution 4.0 International License</a> provided.<br />Source: <a href='https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=gse15471'>https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=gse15471</a>",
    });
}

(async () => {
    try{
        await mongoose.connect(process.env.DEV, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('connection open');
        // let datasets = await Dataset.find({datasetType: 'clinical_icb'});
        // let objInfo = fs.readFileSync('../data/new_obj.json');
        // objInfo = JSON.parse(objInfo);
        // let dataObjects = [];
        
        // for(const dataset of datasets){
        //     let obj = objInfo.find(item => item.pipeline.name === dataset.name);
        //     const info = {
        //         date: {created: obj.process_end_date},
        //         status: "complete",
        //         private: false,
        //         canonical: true,
        //         numDownload: 0,
        //         createdBy: "BHK Lab",
        //         other: {
        //             pipeline: {url: obj.pipeline.git_url, commit_id: obj.commit_id},
        //             additionalRepo: obj.additional_repo
        //         }
        //     }
        //     dataObjects.push({
        //         info: info,
        //         datasetType: 'clinical_icb',
        //         name: dataset.name,
        //         dataset: dataset._id,
        //         repositories: [
        //             {version: '1.0', doi: obj.doi, downloadLink: obj.download_link}
        //         ],
        //         availableDatatypes: dataset.availableData.map(item => ({name: item.name, genomeType: item.datatype}))
        //     })
        // }

        // await ObjSchema.BaseDataObject.insertMany(dataObjects)

        // await ObjSchema.BaseDataObject.deleteMany({datasetType: 'clinical_icb'})
    }catch(err){
        console.log(err);
    }finally{
        await mongoose.connection.close();
        console.log('connection closed');
    }
})();