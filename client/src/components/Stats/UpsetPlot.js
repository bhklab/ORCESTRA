import React, {useEffect, useState} from 'react';
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import {makeUpset} from './MakeUpset'
const Plot = createPlotlyComponent(Plotly);

const UpsetPlot = (props) => {
    
    const [pointData, setPointData] = useState([])
    const [barData, setBarData] = useState([])

    useEffect(() => {

        async function getData(){
            const res = await fetch('/api/stats/upset')
            const json = await res.json()

            const result = makeUpset(json.sets, json.items)

            let points = []
            let bars = []
            
            for(let i = 0; i < result.length; i++){
                let datasets = []
                let colors = []
                for(let j = 0; j < result[i].set.length; j++){
                    let index = parseInt(result[i].set[j])
                    datasets.push(json.sets[index])
                    colors.push(props.colorCode[json.sets[index]])
                }
                result[i].datasets = datasets
                result[i].colors = colors
            }

            console.log(props.colorCode)

            for(let i = 0; i < result.length; i++){

                points.push({
                        x: new Array(result[i].datasets.length).fill(i),
                        y: result[i].datasets,
                        mode: result[i].datasets.length > 1 ? 'lines+markers' : 'markers',
                        type: 'scatter',
                        marker: {
                            size: 12,
                            color: result[i].colors
                        },
                        line: {
                            color: '#777777'
                        },
                        hoverinfo: 'text'
                }) 

                bars.push({
                        x: [i, i],
                        y: [0, result[i].names.length],
                        mode: 'markers+lines',
                        type: 'scatter',
                        line: {
                            color: result[i].colors.length > 1 ? '#777777' : result[i].colors[0],
                            width: 12
                        },
                        marker: {
                            color: result[i].colors.length > 1 ? '#777777' : result[i].colors[0],
                            symbol: 'line-ew',
                            size: 12
                        },
                })
            }

            setPointData(points)
            setBarData(bars)
        }

        getData()

    }, [])
    
    return(
        <div className='upsetPlot'>
            <Plot
                data= {barData}
                layout={ {
                    autosize: true,
                    xaxis: {
                        showgrid: false,
                        zeroline: false,
                        showticklabels: false,
                        range: [-1, barData.length + 1]
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
                style = {{width: '2000px', height: '250px'}}
                useResizeHandler = {true}
                config = {{displayModeBar: false}}
            />
            <Plot
                data= {pointData}
                layout={ {
                    autosize: true,
                    xaxis: {
                        showgrid: false,
                        zeroline: false,
                        showticklabels: false,
                        range: [-1, pointData.length + 1]
                    },
                    yaxis: {
                        showgrid: true,
                        tickfont: {
                            size: 12
                        },
                        showticklabels: true
                    },
                    margin: {t: 0, b: 10, l: 100, r: 10},
                    showlegend: false
                } }
                style = {{ width: '2000px', height: '200px'}}
                useResizeHandler = {true}
                config = {{displayModeBar: false}}
            />
        </div>
    )
}

export default UpsetPlot