const mongo  = require('mongodb');
const mongoClient = mongo.MongoClient;
const path = require('path');
const fs = require('fs');

/**
 * Reads metrics files for each PSet.
 * Converts them to metrics objects.
 * Inserts the metrics data into metrics collection of MongoDB.
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
        GDSC1: {name: 'GDSC', version: '2019(v1)'},
        GDSC2: {name: 'GDSC', version: '2019(v2)'},
        GRAY2013: {name: 'GRAY', version: '2013'},
        GRAY2017: {name: 'GRAY', version: '2017'},
        UHNBreast: {name: 'UHNBreast', version: '2019'}
    }

    let metrics = [
        {name: 'CCLE', versions: [{version: '2015'}]},
        {name: 'CTRPv2', versions: [{version: '2015'}]},
        {name: 'FIMM', versions: [{version: '2016'}]},
        {name: 'gCSI', versions: [{version: '2017'}]},
        {name: 'GDSC', versions: [
            {version: '2019(v1)'}, 
            {version: '2019(v2)'}
        ]},
        {name: 'GRAY', versions: [
            {version: '2013'}, 
            {version: '2017'}
        ]},
        {name: 'UHNBreast', versions: [{version: '2019'}]}
    ]
    
    const metricsDir = path.join(__dirname, '../metrics')
    const dirs = fs.readdirSync(metricsDir)
    console.log(dirs)
    for(let i = 0; i < dirs.length; i++){
        let metric = metrics.filter(obj => {return obj.name === conversion[dirs[i]].name})[0]
        let version = metric.versions.filter((obj => {return obj.version === conversion[dirs[i]].version}))[0]
        const drugs = fs.readFileSync(path.join(metricsDir, dirs[i], 'drugs.txt'), 'UTF-8')
        const cellLines = fs.readFileSync(path.join(metricsDir, dirs[i], 'cell_lines.txt'), 'UTF-8')
        const tissues = fs.readFileSync(path.join(metricsDir, dirs[i], 'tissue.csv'), 'UTF-8')
        let genes = ''
        if(fs.existsSync(path.join(metricsDir, dirs[i], 'genes.txt'))){
            genes = fs.readFileSync(path.join(metricsDir, dirs[i], 'genes.txt'), 'UTF-8') 
        }
        version.drugs = drugs.split(/\r?\n/).filter((item) => {return item})
        version.cellLines = cellLines.split(/\r?\n/).filter((item) => {return item})
        version.cellLineDrugPairs = version.drugs.length * version.cellLines.length
        version.genes = genes.split(/\r?\n/).filter((item) => {return item}).length
        version.tissues = tissues.split(/\r?\n/).filter((item) => {return item})
    }

    for(let i = 0; i < metrics.length; i++){
        for(let j = 0; j < metrics[i].versions.length; j++){
            console.log(metrics[i].name + '_' + metrics[i].versions[j].version)
            console.log('\tNum Celllines: ' + metrics[i].versions[j].cellLines.length)
            console.log('\tNum Drugs: ' + metrics[i].versions[j].drugs.length)
            console.log('\tNum Cell Line Drug Pairs: ' + metrics[i].versions[j].cellLineDrugPairs)
            console.log('\tNum Genes: ' + metrics[i].versions[j].genes)
            console.log('\tNum Tissues: ' + metrics[i].versions[j].tissues.length)
        }
    }

    let client = {}

    try{
        client = await mongoClient.connect(connStr, {useNewUrlParser: true, useUnifiedTopology: true})
        const db = client.db(dbName)
        const metricData = db.collection('metric-data');
        await metricData.deleteMany({})
        await metricData.insertMany(metrics);
        client.close()
    }catch(err){
        console.log(err)
        client.close()
    }
}

module.exports = {
    insertMetricData
}