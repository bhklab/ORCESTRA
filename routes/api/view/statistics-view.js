const mongoose = require('mongoose');
const DataObject = require('../../../db/models/data-object').DataObject;
const Dataset = require('../../../db/models/dataset');
const dataObjectHelper = require('../../../helper/data-object');
const upset = require('../../../helper/upset');
require('../../../db/models/dataset');

const get = async (req, res) => {
    let result = {
        downloads: [],
        metricDatasets: []
    };
    try{
        const dataObjects = await DataObject.find({
            datasetType: req.query.datasetType,
            'info.private': false,
            'info.status': 'complete',
            'info.canonical': true
        }).lean().populate('dataset', 'name version');

        result.downloads = dataObjects.map(obj => {
            let repoVer = dataObjectHelper.getDataVersion(req.query.datasetType);
            let repo = obj.repositories.find(repo => repo.version === repoVer);
            if(repo){
                return({
                    download: obj.info.numDownload,
                    name: obj.name,
                    doi: repo.doi,
                    dataset: obj.dataset.name,
                    version: obj.dataset.version
                });
            }else{
                return undefined
            }
        });
        result.downloads = result.downloads.filter(item => typeof item !== 'undefined');
        result.downloads.sort((a, b) => b.download - a.download);

        // plot colors to be used to color code each set. These are 20 randomly generated colors.
        const defColors = [
            '#1f77b4','#ff7f0e','#2ca02c','#d62728','#9467bd','#8c564b','#e377c2','#6fbd22','#bcbd22','#17becf','#222AA1','#7DC922','#03F14A','#2F0248','#D31E70','#370E0F','#101A21','#FF9585','#BE93F6','#1CF4A5','#DACC14','#BB012F','#62AD27','#49947F','#A817D1','#159326','#652CBF','#1922A7','#2FC186','#6A0570'
        ];
        const datasets = await Dataset.find({_id: {$in: dataObjects.map(obj => obj.dataset._id)}}).select({name: 1, version: 1});
        result.metricDatasets = datasets.map((obj, i) => ({
            id: obj._id,
            name: `${obj.name}_${obj.version}`,
            dataset: obj.name,
            version: obj.version,
            checked: true, // checked it set to true to display dataset metrics for all of the available datasets.
            color: defColors[i] // used for upset plot
        }));
        result.metricDatasets.sort((a, b) => a.name.localeCompare(b.name));
    }catch(error){
        console.log(error);
        res.status(500);
    }finally{
        res.send(result);
    }
}

const upsetPlot = async (req, res) => {
    let result = {
        barData: [],
        upsetData: {}
    };
    try{
        const metricType = req.query.metric;
        const metricData = await Dataset
            .find({_id: {$in: req.query.datasets.map(id => mongoose.Types.ObjectId(id))} })
            .select({name: 1, version: 1, stats: 1, releaseNotes: 1});
        
        let barData = [];
        let sets = [];
        let items = [];

        for(let metric of metricData){
            const name = `${metric.name}_${metric.version}`;
            switch(metricType){
                case 'genes':
                    barData.push({
                        name: name,
                        value: metric.stats.numGenes ? metric.stats.numGenes : 0,
                    });
                    break;
                case 'experiments':
                    let found = metric.releaseNotes.counts.find(item => item.name === 'experiments');
                    barData.push({
                        name: name,
                        value: found && found.current ? found.current : 0,
                    });
                    break;
                default: 
                    sets.push({name: name});
                    items.push(metric.stats[metricType] ? metric.stats[metricType] : []);
                    break;
            }
        }

        // parse data to be used for the upset plot if the data metric type is one of cell lines, drugs and tissues.
        let upsetData = []
        if(metricType === 'cellLines' || metricType === 'drugs' || metricType === 'tissues'){
            upsetData = upset.makeUpset(sets, items)
            for(let i = 0; i < upsetData.length; i++){
                upsetData[i].setIndices = upsetData[i].setIndices.split('-').filter(x=>x).map(s => {return parseInt(s)})
            }
        }
        
        result = {
            barData: barData,
            upsetData: {
                sets: sets,
                data: upsetData
            }
        };
    }catch(error){
        console.log(error);
        res.status(500);
    }finally{
        res.send(result);
    }
}

module.exports = {
    get,
    upsetPlot
}