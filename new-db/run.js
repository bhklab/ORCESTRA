const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../.env')});
const mongoose = require('mongoose');
const fs = require('fs');

const DatasetNote = require('./models/dataset-note');
const Dataset = require('./models/dataset');
const DataFilter = require('./models/data-filter');
const ObjSchema = require('./models/data-object');
const User = require('./models/user');

(async () => {
    try{
        await mongoose.connect(process.env.DEV, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('connection open');
        

        // let oldusers = fs.readFileSync('./data/user.json');
        // oldusers = JSON.parse(oldusers);

        // let users = oldusers.map(user => ({
        //     email: user.username,
        //     password: user.password,
        //     registered: user.registered,
        //     pwdReset: {
        //         expire: user.expire,
        //         token: user.resetToken
        //     },
        //     userDataObjects: user.userDatasets.map(item => mongoose.Types.ObjectId(item))
        // }));

        // await User.insertMany(users);

    }catch(err){
        console.log(err);
    }finally{
        await mongoose.connection.close();
        console.log('connection closed');
    }
})();

// (async () => {
//     try{
//         await mongoose.connect(process.env.DEV, { useNewUrlParser: true, useUnifiedTopology: true });
//         console.log('connection open');

//         let formdata = fs.readFileSync('./data/formdata.json');
//         formdata = JSON.parse(formdata);

//         let datasettype = 'clinicalgenomics';
//         formdata = formdata.find(item => item.datasetType === datasettype);

//         let oldobjects = fs.readFileSync(`./data/${datasettype}.json`);
//         oldobjects = JSON.parse(oldobjects);

//         let datasets = await Dataset.find({datasetType: datasettype});

//         let objects = [];
//         for(oldobj of oldobjects){

//             let dataset = datasets.find(item => item.name === oldobj.dataset.name && oldobj.dataset.versionInfo);
//             if(dataset){

//                 datatypes = oldobj.dataType.map(item => {
//                     if(item.microarrayType){
//                         item.details = {
//                             microarrayType: item.microarrayType
//                         }
//                     }
//                     return {
//                         name: item.name,
//                         genomeType: item.type,
//                         details: item.details 
//                     };
//                 });

//                 let repo = {
//                     version: '1.0',
//                     doi: oldobj.doi,
//                     bioComputeObj: oldobj.bioComputeObject ? oldobj.bioComputeObject : undefined
//                 }

//                 if(Array.isArray(oldobj.downloadLink)){
//                     repo.downloadLink = oldobj.downloadLink.map(item => ({
//                         name: item.name,
//                         link: item.downloadLink
//                     }));
//                 }else{
//                     repo.downloadLink = oldobj.downloadLink;
//                 }

//                 let object = {
//                     _id: mongoose.Types.ObjectId(oldobj._id),
//                     datasetType: datasettype,
//                     name: oldobj.name,
//                     dataset: dataset._id,
//                     info: {
//                         status: oldobj.status,
//                         private: oldobj.private,
//                         canonical: oldobj.canonical,
//                         numDownload: oldobj.download,
//                         createdBy: oldobj.createdBy,
//                         email: oldobj.email,
//                         shareToken: oldobj.shareToken,
//                         filteredSensitivity: oldobj.dataset.filteredSensitivity,
//                         commitID: oldobj.commitID,
//                         date: {
//                             submitted: oldobj.dateSubmitted,
//                             processed: oldobj.dateProcessed,
//                             completed: oldobj.dateCompleted
//                         },
//                     },
//                     repositories: [repo],
//                     availableDatatypes: datatypes,
//                     // tools: {
//                     //     rna: oldobj.rnaTool.length > 0 ? oldobj.rnaTool[0].name : undefined,
//                     // },
//                     // references: {
//                     //     rna: oldobj.rnaRef.length > 0 ? oldobj.rnaRef[0].name : undefined,
//                     // },
//                     // genome: oldobj.genome.name
//                 }
//                 objects.push(object);
//                 // console.log(object)
//             }else{
//                 console.log(`${oldobj.dataset.name}_${oldobj.dataset.versionInfo} not found`)
//             }
//         }
//         await ObjSchema.BaseDataObject.insertMany(objects);
//         // await ObjSchema.DataObject.deleteMany();
//     }catch(err){
//         console.log(err);
//     }finally{
//         await mongoose.connection.close();
//         console.log('connection closed');
//     }
// })();

// (async () => {
//     try{
//         await mongoose.connect(process.env.DEV, { useNewUrlParser: true, useUnifiedTopology: true });
//         console.log('connection open');

//         let formdata = fs.readFileSync('./data/formdata.json');
//         formdata = JSON.parse(formdata);

//         let datasettype = 'pset';
//         formdata = formdata.find(item => item.datasetType === datasettype);

//         let tools = formdata.rnaTool.map(item => ({
//             ...item,
//             genomicType: 'RNA'
//         }));
//         tools = tools.concat(formdata.dnaTool.map(item => ({
//             ...item,
//             genomicType: 'DNA'
//         })));
        
//         let datafilter = new DataFilter({
//             datasetType: datasettype,
//             tools: tools,
//             references: formdata.rnaRef.map(item => ({
//                 ...item,
//                 genomicType: 'RNA'
//             })),
//             genome: formdata.genome.map(item => item.name),
//             availableData: formdata.molecularData.map(item => ({
//                 ...item,
//                 genomicType: item.type,
//             }))
//         });

//         await datafilter.save();

//     }catch(err){
//         console.log(err);
//     }finally{
//         await mongoose.connection.close();
//         console.log('connection closed');
//     }
// })();

// (async () => {
//     try{
//         await mongoose.connect(process.env.DEV, { useNewUrlParser: true, useUnifiedTopology: true });
//         console.log('connection open');

//         let formdata = fs.readFileSync('./data/formdata.json');
//         formdata = JSON.parse(formdata);
//         let datasetnotes = await DatasetNote.find().lean();
//         let metricdata = fs.readFileSync('./data/metric-data.json');
//         metricdata = JSON.parse(metricdata);

//         let datasettype = 'clinicalgenomics';
//         formdata = formdata.find(item => item.datasetType === datasettype);
//         let datasets = [];
//         for(let dset of formdata.dataset){
            
//             let availableData = [];
//             // availableData = availableData.concat(formdata.accompanyRNA.filter(item => item.dataset === dset.name).map(item => ({
//             //     name: item.name,
//             //     datatype: 'RNA',
//             //     source: item.source
//             // })));
//             // availableData = availableData.concat(formdata.accompanyDNA.filter(item => item.dataset === dset.name).map(item => ({
//             //     name: item.name,
//             //     datatype: 'DNA',
//             //     source: item.source
//             // })));

//             if(dset.name === 'GDSC'){
//                 availableData = availableData.filter(item => item.name !== 'mutation');
//                 let mutation = formdata.accompanyDNA.find(item => item.dataset === 'GDSC' && item.name === 'mutation');
//                 let mut = mutation.source.find(item => item.name === 'mutation');
//                 let mutEx = mutation.source.find(item => item.name === 'mutation_exome');
//                 availableData.push({
//                     name: 'mutation',
//                     datatype: 'DNA',
//                     source: mut.source
//                 });
//                 availableData.push({
//                     name: 'mutationExome',
//                     datatype: 'DNA',
//                     source: mutEx.source
//                 })
//             }

//             let metricdataset = metricdata.find(item => item.name === dset.name);

//             for(let version of dset.versions){

//                 // add additional available data
//                 if(version.rawSeqDataRNA && version.rawSeqDataRNA.length > 0){
//                     availableData.push({
//                         name: 'rnaseq',
//                         datatype: 'RNA',
//                         source: version.rawSeqDataRNA,
//                     });
//                 }
//                 if(version.processedDataSource && version.processedDataSource.length > 0){
//                     availableData.push({
//                         name: 'rnaseqProcessed',
//                         datatype: 'RNA',
//                         source: version.processedDataSource,
//                     });
//                 }
//                 if(version.rawSeqDataDNA && version.rawSeqDataDNA.length > 0){
//                     availableData.push({
//                         name: 'dnaseq',
//                         datatype: 'DNA',
//                         source: version.rawSeqDataDNA,
//                     });
//                 }

//                 // toxicoset
//                 // availableData.push({
//                 //     name: 'rawMicroarray',
//                 //     source: version.data.rawMicroarrayData
//                 // });

//                 metrics = null;
//                 let stats = undefined;
//                 let releaseNotes = undefined;
//                 if(metricdataset){
//                     metrics = metricdataset.versions.find(item => item.version === version.version);
//                     // stats = {
//                     //     cellLines: metrics.cellLines.current,
//                     //     drugs: metrics.drugs.current,
//                     //     tissues: metrics.tissues,
//                     //     numCellLineDrugPairs: metrics.cellLineDrugPairs,
//                     //     numGenes: metrics.genes
//                     // };
//                     // availableData.forEach(item => {
//                     //     let moldataname = item.name === 'rnaseq' ? 'rnaSeq' : item.name;
//                     //     let moldata = metrics.releaseNotes.molData[moldataname];
//                     //     item.expCount = moldata ? moldata.count : null;
//                     //     item.noUpdates = moldata ? moldata.noUpdates : null;
//                     // });
//                     releaseNotes = {
//                         counts: [
//                             {...metrics.releaseNotes.samples, name: 'samples'},
//                             // {...metrics.releaseNotes.radiationTypes, name: 'radiationTypes'},
//                             // {...metrics.releaseNotes.patients, name: 'patients'},
//                             // {...metrics.releaseNotes.models, name: 'models'},
//                             // {...metrics.releaseNotes.drugs, name: 'drugs'},
//                             // {...metrics.releaseNotes.experiments, name: 'experiments'},
//                             // {...metrics.releaseNotes.cellLines, name: 'cellLines'},
//                             // {...metrics.releaseNotes.drugs, name: 'drugs'},
//                             // {...metrics.releaseNotes.experiments, name: 'experiments'},
//                         ],
//                         additional: metrics.releaseNotes.additional ? {newsLink: metrics.releaseNotes.additional} : undefined
//                     }
//                 }
                
//                 // dataset notes
//                 let name = dset.name;
//                 switch(name){
//                     case 'GDSC':
//                         name = name + version.version.split('v')[1].slice(0, 1);
//                         break;
//                     case 'Open TG-GATEs Human':
//                         name = 'Open TG-GATEs';
//                         break;
//                     case 'Open TG-GATEs Rat':
//                         name = 'Open TG-GATEs';
//                         break;
//                     case 'DrugMatrix Rat':
//                         name = 'DrugMatrix';
//                         break;
//                     default:
//                         break;
//                 }
//                 let datasetnote = datasetnotes.find(item => item.name === name);

//                 let dataset = {
//                     name: dset.name,
//                     version: version.version,
//                     datasetType: datasettype,
//                     status: {
//                         unavailable: dset.unavailable,
//                         disabled: dset.disabled,
//                         requestDisabled: dset.requestDisabled
//                     },
//                     publications: version.publication,
//                     sensitivity: version.drugSensitivity,
//                     // sensitivity: version.data.drugResponseData,
//                     availableData: availableData,
//                     datasetNote: datasetnote ? datasetnote._id : undefined,
//                     stats: stats,
//                     releaseNotes: releaseNotes
//                 }
//                 datasets.push(dataset);
//             }
//         }
//         // console.log(datasets);
//         // await Dataset.insertMany(datasets);
//         // await Dataset.deleteMany();
//     }catch(err){
//         console.log(err);
//     }finally{
//         await mongoose.connection.close();
//         console.log('connection closed');
//     }
// })();