const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const mongoose = require("mongoose");
const fs = require("fs");
const axios = require("axios");
const converter = require("json-2-csv");

const DatasetNote = require("../models/dataset-note");
const Dataset = require("../models/dataset");
const DataFilter = require("../models/data-filter");
const DataObject = require("../models/data-object").DataObject;
const User = require("../models/user");
const PachydermPipeline = require("../models/pachyderm-pipeline");

(async () => {
  try {
    await mongoose.connect(process.env.Prod, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connection open");

    // const res = await axios.get(
    //   "http://206.12.96.126/api/data_object/list?status=uploaded"
    // );
    // let objects = res.data.objects;
    // objects = objects.filter((obj) =>
    //   obj.process_end_date.includes("2022-12-01")
    // );
    // console.log(objects);

    // for (const obj of objects) {
    //   let repositories = [
    //     {
    //       version: "1.0",
    //       doi: obj.doi,
    //       downloadLink: obj.download_link,
    //     },
    //   ];
    //   console.log(repositories);
    //   await DataObject.updateOne(
    //     { name: obj.pipeline.name },
    //     { repositories: repositories }
    //   );
    // }

    // Add new datasets notes
    // let datasetNotes = fs.readFileSync("../data/new-dataset-note.json");
    // datasetNotes = JSON.parse(datasetNotes);
    // await DatasetNote.insertMany(datasetNotes);

    // Add new datasets
    // let datasets = fs.readFileSync("../data/new-datasets.json");
    // datasets = JSON.parse(datasets);
    // let datasetStructure = fs.readFileSync("../data/new-dataset.json");
    // datasetStructure = JSON.parse(datasetStructure);
    // let inserted = [];
    // for (let dataset of datasets) {
    //   let datasetNote = await DatasetNote.findOne({ name: dataset.name });
    //   inserted.push({
    //     ...datasetStructure,
    //     name: dataset.name,
    //     publications: dataset.publications,
    //     datasetNote: datasetNote._id,
    //     survival: {
    //       recistCriteria: true,
    //       clinicalEndpoints: "PFS",
    //     },
    //   });
    // }
    // await Dataset.insertMany(inserted);

    // Add new data objects
    // let dataObjects = fs.readFileSync("../data/new-data-objects.json");
    // dataObjects = JSON.parse(dataObjects);
    // let dataObjStructure = fs.readFileSync("../data/new-data-obj.json");
    // dataObjStructure = JSON.parse(dataObjStructure);

    // for (let obj of dataObjects) {
    //   let dataset = await Dataset.findOne({ name: obj.name });
    //   const res = await axios.get("http://206.12.96.126/api/data_object/list", {
    //     params: { pipeline_name: obj.name, latest: true },
    //   });
    //   let pipelineRun = res.data.object;
    //   obj.dataset = dataset._id;
    //   obj.date_created = pipelineRun.process_end_date;
    //   obj.pipeline = {
    //     url: pipelineRun.pipeline.git_url,
    //     commit_id: pipelineRun.commit_id,
    //   };
    //   obj.additionalRepo = pipelineRun.additional_repo;
    //   obj.repositories = [
    //     {
    //       version: "1.0",
    //       doi: pipelineRun.doi,
    //       downloadLink: pipelineRun.download_link,
    //     },
    //   ];
    // }

    // dataObjects = dataObjects.map((obj) => ({
    //   ...dataObjStructure,
    //   name: obj.name,
    //   dataset: obj.dataset,
    //   info: {
    //     ...dataObjStructure.info,
    //     date: {
    //       created: obj.date_created,
    //     },
    //     other: {
    //       pipeline: obj.pipeline,
    //       additionalRepo: obj.additionalRepo,
    //       rna_ref: "Gencode v40",
    //     },
    //   },
    //   repositories: obj.repositories,
    //   availableDatatypes: obj.availableDatatypes,
    // }));
    // console.log(dataObjects);
    // await DataObject.insertMany(dataObjects);

    // used to update pipeline version and zenodo repo versions when a data object pipeline is executed with update pipeline.
    // let objects = await DataObject.find({ datasetType: "clinical_icb" }).lean();
    // for (let obj of objects) {
    //   const res = await axios.get("http://206.12.96.126/api/data_object/list", {
    //     params: { pipeline_name: obj.name, latest: true },
    //   });
    //   let pipelineRun = res.data.object;
    //   obj.info.date.created = pipelineRun.process_end_date;
    //   obj.info.other.pipeline = {
    //     url: pipelineRun.pipeline.git_url,
    //     commit_id: pipelineRun.commit_id,
    //   };
    //   obj.info.other.additionalRepo = pipelineRun.additional_repo;
    //   obj.repositories = [
    //     {
    //       version: "1.0",
    //       doi: pipelineRun.doi,
    //       downloadLink: pipelineRun.download_link,
    //     },
    //   ];
    //   await DataObject.updateOne(
    //     { name: obj.name },
    //     { info: obj.info, repositories: obj.repositories }
    //   );
    // }
  } catch (err) {
    console.log(err);
  } finally {
    await mongoose.connection.close();
    console.log("connection closed");
  }
})();
