const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../../.env')});
const mongoose = require('mongoose');
const fs = require('fs');
const axios = require('axios');
const converter = require('json-2-csv');

const DatasetNote = require('../models/dataset-note');
const Dataset = require('../models/dataset');
const DataFilter = require('../models/data-filter');
const ObjSchema = require('../models/data-object');
const User = require('../models/user');
const PachydermPipeline = require('../models/pachyderm-pipeline');

(async () => {

    try{
        await mongoose.connect(process.env.Prod, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('connection open');

        // const res = await axios.get('http://206.12.96.126/api/data_object/list?status=uploaded');
        // fs.writeFileSync('../data/snakemake_dataobjects.json', JSON.stringify(res.data.objects, null, 2));
        
        let objects = fs.readFileSync('../data/snakemake_dataobjects.json');
        objects = JSON.parse(objects);

        let pipeline_name = 'ICB_VanDenEnde';
        let dataobject = await ObjSchema.DataObject.findOne({name: pipeline_name}).lean();
        let snakemakeObject = objects.find(item => String(item._id) === '62fe5f8704ec1579b615f0dc');

        dataobject.info.other.pipeline = {
            url: snakemakeObject.pipeline.git_url,
            commit_id: snakemakeObject.commit_id
        };
        dataobject.info.other.additionalRepo = snakemakeObject.additional_repo;
        dataobject.info.other.rna_ref = 'Gencode v19';
        dataobject.repositories = [{
            version: '1.0',
            doi: snakemakeObject.doi,
            downloadLink: snakemakeObject.download_link
        }];
        
        // await ObjSchema.DataObject.updateOne(
        //     {name: pipeline_name}, 
        //     {
        //         'info.date.created': new Date(Date.now()),
        //         'info.private': false,
        //         'info.other': dataobject.info.other,
        //         repositories: dataobject.repositories 
        //     }
        // );
        
    }catch(err){
        console.log(err);
    }finally{
        await mongoose.connection.close();
        console.log('connection closed');
    }
})();