const formdata = require('../../db/helper/formdata');
const metricdata = require('../../db/helper/metricdata');
const psetCanonical = require('../../db/helper/pset-canonical');
const upset = require('../../helper/upset');

module.exports = {
    getFormData: async function(req, res){
        try{
            let form = {dataType: [], dataset: [], genome: [], rnaTool: [], rnaRef: [], accompanyRNA: [], accompanyDNA: [], dnaTool: [], dnaRef: []}
            const meta = await formdata.getFormData();

            meta.dataset.forEach((ds) => {form.dataset.push({
                label: ds.label,
                name: ds.name,
                versions: ds.versions.map(version => {return {version: version.version, label: version.label, disabled: version.disabled}}),
                unavailable: ds.unavailable
            })})
            form.genome = meta.genome
            form.rnaTool = meta.rnaTool.map(tool => {return {label: tool.label, name: tool.name}})
            form.rnaRef = meta.rnaRef.map(ref => {return {label: ref.label, name: ref.name, genome: ref.genome}})
            form.dnaTool = meta.dnaTool.map(tool => {return {label: tool.label, name: tool.name}})
            form.dnaRef = meta.dnaRef.map(ref => {return {label: ref.label, name: ref.name, genome: ref.genome}})
            form.dataType = meta.molecularData
            form.accompanyRNA = meta.accompanyRNA.map(acc => {return({label: acc.label, name: acc.name, dataset: acc.dataset})})
            form.accompanyDNA = meta.accompanyDNA.map(acc => {return({label: acc.label, name: acc.name, dataset: acc.dataset})})

            res.send(form);
        }catch(error){
            console.log(error)
            res.status(500).send(error);
        }
    },

    getDataForStats: async function(req, res){ 
        let data = {psets: [], chartData:[]}
        try{
            const form = await formdata.getFormData()
            const dataset = form.dataset
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
            data.psets = await psetCanonical.getCanonicalDownloadRanking();
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
            const queryDatasetNames = datasets.map((item) => {if(item.checked){return item.name}})

            const metricData = await metricdata.getMetricData(metricType, queryDatasets)
            
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
            
            const data = await metricdata.getAvailableDatasetForMetrics()
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
        const result = await metricdata.getLandingData();
        if(result.status){
            res.send(result);
        }else{
            res.status(500).send(result);
        }
    }
}