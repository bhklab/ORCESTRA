import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import {Checkbox} from 'primereact/checkbox';
import {RadioButton} from 'primereact/radiobutton';
import UpsetPlot from './UpsetPlot'
import Loader from 'react-loader-spinner';
const Plot = createPlotlyComponent(Plotly);

const DatasetChart = (props) => {
    const { metricDatasets } = props;
    const metricSet = [
        {name: 'Number of Cell Lines', value: 'cellLines'},
        {name: 'Number of Drugs', value: 'drugs'},
        {name: 'Number of Tissue Types', value: 'tissues'},
        {name: 'Number of Drug Experiments ', value: 'experiments'},
        {name: 'Number of Genes', value: 'genes'}
    ]
    const [upsetData, setUpsetData] = useState({})
    const [barData, setBarData] = useState([])
    const [parameters, setParameters] = useState({
        datasets: [],
        metricName: '',
        ready: false
    });
    const [isPlotReady, setIsPlotReady] = useState(false)

    useEffect(() => {
        const getData = async () => {
            setParameters({
                datasets: metricDatasets,
                metricName: 'cellLines',
                ready: true
            });
        } 
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const updateData = async () => {
            const res = await axios.get(
                '/api/view/statistics/upset-plot', 
                {params: {
                    metric: parameters.metricName, 
                    datasets: parameters.datasets.filter(dataset => dataset.checked).map(dataset => dataset.id)
                }}
            );
            if(parameters.metricName === 'cellLines' || parameters.metricName === 'drugs' || parameters.metricName === 'tissues'){
                let upsetData = res.data.upsetData;
                upsetData.sets = upsetData.sets.map(item => ({
                    ...item,
                    color: parameters.datasets.find(dataset => dataset.name === item.name).color
                }));
                let points = []
                let bars = []
                let data = upsetData.data
                console.log(upsetData)
                for(let i = 0; i < data.length; i++){
                    let datasets = []
                    let colors = []
                    for(let j = 0; j < data[i].setIndices.length; j++){
                        let index = data[i].setIndices[j]
                        datasets.push(upsetData.sets[index].name)
                        colors.push(upsetData.sets[index].color)
                    }
                    data[i].datasets = datasets
                    data[i].colors = colors
                }

                for(let i = 0; i < data.length; i++){

                    points.push({
                            x: new Array(data[i].datasets.length).fill(i),
                            y: data[i].datasets,
                            mode: data[i].datasets.length > 1 ? 'lines+markers' : 'markers',
                            type: 'scatter',
                            marker: {
                                size: 10,
                                color: data[i].colors
                            },
                            line: {
                                color: '#777777'
                            },
                            hoverinfo: 'text'
                    }) 

                    bars.push({
                            x: [i, i],
                            y: [0, data[i].names.length],
                            mode: 'markers+lines',
                            type: 'scatter',
                            line: {
                                color: data[i].colors.length > 1 ? '#777777' : data[i].colors[0],
                                width: 10
                            },
                            marker: {
                                color: data[i].colors.length > 1 ? '#777777' : data[i].colors[0],
                                symbol: 'line-ew',
                                size: 10
                            },
                            text: data[i].names.length,
                            hoverinfo: 'text'
                    })
                }
                setUpsetData({points: points, bars: bars});
            }else{
                let barData = res.data.barData;
                barData = barData.map(item => ({
                    ...item,
                    color: parameters.datasets.find(dataset => dataset.name === item.name).color
                }));
                barData.sort((a, b) => (a.value > b.value) ? 1: -1);
                setBarData([{
                    x: barData.map((item) => {return item.value}), 
                    y: barData.map((item) => {return item.name}), 
                    type: 'bar',
                    orientation: 'h',
                    marker: {
                        color: barData.map((item) => {return item.color})
                    }
                }])
            }
            setIsPlotReady(true)
        }
        setIsPlotReady(false)
        if(parameters.ready){
            console.log(parameters);
            updateData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                                <div>{metric.name}</div>
                            </div>
                        )
                    })
                }
            </div>    
            <div className='stats-dataset-chart'>
                {isPlotReady ? 
                    <div className='stats-dataset-plot'>
                        {
                            parameters.metricName === 'experiments' || parameters.metricName === 'cellLineDrugPairs' || parameters.metricName === 'genes' ?
                            <Plot
                                data= {barData}
                                layout={ {
                                    autosize: true,
                                    margin: {t: 50, b: 50, l: 130, r: 10},
                                    showlegend: false
                                } }
                                style = {{width: "100%", height: '300px'}}
                                useResizeHandler = {true}
                                config = {{displayModeBar: false}}
                            />
                            :
                            <UpsetPlot data={upsetData} />
                        }
                    </div>
                    :
                    <div className='componentLoaderContainer'>
                        <Loader type="ThreeDots" color="#3D405A" height={100} width={100} />
                    </div>
                }
                <div className='stats-dataset-chart-control'>
                    <h4>Select Dataset(s) to View</h4>
                    {
                        parameters.datasets.map((dataset) => {
                            return(
                                <div className='stats-chart-control-checkbox dataset-checkbox' key={dataset.name}>
                                    <Checkbox inputId={dataset.name} value={dataset.name} checked={dataset.checked}
                                        onChange={e => {
                                            let params = {...parameters}
                                            let index = params.datasets.findIndex(item => item.name === dataset.name)
                                            params.datasets[index].checked = e.checked
                                            setParameters(params)
                                        }
                                    }></Checkbox>
                                    <label htmlFor={dataset.name}>{dataset.name}</label>
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