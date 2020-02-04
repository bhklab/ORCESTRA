import React from 'react';

import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
const Plot = createPlotlyComponent(Plotly);

class DownloadChart extends React.Component{
    render() {
        let value = this.props.data.value;
        let name = this.props.data.name;
        
        return (
          <Plot
            data={[
                {
                    type: 'bar', 
                    x: value, 
                    y: name, 
                    orientation: 'h', 
                    marker: {color: '#3D405A'}
                },
            ]}
            layout={ {
                autosize: true,
                title: this.props.title, 
                xaxis: {
                    title: {text: 'Number of Downloads', font: {size: 14, color: '#3D405A'}}
                },
                yaxis: {
                    autorange: 'reversed',
                }, 
                titlefont: {size: 18, color: '#3D405A'}, 
                font:{color: '#3D405A'}
            } }
            style = {{width: "100%"}}
            useResizeHandler = {true}
          />
        );
    }
}

export default DownloadChart;