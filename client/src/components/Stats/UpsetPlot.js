import React from 'react';
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
const Plot = createPlotlyComponent(Plotly);

const UpsetPlot = (props) => {

    return(
        <div className='upsetPlot'>
            {
                Object.keys(props.data).length && 
                <React.Fragment>
                    <Plot
                        data= {props.data.bars}
                        layout={ {
                            autosize: true,
                            xaxis: {
                                showgrid: false,
                                zeroline: false,
                                showticklabels: false,
                                range: [-1, props.data.bars.length + 1]
                            },
                            yaxis: {
                                tickfont: {
                                    size: 12
                                },
                                showgrid: true,
                                showticklabels: true
                            },
                            margin: {t: 10, b: 0, l: 120, r: 10},
                            showlegend: false
                        } }
                        style = {{width: '2000px', height: '250px'}}
                        useResizeHandler = {true}
                        config = {{displayModeBar: false}}
                    />
                    <Plot
                        data= {props.data.points}
                        layout={ {
                            autosize: true,
                            xaxis: {
                                showgrid: false,
                                zeroline: false,
                                showticklabels: false,
                                range: [-1, props.data.points.length + 1]
                            },
                            yaxis: {
                                showgrid: true,
                                tickfont: {
                                    size: 12
                                },
                                showticklabels: true
                            },
                            margin: {t: 0, b: 10, l: 120, r: 10},
                            showlegend: false
                        } }
                        style = {{ width: '2000px', height: '200px'}}
                        useResizeHandler = {true}
                        config = {{displayModeBar: false}}
                    />
                </React.Fragment>
            }
        </div>
    )
}

export default UpsetPlot