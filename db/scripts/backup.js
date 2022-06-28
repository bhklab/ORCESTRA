/**
 * Script used to back up current instance of database data.
 * Extracts everything in the database and stores data in json files in the 'data' folder.
 */

 const path = require('path');
 require('dotenv').config({path: path.join(__dirname, '../../.env')});
 const fs = require('fs');
 const mongoose = require('mongoose');

const DataObject = require('../models/data-object').DataObject;
const Dataset = require('../models/dataset');
const DatasetNote = require('../models/dataset-note');
const DataFilter = require('../models/data-filter');
const User = require('../models/user');
const PachydermPipeline = require('../models/pachyderm-pipeline');

const backup = async (outputPath, Model) => {
    const data = await Model.find().lean();
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
};

(async () => {
    try{
        await mongoose.connect(process.env.Prod, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('connection open');

        await backup('../data/dataobjects.json', DataObject);

        await backup('../data/datasets.json', Dataset);

        await backup('../data/datasetnotes.json', DatasetNote);

        // await backup('../data/datafilters.json', DataFilter);

        // await backup('../data/users.json', User);

        // await backup('../data/pachydermpipelines.json', PachydermPipeline);
    }catch(err){
        console.log(err);
    }finally{
        await mongoose.connection.close();
        console.log('connection closed');
    }
 })();