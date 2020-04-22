import React, {useEffect, useState} from 'react';
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import {Checkbox} from 'primereact/checkbox';
import {RadioButton} from 'primereact/radiobutton';
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

    const [data, setData] = useState([])
    const [barData, setBarData] = useState([])
    const [parameters, setParameters] = useState({
        datasets: {},
        metricName: ''
    })
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
        setParameters({
            datasets: {...datasets},
            metricName: 'numCellLines' 
        })
        setIsReady(true)
    }, [])

    useEffect(() => {
        if(isReady){
            let datasets = []
            for(let i = 0; i < props.chartData.length; i++){
                for(let j = 0; j < props.chartData[i].versions.length; j++){
                    if(parameters.datasets[props.chartData[i].name + '_' + j].checked){
                        datasets.push({
                            name: parameters.datasets[props.chartData[i].name + '_' + j].name,
                            value: props.chartData[i].versions[j].metric[parameters.metricName],
                            color: parameters.datasets[props.chartData[i].name + '_' + j].color
                        })
                    }
                }
            }

            datasets.sort((a, b) => (a.value > b.value) ? 1: -1)
            
            setData([{
                x: datasets.map((item) => {return item.value}),
                y: datasets.map((item) => {return item.name}),
                text: datasets.map((item) => {return (item.name + ': ' + item.value)}),
                mode: 'markers',
                type: 'scatter',
                marker: {
                    size: 12,
                    color: datasets.map((item) => {return item.color})
                },
                hoverinfo: 'text'
            }])

            let values = datasets.map((item) => {return item.value})
            let duplicates = [...new Set(values.filter((item, index) => values.indexOf(item) != index))]

            console.log(duplicates)

            let bars = []
            for(let i = 0; i < datasets.length; i++){
                bars.push({
                    x: [datasets[i].value, datasets[i].value],
                    y: [0, datasets[i].value],
                    name: datasets[i].name,
                    mode: 'lines+markers',
                    type: 'scatter',
                    line: {
                        color: duplicates.indexOf(datasets[i].value) < 0 ? datasets[i].color : '#777777',
                        width: 12
                    },
                    marker: {
                        color: duplicates.indexOf(datasets[i].value) < 0 ? datasets[i].color : '#777777',
                        symbol: 'line-ew',
                        size: 12
                    },
                })
            }

            setBarData(bars)
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
                            xaxis: {
                                showgrid: false,
                                zeroline: false,
                                showticklabels: false,
                                autorange: 'reversed',
                            },
                            yaxis: {
                                tickfont: {
                                    size: 12
                                },
                                showgrid: true,
                                showticklabels: true
                            },
                            margin: {t: 10, b: 0, l: 100, r: 10},
                            showlegend: false
                        } }
                        style = {{width: "100%", height: '250px', marginLeft: 'auto', marginRight: 'auto'}}
                        useResizeHandler = {true}
                        config = {{displayModeBar: false}}
                    />
                    <Plot
                        data= {data}
                        layout={ {
                            autosize: true,
                            xaxis: {
                                showgrid: false,
                                zeroline: false,
                                autorange: 'reversed',
                                showticklabels: false
                            },
                            yaxis: {
                                showgrid: true,
                                tickfont: {
                                    size: 12
                                },
                                showticklabels: true
                            },
                            margin: {t: 0, b: 10, l: 100, r: 10}
                        } }
                        style = {{width: "100%", height: '200px'}}
                        useResizeHandler = {true}
                        config = {{displayModeBar: false}}
                    />
                </div>
                <div className='stats-dataset-chart-control'>
                    <h4>Select Dataset(s) to View</h4>
                    {
                        Object.keys(parameters.datasets).map((key) => {
                            return(
                                <div className='stats-chart-control-checkbox' key={key}>
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