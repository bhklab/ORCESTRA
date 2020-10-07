const mongo  = require('mongodb');
const mongoClient = mongo.MongoClient;
const path = require('path');
const fs = require('fs');
const csv = require('csvtojson');

/**
 * Reads metrics files for each PSet.
 * Converts them to metrics objects.
 * Inserts the metrics data into metric-data collection of MongoDB.
 * @param {string} connStr connection string for the db
 * @param {string} dbName name of the database.
 * @param {string} metricsDir Directory where the metrics files are stored
 */
const insertMetricData = async function(connStr, dbName, metricsDir){
    const conversion = {
        CCLE: {name: 'CCLE', version: '2015'},
        CTRPv2: {name: 'CTRPv2', version: '2015'},
        FIMM: {name: 'FIMM', version: '2016'},
        gCSI: {name: 'gCSI', version: '2017'},
        GDSC180: {name: 'GDSC', version: '2020(v1-8.0)'},
        GDSC280: {name: 'GDSC', version: '2020(v2-8.0)'},
        GDSC182: {name: 'GDSC', version: '2020(v1-8.2)'},
        GDSC282: {name: 'GDSC', version: '2020(v2-8.2)'},
        GRAY2013: {name: 'GRAY', version: '2013'},
        GRAY2017: {name: 'GRAY', version: '2017'},
        UHNBreast: {name: 'UHNBreast', version: '2019'}
    }

    const metricsType = ['cells', 'drugs', 'experiments'];
    const metricsGroup = ['current', 'new', 'removed'];

    let datasets = [
        {name: 'CCLE', versions: [{version: '2015'}]},
        {name: 'CTRPv2', versions: [{version: '2015'}]},
        {name: 'FIMM', versions: [{version: '2016'}]},
        {name: 'gCSI', versions: [{version: '2017'}]},
        {name: 'GDSC', versions: [
            {version: '2020(v1-8.0)'}, 
            {version: '2020(v2-8.0)'},
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
    console.log(dirs);
    for(let i = 0; i < dirs.length; i++){
        let dataset = datasets.filter(obj => {return obj.name === conversion[dirs[i]].name})[0]
        let version = dataset.versions.filter((obj => {return obj.version === conversion[dirs[i]].version}))[0]

        metricsType.forEach(type => {
            version[type === 'cells' ? 'cellLines' : type] = {current: [], new: [], removed: []};

            metricsGroup.forEach(async (group) => {
                let ext = (group === 'current' && type === 'experiments')  ? 'csv' : 'txt'; // get extension for the file depending on the metric type and group
                let filePath = path.join(metricsDir, dirs[i], `${group}_${type}.${ext}`);
                
                // If the file exists, read file and assign to respective properties in version
                if(fs.existsSync(filePath)){
                    
                    // For current_experiments file, read in the CSV file and parse each row into objects
                    if(group === 'current' && type === 'experiments'){
                        const csvjson = await csv().fromFile(filePath);
                        version[type][group] = csvjson.map(row => ({
                            experimentID: row['experiment_ID'],
                            cellLine: row['cellline'],
                            drug: row['drug'],
                            concRangeMin: parseFloat(row['concentration_range(min)']),
                            concRangeMax: parseFloat(row['concentration_range(max)'])
                        }));
                    }else{
                        // read in the text file and split line by line.
                        let data = fs.readFileSync(filePath, 'UTF-8');
                        version[type === 'cells' ? 'cellLines' : type][group] = data.split(/\r?\n/).filter((item) => {return item});
                    }
                    
                }
            })
            
        });

        //const drugs = fs.readFileSync(path.join(metricsDir, dirs[i], 'drugs.txt'), 'UTF-8')
        //const cellLines = fs.readFileSync(path.join(metricsDir, dirs[i], 'cell_lines.txt'), 'UTF-8')
        // const tissues = fs.readFileSync(path.join(metricsDir, dirs[i], 'tissue.txt'), 'UTF-8')

        // let genes = ''
        // if(fs.existsSync(path.join(metricsDir, dirs[i], 'genes.txt'))){
        //     genes = fs.readFileSync(path.join(metricsDir, dirs[i], 'genes.txt'), 'UTF-8') 
        // }

        // version.drugs = drugs.split(/\r?\n/).filter((item) => {return item})
        // version.cellLines = cellLines.split(/\r?\n/).filter((item) => {return item})
        // version.cellLineDrugPairs = version.drugs.length * version.cellLines.length
        // version.genes = genes.split(/\r?\n/).filter((item) => {return item}).length
        // version.tissues = tissues.split(/\r?\n/).filter((item) => {return item})
    }

    let client = {}

    try{
        client = await mongoClient.connect(connStr, {useNewUrlParser: true, useUnifiedTopology: true})
        const db = client.db(dbName)
        const metricData = db.collection('metric-data');
        let oldData = await metricData.find({}).toArray();

        datasets.forEach(dataset => {
            let old = oldData.find(od => (od.name === dataset.name));
            dataset.versions.forEach(version => {
                let oldVer = old.versions.find(ov => (ov.version === version.version));
                if(oldVer){
                    version.cellLineDrugPairs = oldVer.cellLineDrugPairs;
                    version.genes = oldVer.genes;
                    version.tissues = oldVer.tissues;
                }
            });
        })
        

        await metricData.deleteMany({});
        await metricData.insertMany(datasets);
        
        client.close()
    }catch(err){
        console.log(err);
        client.close()
    }
}

module.exports = {
    insertMetricData
}