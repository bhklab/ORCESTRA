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

const restore = async (file, Model) => {
    await Model.deleteMany();
    let data = fs.readFileSync(file);
    data = JSON.parse(data);
    data = data.map(item => ({...item, _id: mongoose.Types.ObjectId(item._id)}));
    await Model.insertMany(data);
}

(async () => {
    try{
        await mongoose.connect(process.env.DEV, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('connection open');
        
        await restore('../data/datafilters.json', DataFilter);

        await restore('../data/datasetnotes.json', DatasetNote);

        await restore('../data/datasets.json', Dataset);

        await restore('../data/pachydermpipelines.json', PachydermPipeline);

        await restore('../data/dataobjects.json', DataObject);

        await restore('../data/users.json', User);

    }catch(err){
        console.log(err);
    }finally{
        await mongoose.connection.close();
        console.log('connection closed');
    }
})();