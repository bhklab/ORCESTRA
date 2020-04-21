import React, {useEffect, useState} from 'react';
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import {Checkbox} from 'primereact/checkbox';
const Plot = createPlotlyComponent(Plotly);


const DatasetChart = props => {

    const metricValues = {
        numCellLines: '<b>Number of <br />cell lines</b>', 
        numDrugs: '<b>Number of <br />drugs</b>',
        numDrugSensitivityExp: '<b>Number of <br />drug sensitivity <br />experiments</b>', 
        numGenes: '<b>Number of genes</b>'
    }

    const defColors = [
        '#1f77b4',  // muted blue
        '#ff7f0e',  // safety orange
        '#2ca02c',  // cooked asparagus green
        '#d62728',  // brick red
        '#9467bd',  // muted purple
        '#8c564b',  // chestnut brown
        '#e377c2',  // raspberry yogurt pink
        '#7f7f7f',  // middle gray
        '#bcbd22',  // curry yellow-green
        '#17becf'   // blue-teal
    ];

    const [data, setData] = useState([])
    const [parameters, setParameters] = useState({})
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        let datasets = {}
        let colIndex = 0
        for(let i = 0; i < props.chartData.length; i++){
            for(let j = 0; j < props.chartData[i].versions.length; j++){
                datasets[props.chartData[i].name + '_' + j] = {
                    name: props.chartData[i].name + ' ' + props.chartData[i].versions[j].drugSensitivity,
                    checked: props.chartData[i].versions[j].metric.numCellLines ? true : false,
                    color: defColors[colIndex < 9 ? colIndex : colIndex % 10]
                }
                colIndex++
            }
        }
        setParameters({...datasets, 
            numCellLines: {name: 'Numer of Cell Lines', checked: true, isMetric: true},
            numDrugs: {name: 'Numer of Drugs', checked: true, isMetric: true},
            numDrugSensitivityExp: {name: 'Numer of Drug Sensitivity Experiments', checked: false, isMetric: true},
            numGenes: {name: 'Numer of Genes', checked: false, isMetric: true}
        })
        setIsReady(true)
    }, [])

    useEffect(() => {
        if(isReady){
            let array = []
            for(let i = 0; i < props.chartData.length; i++){
                for(let j = 0; j < props.chartData[i].versions.length; j++){
                    let metric = props.chartData[i].versions[j].metric
                    if(parameters[props.chartData[i].name + '_' + j].checked && metric.numCellLines){
                        let selectedMetrics = []
                        let metricNames = []
                        if(parameters.numCellLines.checked) {
                            selectedMetrics.push(metric.numCellLines)
                            metricNames.push(metricValues.numCellLines)
                        }
                        if(parameters.numDrugs.checked) {
                            selectedMetrics.push(metric.numDrugs)
                            metricNames.push(metricValues.numDrugs)
                        }
                        if(parameters.numDrugSensitivityExp.checked) {
                            selectedMetrics.push(metric.numDrugSensitivityExp)
                            metricNames.push(metricValues.numDrugSensitivityExp)
                        }
                        if(parameters.numGenes.checked) {
                            selectedMetrics.push(metric.numGenes)
                            metricNames.push(metricValues.numGenes)
                        }
                        array.push({
                            y: metricNames,
                            x: selectedMetrics,
                            name: parameters[props.chartData[i].name + '_' + j].name,
                            mode: 'markers',
                            type: 'scatter',
                            marker: {
                                color: parameters[props.chartData[i].name + '_' + j].color,
                                size: []
                            }
                        })
                    }
                }
            }
            for(let i = 0; i < array.length; i++){
                for(let j = 0; j < array[i].x.length; j++){
                    let metricVals = array.map(item => {
                        return (item.x[j])
                    })
                    metricVals.sort(function(a, b){return a - b})
                    let index = metricVals.indexOf(array[i].x[j]) + 1
                    array[i].marker.size.push((1/metricVals.length) * index * 50)
                }
            }
            setData(array)
        }
    }, [parameters])
    
    return (
        <React.Fragment>
            <h4>Select Dataset Metrics to View</h4>
            <div className='stats-dataset-metric-control'>
                {
                    Object.keys(parameters).map((key) => {
                        if(parameters[key].isMetric){
                            return(
                                <div className='stats-chart-control-checkbox' key={key}>
                                    <Checkbox inputId={key} value={key} checked={parameters[key].checked}
                                        onChange={e => {
                                            let params = {...parameters}
                                            params[key].checked = e.checked
                                            setParameters(params)
                                        }
                                    }></Checkbox>
                                    <label htmlFor={key}>{parameters[key].name}</label>
                                </div>
                            )
                        }
                    })
                }
            </div>    
            <div className='stats-dataset-chart'>
                <div className='stats-dataset-plot'>
                    <Plot
                        data= {data}
                        layout={ {
                            autosize: true,
                            xaxis: {
                                showgrid: true
                            },
                            yaxis: {
                                automargin: true,
                                tickfont: {
                                    size: 14
                                },
                                showgrid: false
                            }
                        } }
                        style = {{width: "100%"}}
                        useResizeHandler = {true}
                    />
                </div>
                <div className='stats-dataset-chart-control'>
                    <h4>Select Dataset(s) to View</h4>
                    {
                        Object.keys(parameters).map((key) => {
                            if(!parameters[key].isMetric){
                                return(
                                    <div className='stats-chart-control-checkbox' key={key}>
                                        <Checkbox inputId={key} value={key} checked={parameters[key].checked}
                                            onChange={e => {
                                                let params = {...parameters}
                                                params[key].checked = e.checked
                                                setParameters(params)
                                            }
                                        }></Checkbox>
                                        <label htmlFor={key}>{parameters[key].name}</label>
                                    </div>
                                )
                            }
                        })
                    }
                </div>    
            </div>
        </React.Fragment>
    );
}

export default DatasetChart;