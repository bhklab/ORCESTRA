const mongo  = require('mongodb');
const mongoClient = mongo.MongoClient;
const path = require('path');
const fs = require('fs');
const csv = require('csvtojson');

const conversion = {
    CCLE: {name: 'CCLE', version: '2015'},
    CTRPv2: {name: 'CTRPv2', version: '2015'},
    FIMM: {name: 'FIMM', version: '2016'},
    gCSI: {name: 'gCSI', version: '2017'},
    GDSC180: {name: 'GDSC', version: '2019(v1-8.0)'},
    GDSC280: {name: 'GDSC', version: '2019(v2-8.0)'},
    GDSC182: {name: 'GDSC', version: '2020(v1-8.2)'},
    GDSC282: {name: 'GDSC', version: '2020(v2-8.2)'},
    GRAY2013: {name: 'GRAY', version: '2013'},
    GRAY2017: {name: 'GRAY', version: '2017'},
    UHNBreast: {name: 'UHNBreast', version: '2019'}
}

const metricsType = ['cells', 'drugs', 'experiments'];
const metricsGroup = ['current', 'new', 'removed'];

/**
 * Reads metrics files for each PSet.
 * Converts them to metrics objects.
 * Inserts the metrics data into metric-data collection of MongoDB.
 * @param {string} connStr connection string for the db
 * @param {string} dbName name of the database.
 * @param {string} metricsDir Directory where the metrics files are stored
 */
const insertMetricData = async function(connStr, dbName, metricsDir){
    let client = {}
    try{
        let datasets = [
            {name: 'CCLE', versions: [{version: '2015'}]},
            {name: 'CTRPv2', versions: [{version: '2015'}]},
            {name: 'FIMM', versions: [{version: '2016'}]},
            {name: 'gCSI', versions: [{version: '2017'}]},
            {name: 'GDSC', versions: [
                {version: '2019(v1-8.0)'}, 
                {version: '2019(v2-8.0)'},
                {version: '2020(v1-8.2)'}, 
                {version: '2020(v2-8.2)'}
            ]},
            {name: 'GRAY', versions: [
                {version: '2013'},
                {version: '2017'}
            ]},
            {name: 'UHNBreast', versions: [{version: '2019'}]}
        ]
        
        // read the release notes directory
        const dirs = fs.readdirSync(metricsDir);
        for(let i = 0; i < dirs.length; i++){
            console.log(dirs[i])
            let dataset = datasets.find(obj => {return obj.name === conversion[dirs[i]].name});
            let version = dataset.versions.find((obj => {return obj.version === conversion[dirs[i]].version}));
            for(const type of metricsType){
                version[type === 'cells' ? 'cellLines' : type] = {current: [], new: [], removed: []};
                for(const group of metricsGroup){
                    let filePath = path.join(metricsDir, dirs[i], `${group}_${type}.txt`);

                    // If the file exists, read file and assign to respective properties in version
                    if(fs.existsSync(filePath)){
                        // read in the text file and split line by line.
                        let data = fs.readFileSync(filePath, 'UTF-8');
                        version[type === 'cells' ? 'cellLines' : type][group] = data.split(/\r?\n/).filter((item) => {return item});
                    }
                }
            }
    
            /**
            *  parse molecular data section
            */
            version.molData = {}
    
            let filePath = path.join(metricsDir, dirs[i], 'notes.txt');
            let data = fs.readFileSync(filePath, 'UTF-8');
    
            let molData = data.split('#molecular data')[1].split(/\r?\n/).filter((item) => {return item});
            molData.forEach(line => {
                let split = line.split(': ');
                let molDataType = split[0].trim();
    
                switch(molDataType){
                    case 'RNA-seq':
                        version.molData.rnaSeq = split[1].trim();
                        break;
                    case 'Microarray':
                        version.molData.microarray = split[1].trim();
                        break;
                    case 'Mutation':
                        version.molData.mutation = split[1].trim();
                        break;
                    case 'Mutation(Exome)':
                        version.molData.mutationExome = split[1].trim();
                        break;
                    case 'CNV': 
                        version.molData.cnv = split[1].trim();
                        break;
                    case 'Fusion':
                        version.molData.fusion = split[1].trim();
                        break;
                    case 'Methylation':
                        version.molData.methylation = split[1].trim();
                        break;
                    default:
                        break;
                }
            });
        }

        client = await mongoClient.connect(connStr, {useNewUrlParser: true, useUnifiedTopology: true})
        const db = client.db(dbName)
        const metricData = db.collection('metric-data');
        let oldData = await metricData.find({}).toArray();

        datasets.forEach(dataset => {
            let old = oldData.find(od => (od.name === dataset.name));
            if(old){
                dataset.versions.forEach(version => {
                    let oldVer = old.versions.find(ov => (ov.version === version.version));
                    if(oldVer){
                        version.cellLineDrugPairs = oldVer.cellLineDrugPairs;
                        version.genes = oldVer.genes;
                        version.tissues = oldVer.tissues;
                    }
                });
            }
        })
    
        await metricData.deleteMany({});
        await metricData.insertMany(datasets);   
        
        client.close()
    }catch(err){
        console.log(err);
        client.close()
    }
}

