/**
 * Script used to back up current instance of database data.
 * Extracts everything in the database and stores data in json files in the 'data' folder.
 */

 const path = require('path');
 require('dotenv').config({path: path.join(__dirname, '../.env')});
 const fs = require('fs');

const DataObect = require('../models/data-object').DataObject;
const Dataset = require('../models/dataset');
const DatasetNote = require('../models/dataset-note');
const DataFilter = require('../models/data-filter');
const User = require('../models/user');
const PachydermPipeline = require('../models/pachyderm-pipeline');

const backup = async (Model, outputPath) => {
    const data = await Model.find().lean();
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
};