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

(async () => {

    try{
        await mongoose.connect(process.env.Prod, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('connection open');

        let datasets = await Dataset.find({datasetType: 'clinical_icb'});
        let objInfo = fs.readFileSync('../data/new_obj.json');
        objInfo = JSON.parse(objInfo);
        let dataObjects = [];
        
        for(const dataset of datasets){
            let obj = objInfo.find(item => item.pipeline.name === dataset.name);
            if(obj){
                const info = {
                    date: {created: obj.process_end_date},
                    status: "complete",
                    private: true,
                    canonical: true,
                    numDownload: 0,
                    createdBy: "BHK Lab",
                    other: {
                        pipeline: {url: obj.pipeline.git_url, commit_id: ""},
                        additionalRepo: obj.additional_repo
                    }
                }
                dataObjects.push({
                    info: info,
                    datasetType: 'clinical_icb',
                    name: dataset.name,
                    dataset: dataset._id,
                    repositories: [
                        {version: '1.0', doi: obj.doi, downloadLink: obj.download_link}
                    ],
                    availableDatatypes: dataset.availableData.map(item => ({name: item.name, genomeType: item.datatype}))
                })
            }
        }

        // console.log(dataObjects)

        await ObjSchema.BaseDataObject.insertMany(dataObjects)

        // await ObjSchema.BaseDataObject.deleteMany({datasetType: 'clinical_icb'})
    }catch(err){
        console.log(err);
    }finally{
        await mongoose.connection.close();
        console.log('connection closed');
    }
})();