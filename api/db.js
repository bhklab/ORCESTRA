const mongo = require('../db/mongo');
const upset = require('../helper/upset');

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

            // const psets = await mongo.selectSortedPSets()
            // for(let i = 0; i < psets.length; i++){
            //     data.psets.push({
            //         download: psets[i].download,
            //         name: psets[i].name,
            //         dataset: psets[i].dataset.name,
            //         version: psets[i].dataset.versionInfo.version
            //     })
            // }
            const canDataset = await mongo.getCanonicalPSets()
            let psets = []
            for(let i = 0; i < canDataset.length; i++){
                if(canDataset[i].dataset === 'GDSC'){
                    for(let j = 0; j < canDataset[i].canonicals.length; j++){
                        let canDownload = canDataset[i].canonicals[j].download
                        let version = canDataset[i].canonicals[j].dataset.versionInfo.version.match(/\((.*?)\)/)
                        let v = version[1].split('-')[0] 
                        for(let k = 0; k < canDataset[i].nonCanonicals.length; k++){
                            let nonCanVersion = canDataset[i].nonCanonicals[k].dataset.versionInfo.version.match(/\((.*?)\)/)
                            if(nonCanVersion[1].split('-')[0] === v){
                                canDownload += canDataset[i].nonCanonicals[k].download
                            }
                        }
                        canDataset[i].canonicals[j].download = canDownload
                        psets.push({
                            download: canDataset[i].canonicals[0].download,
                            name: canDataset[i].canonicals[0].name,
                            doi: canDataset[i].canonicals[0].doi,
                            dataset: canDataset[i].canonicals[0].dataset.name,
                            version: canDataset[i].canonicals[0].dataset.versionInfo.version
                        })
                    }
                }else{
                    let canDownload = canDataset[i].canonicals[0].download

                    for(let j = 0; j < canDataset[i].nonCanonicals.length; j++){
                        canDownload += canDataset[i].nonCanonicals[j].download
                    }
                    canDataset[i].canonicals[0].download = canDownload
                    psets.push({
                        download: canDataset[i].canonicals[0].download,
                        name: canDataset[i].canonicals[0].name,
                        doi: canDataset[i].canonicals[0].doi,
                        dataset: canDataset[i].canonicals[0].dataset.name,
                        version: canDataset[i].canonicals[0].dataset.versionInfo.version
                    })
                }
            }
            psets.sort((a, b) => (a.download < b.download) ? 1 : -1)
            data.psets = psets;
            res.send(data);
        }catch(error){
            console.log(error)
            res.status(500).send(error);
        }
    },

    getMetricData: async function(req, res){
        try{
            console.log(req.body.parameters.metricName)
            
            const metricType = req.body.parameters.metricName
            const datasets = req.body.parameters.datasets
            const queryDatasets = datasets.map((item) => {return item.dataset})
            const metricData = await mongo.getMetricData(metricType, queryDatasets)
            const queryDatasetNames = datasets.map((item) => {if(item.checked){return item.name}})

            console.log('data returned')
            
            let barData = []
            let sets = []
            let items = []
            
            for(let i = 0; i < metricData.length; i++){
                for(let j = 0; j < metricData[i].versions.length; j++){
                    const name = metricData[i].name + '_' + metricData[i].versions[j].version
                    if(queryDatasetNames.indexOf(name) > -1){
                        let dset = datasets.find(item => {return item.name === name})
                        if(metricType === 'cellLineDrugPairs' || metricType === 'genes'){
                            barData.push({
                                name: name,
                                value: metricData[i].versions[j][metricType],
                                color: dset.color
                            })
                        }else{
                            sets.push({name: name, color: dset.color})
                            items.push(metricData[i].versions[j][metricType])
                        }
                    }
                }
            }

            let upsetData = []
            if(metricType === 'cellLines' || metricType === 'drugs' || metricType === 'tissues'){
                upsetData = upset.makeUpset(sets, items)
                for(let i = 0; i < upsetData.length; i++){
                    upsetData[i].setIndices = upsetData[i].setIndices.split('-').filter(x=>x).map(s => {return parseInt(s)})
                }
            }
            
            res.send({
                barData: barData,
                upsetData: {
                    sets: sets,
                    data: upsetData
                }
            })
        }catch(error){
            console.log(error)
            res.status(500).send(error)
        }
    },

    getMetricDataOptions: async function(req, res){
        try{
             // plot colors to be used to color code each set. These are 20 randomly generated colors.
            const defColors = [
                '#1f77b4','#ff7f0e','#2ca02c','#d62728','#9467bd','#8c564b','#e377c2','#6fbd22','#bcbd22','#17becf','#222AA1','#7DC922','#03F14A','#2F0248','#D31E70','#370E0F','#101A21','#FF9585','#BE93F6','#1CF4A5','#DACC14','#BB012F','#62AD27','#49947F','#A817D1','#159326','#652CBF','#1922A7','#2FC186','#6A0570'
            ]
            
            const data = await mongo.getAvailableDatasetForMetrics()
            let datasets = []
            let colIndex = 0
            for(let i = 0; i < data.length; i++){
                for(let j = 0; j < data[i].versions.length; j++){
                    datasets.push({
                        name: data[i].name + "_" + data[i].versions[j].version,
                        dataset: data[i].name,
                        version: data[i].versions[j].version,
                        checked: true,
                        color: defColors[colIndex]
                    })
                    colIndex++
                }
            }
            res.send(datasets)
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