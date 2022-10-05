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

    try{
        await mongoose.connect(process.env.Prod, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('connection open');

        let dataObjects = fs.readFileSync('../data/new-data-objects.json');
        dataObjects = JSON.parse(dataObjects);
        let newDataObj = fs.readFileSync('../data/new-data-obj.json');
        newDataObj = JSON.parse(newDataObj);

        for(let obj of dataObjects){
            let dataset = await Dataset.findOne({name: obj.name});
            const res = await axios.get(
                'http://206.12.96.126/api/data_object/list', 
                {params: {pipeline_name: obj.name, latest: true}}
            );
            let pipelineRun = res.data.object;
            obj.dataset = dataset._id;
            obj.date_created = pipelineRun.process_end_date;
            obj.pipeline = {
                url: pipelineRun.pipeline.git_url,
                commit_id: pipelineRun.commit_id
            },
            obj.repositories = [{
                version: '1.0',
                doi: pipelineRun.doi,
                downloadLink: pipelineRun.download_link
            }]
        }

        dataObjects = dataObjects.map(obj => ({
            ...newDataObj,
            name: obj.name,
            dataset: obj.dataset,
            info: {
                ...newDataObj.info,
                date: {
                    created: obj.date_created
                },
                other: {
                    pipeline: obj.pipeline
                },
            },
            repositories: obj.repositories
        }));
        console.log(dataObjects)
        await DataObject.insertMany(dataObjects);

    }catch(err){
        console.log(err);
    }finally{
        await mongoose.connection.close();
        console.log('connection closed');
    }
})();