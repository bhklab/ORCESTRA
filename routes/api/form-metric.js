/**
 * Module that includes functions to get formdata and PSet metric data for various usage in the web app.
 */
const formdata = require('../../db/helper/formdata');
const metricdata = require('../../db/helper/metricdata');
const datasetCanonical = require('../../db/helper/dataset-canonical');
const upset = require('../../helper/upset');
const enums = require('../../helper/enum');

/**
 * Retrieves a formData object from DB, and parses it into arrays of parameter options so that it can be used in drowndown selections.
 * @param {*} req 
 * @param {*} res 
 */
 const getFormData = async (req, res) => {
    console.log(req.params.datasetType);

    try{
        let form = {dataType: [], dataset: [], genome: [], rnaTool: [], rnaRef: [], dnaTool: [], dnaRef: []}
        const result = await formdata.getFormData(req.params.datasetType);
        result.dataset.forEach((ds) => {
            form.dataset.push({
                label: ds.label,
                name: ds.name,
                versions: ds.versions.map(version => {return {version: version.version, label: version.label, disabled: version.disabled}}),
                accompanyData: [],
                unavailable: ds.unavailable
            });
        });
        if(req.params.datasetType === enums.dataTypes.pharmacogenomics){
            form.dataset.forEach(dataset => {
                let accompanyRNA = result.accompanyRNA.filter(item => item.dataset === dataset.name);
                let accompanyDNA = result.accompanyDNA.filter(item => item.dataset === dataset.name);
                let accompanyData = accompanyRNA.concat(accompanyDNA);
                dataset.accompanyData = accompanyData.map(item => ({ 
                    label: item.label, 
                    name: item.name, 
                    dataset: item.dataset, 
                    options: item.options,
                    hidden: false
                }));
            });
            form.genome = result.genome;
            form.rnaTool = result.rnaTool.map(tool => ({label: tool.label, name: tool.name}));
            form.rnaRef = result.rnaRef.map(ref => ({label: ref.label, name: ref.name, genome: ref.genome, hidden: false}));
            form.dnaTool = result.dnaTool.map(tool => ({label: tool.label, name: tool.name, hidden: false}));
            form.dnaRef = result.dnaRef.map(ref => ({label: ref.label, name: ref.name, genome: ref.genome, hidden: false}));
            form.dataType = result.molecularData.map(moldata => ({...moldata, hidden: false}));
        }
        res.send(form);
    }catch(error){
        console.log(error)
        res.status(500).send(error);
    }
}

/**
 * Retrieves formdata and statistics data.
 * @param {*} req 
 * @param {*} res 
 */
 const getDataForStats = async (req, res) => { 
    let data = {psets: [], chartData:[]}
    try{
        const form = await formdata.getFormData(req.params.datasetType)
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
        data.psets = await datasetCanonical.getCanonicalDownloadRanking(req.params.datasetType);
        res.send(data);
    }catch(error){
        console.log(error)
        res.status(500).send(error);
    }
}

/**
 * Retrieves PSet metric data, and parses it into a format used for the upset plot
 * @param {*} req 
 * @param {*} res 
 */
 const getMetricData = async (req, res) => {
    try{
        console.log(`form-metric.getMetricData: ${req.body.parameters.metricName}`);
        
        const metricType = req.body.parameters.metricName;
        const datasets = req.body.parameters.datasets;
        const queryDatasets = [...new Set(datasets.map((item) => (item.dataset)))];
        const queryDatasetNames = datasets.map((item) => {if(item.checked){return item.name}});

        const metricData = await metricdata.getMetricData('pset', metricType, queryDatasets, false);
        
        let barData = [];
        let sets = [];
        let items = [];

        metricData.forEach(metric => {
            metric.versions.forEach(version => {
                if(datasets.find(ds => (ds.version, version.version))){
                    const name = `${metric.name}_${version.version}`;
                    if(queryDatasetNames.indexOf(name) > -1){
                        let dset = datasets.find(item => {return item.name === name})
                        if(metricType === 'genes' || metricType === 'experiments'){
                            barData.push({
                                name: name,
                                value: metricType === 'experiments' ? version.releaseNotes[metricType].current : version[metricType],
                                color: dset.color
                            });
                        }else{
                            sets.push({name: name, color: dset.color});
                            items.push(
                                metricType === 'tissues' ? version[metricType] : version[metricType].current
                            );
                        }
                    }
                }
            });
        });

        // parse data to be used for the upset plot if the data metric type is one of cell lines, drugs and tissues.
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
}

/**
 * Retrieves available datasets to be displayed in the upset plot and parses it into an array of objects that contain required metadata to render the plot.
 * Currently, the datasets that are used for canonical PSets are returned.
 * @param {*} req 
 * @param {*} res 
 */
 const getMetricDataOptions = async (req, res) => {
    try{
         // plot colors to be used to color code each set. These are 20 randomly generated colors.
        const defColors = [
            '#1f77b4','#ff7f0e','#2ca02c','#d62728','#9467bd','#8c564b','#e377c2','#6fbd22','#bcbd22','#17becf','#222AA1','#7DC922','#03F14A','#2F0248','#D31E70','#370E0F','#101A21','#FF9585','#BE93F6','#1CF4A5','#DACC14','#BB012F','#62AD27','#49947F','#A817D1','#159326','#652CBF','#1922A7','#2FC186','#6A0570'
        ];
        
        let data = await metricdata.getAvailableDatasetForMetrics();
        console.log(data);
        // parses available dataset into an array of objects that can be used for upset plot rendering
        const datasets = data.map((d, i) => ({
            name: d.name + "_" + d.version,
            dataset: d.name,
            version: d.version,
            checked: true, // checked it set to true to display dataset metrics for all of the available datasets.
            color: defColors[i] // used for upset plot
        }));

        res.send(datasets);
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

/**
 * Retrieves all the data to be rendered on the landing page.
 * @param {*} req 
 * @param {*} res 
 */
 const getLandingData = async (req, res) => {
    const result = await metricdata.getLandingData(req.params.datasetType);
    if(result.status){
        res.send(result);
    }else{
        res.status(500).send(result);
    }
}

module.exports = {
    getFormData,
    getDataForStats,
    getMetricData,
    getMetricDataOptions,
    getLandingData
}