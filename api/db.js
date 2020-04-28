const mongo = require('../db/mongo');

module.exports = {
    getFormData: async function(req, res){
        const result = await mongo.selectFormData();
        if(result.status){
            res.send(result.data);
        }else{
            res.status(500).send(result.data);
        }
    },

    getDataForStats: async function(req, res){ 
        let data = {psets: [], chartData:[]}
        try{
            const form = await mongo.selectFormData()
            const dataset = form.data[0].dataset
            for(let i = 0; i < dataset.length; i++){
                let item = {
                    name: dataset[i].name,
                    versions: []
                }
                for(let j = 0; j < dataset[i].versions.length; j++){
                    item.versions.push({
                        drugSensitivity: dataset[i].versions[j].version,
                        metric: dataset[i].versions[j].metric
                    })
                }
                data.chartData.push(item)
            }

            const psets = await mongo.selectSortedPSets()
            for(let i = 0; i < psets.length; i++){
                data.psets.push({
                    download: psets[i].download,
                    name: psets[i].name,
                    dataset: psets[i].dataset.name,
                    version: psets[i].dataset.versionInfo.version
                })
            }
            res.send(data);
        }catch(error){
            console.log(error)
            res.status(500).send(error);
        }
    },

    getDataForUpsetPlot: async function(req, res){
        try{
            const intersections = await mongo.getMetricData()
            res.send(intersections)
        }catch(error){
            console.log(error)
            res.status(500).send(error)
        }
    },

    getLandingData: async function(req, res){
        const result = await mongo.getLandingData();
        if(result.status){
            res.send(result);
        }else{
            res.status(500).send(result);
        }
    }
}