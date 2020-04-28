import React, {useEffect, useState} from 'react';
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import {Checkbox} from 'primereact/checkbox';
import {RadioButton} from 'primereact/radiobutton';
import {makeUpset} from './MakeUpset'
import UpsetPlot from './UpsetPlot'
const Plot = createPlotlyComponent(Plotly);

const DatasetChart = props => {
    const defColors = [
        '#1f77b4',  // muted blue
        '#ff7f0e',  // safety orange
        '#2ca02c',  // cooked asparagus green
        '#d62728',  // brick red
        '#9467bd',  // muted purple
        '#8c564b',  // chestnut brown
        '#e377c2',  // raspberry yogurt pink
        '#6fbd22',  // 
        '#bcbd22',  // curry yellow-green
        '#17becf'   // blue-teal
    ]

    const metricSet = [
        {name: 'Numer of Cell Lines', value: 'numCellLines'},
        {name: 'Numer of Drugs', value: 'numDrugs'},
        {name: 'Numer of Drug Sensitivity Experiments', value: 'numDrugSensitivityExp'},
        {name: 'Numer of Genes', value: 'numGenes'}
    ]

    const [barData, setBarData] = useState([])
    const [parameters, setParameters] = useState({
        datasets: {},
        metricName: ''
    })
    const [isReady, setIsReady] = useState(false)
    const [isPlotReady, setIsPlotReady] = useState(false)

    const [colorCode, setColorCode] = useState({})

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
        setParameters({
            datasets: {...datasets},
            metricName: 'numCellLines' 
        })
        setIsReady(true)
    }, [])

    useEffect(() => {
        if(isReady){
            let datasets = []
            let datasetColors = {}
            for(let i = 0; i < props.chartData.length; i++){
                for(let j = 0; j < props.chartData[i].versions.length; j++){
                    if(parameters.datasets[props.chartData[i].name + '_' + j].checked){
                        datasets.push({
                            name: parameters.datasets[props.chartData[i].name + '_' + j].name,
                            value: props.chartData[i].versions[j].metric[parameters.metricName],
                            color: parameters.datasets[props.chartData[i].name + '_' + j].color
                        })
                        datasetColors[parameters.datasets[props.chartData[i].name + '_' + j].name.split(' ').join('_')] = parameters.datasets[props.chartData[i].name + '_' + j].color
                    }
                }
            }

            datasets.sort((a, b) => (a.value > b.value) ? 1: -1)

            setBarData([{
                x: datasets.map((item) => {return item.value}), 
                y: datasets.map((item) => {return item.name}), 
                type: 'bar',
                orientation: 'h',
                marker: {
                    color: datasets.map((item) => {return item.color})
                }
            }])

            setColorCode(datasetColors)
            setIsPlotReady(true)
        }
    }, [parameters])
    
    return (
        <React.Fragment>
            <h4>Select Dataset Metrics to View</h4>
            <div className='stats-dataset-metric-control'>
                {
                    metricSet.map((metric) => {
                        return(
                            <div className='stats-chart-control-checkbox' key={metric.value}>
                                <RadioButton inputId={metric.name} value={metric.value} checked={parameters.metricName === metric.value}
                                    onChange={e => {
                                        let params = {...parameters}
                                        params.metricName = e.value
                                        setParameters(params)
                                    }
                                }></RadioButton>
                                <label htmlFor={metric.value}>{metric.name}</label>
                            </div>
                        )
                    })
                }
            </div>    
            <div className='stats-dataset-chart'>
                <div className='stats-dataset-plot'>
                    <Plot
                        data= {barData}
                        layout={ {
                            autosize: true,
                            margin: {t: 50, b: 50, l: 100, r: 10},
                            showlegend: false
                        } }
                        style = {{width: "100%", height: '300px'}}
                        useResizeHandler = {true}
                        config = {{displayModeBar: false}}
                    />
                    {isPlotReady && <UpsetPlot colorCode={colorCode} />}
                </div>
                <div className='stats-dataset-chart-control'>
                    <h4>Select Dataset(s) to View</h4>
                    {
                        Object.keys(parameters.datasets).map((key) => {
                            return(
                                <div className='stats-chart-control-checkbox dataset-checkbox' key={key}>
                                    <Checkbox inputId={key} value={key} checked={parameters.datasets[key].checked}
                                        onChange={e => {
                                            let params = {...parameters}
                                            params.datasets[key].checked = e.checked
                                            setParameters(params)
                                        }
                                    }></Checkbox>
                                    <label htmlFor={key}>{parameters.datasets[key].name}</label>
                                </div>
                            )
                        })
                    }
                </div>  
            </div>
        </React.Fragment>
    );
}

export default DatasetChart;