const makeCurrentExpJsonFile = async function(metricsDir){
    const dirs = fs.readdirSync(metricsDir);
    for(let i = 0; i < dirs.length; i++){
        let json = [];
        let filePath = path.join(metricsDir, dirs[i], `current_experiments.csv`);
        let dataset = conversion[dirs[i]];
        // If the file exists, read file and assign to respective properties in version
        if(fs.existsSync(filePath)){
            const csvjson = await csv().fromFile(filePath);
            json = csvjson.map(row => ({
                experimentID: row['experiment_ID'],
                cellLine: row['cellline'],
                drug: row['drug'],
                concRangeMin: parseFloat(row['concentration_range(min)']),
                concRangeMax: parseFloat(row['concentration_range(max)'])
            }));
            fs.writeFileSync(path.join(__dirname, '../db', 'current-experiments-csv', `${dataset.name}_${dataset.version}_current_experiments.json`), JSON.stringify(json));
        }

        // const data = fs.readFileSync(path.join(__dirname, '../db', 'current-experiments-csv', `${dataset.name}_${dataset.version}_current_experiments.json`), 'utf8');
        // const jsonArray = JSON.parse(data);
        // console.log(jsonArray);

    }    
}

const addReleaseNotes = async function(connStr, dbName, metricsDir){
    const metricsType = ['cellLines', 'drugs', 'experiments'];
    let client;

    try{
        client = await mongoClient.connect(connStr, {useNewUrlParser: true, useUnifiedTopology: true})
        const db = client.db(dbName)
        const metricData = db.collection('metric-data');
        let datasets = await metricData.find({}).toArray();
        
        for(let dataset of datasets){
            for(let version of dataset.versions){
                let newMoldata = {rnaSeq: {}, microarray: {}, mutation: {}, mutationExome: {}, cnv: {}, fusion: {}, methylation: {}};
                for(const key of Object.keys(version.molData)){
                    let text = version.molData[key];
                    let num = parseInt(text.split(' ')[0]);
                    newMoldata[key].available = isNaN(num) ? false : true;
                    newMoldata[key].count = isNaN(num) ? 0 : num;
                    newMoldata[key].noUpdates = text.includes('no updates from previous version') ? true : false;
                }
                let releaseNotes = {cellLines: {}, drugs: {}, experiments: {}, molData: newMoldata};
                //let releaseNotes = version.releaseNotes;
                for(const type of metricsType){
                    let numbers = {current: 0, new: 0, removed: 0};
                    for(const group of metricsGroup){
                        if(type === 'experiments' && group === 'current'){
                            const data = fs.readFileSync(path.join(__dirname, '../db', 'current-experiments-csv', `${dataset.name}_${version.version}_current_experiments.json`), 'utf8');
                            numbers[group] = data.length
                        }else{
                            numbers[group] = version[type][group].length;
                        }
                        
                    }
                    releaseNotes[type] = numbers;
                }
                delete version.molData;

                if(dataset.name === 'GDSC'){
                    releaseNotes.additional = {link: 'https://www.cancerrxgene.org/news'}
                }

                version.releaseNotes = releaseNotes;
                console.log(version.releaseNotes);
            }
        }

        await metricData.deleteMany({});
        await metricData.insertMany(datasets); 

        client.close();
    }catch(error){
        console.log(error);
        client.close();
    }
}

module.exports = {
    insertMetricData,
    makeCurrentExpJsonFile,
    addReleaseNotes
}