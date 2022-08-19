const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../../.env')});
const mongoose = require('mongoose');
const fs = require('fs');
const axios = require('axios');
const converter = require('json-2-csv');

const DatasetNote = require('../models/dataset-note');
const Dataset = require('../models/dataset');
const DataFilter = require('../models/data-filter');
const DataObject = require('../models/data-object').DataObject;
const User = require('../models/user');
const PachydermPipeline = require('../models/pachyderm-pipeline');

(async () => {

    const gencode = {
        v40: 'https://github.com/BHKLAB-Pachyderm/Annotations/blob/master/Gencode.v40.annotation.RData',
        v19: 'https://github.com/BHKLAB-Pachyderm/Annotations/blob/master/Gencode.v19.annotation.RData'
    }

    try{
        await mongoose.connect(process.env.Prod, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('connection open');

        let rawseq_available = ['ICB_Gide', 'ICB_Hugo', 'ICB_Jung', 'ICB_Kim', 'ICB_Riaz'];

        let objects = await DataObject.find({datasetType: 'clinical_icb', 'info.private': false, 'info.canonical': true}).populate('dataset', {stats: 0}).lean();
        let output = objects.map(obj => {
            let repo = obj.repositories[0];
            return({
                name: obj.name,
                doi: repo.doi,
                download_link: repo.downloadLink,
                tsv_doi: '10.5281/zenodo.7007756',
                tsv_download_link: `https://zenodo.org/record/7007756/files/${obj.name}.zip?download=1`,
                ref_genome: obj.info.other.rna_ref,
                ref_genome_link: gencode[obj.info.other.rna_ref.split(' ')[1]],
                raw_seq_available: rawseq_available.includes(obj.name) ? 'Yes' : 'No',
                expr_gene_tpm: `Yes${rawseq_available.includes(obj.name) ? '' : '(expr)'}`,
                expr_gene_counts: rawseq_available.includes(obj.name) ? 'Yes' : 'No',
                expr_isoform_tpm: rawseq_available.includes(obj.name) ? 'Yes' : 'No',
                expr_isoform_counts: rawseq_available.includes(obj.name) ? 'Yes' : 'No',
                snv: obj.availableDatatypes.find(item => item.name === 'snv') ? 'Yes' : 'No',
                cna: obj.availableDatatypes.find(item => item.name === 'cna') ? 'Yes' : 'No',
                publication_link: obj.dataset.publications[0].link,
                curaition_pipeline: `${obj.info.other.pipeline.url.replace('.git', '/tree/')}${obj.info.other.pipeline.commit_id}`
            })
        });
        converter.json2csv(output, (err, csv) => {
            if (err) {
                throw err;
            }
            // print CSV string
            fs.writeFileSync('../data/dataset_summary.csv', csv);
        });
    }catch(err){
        console.log(err);
    }finally{
        await mongoose.connection.close();
        console.log('connection closed');
    }
})();