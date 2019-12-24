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
                autosize: false, 
                width: 520, 
                height: 450, 
                title: this.props.title, 
                yaxis: {autorange: 'reversed'}, 
                titlefont: {size: 18, color: '#3D405A'}, 
                font:{color: '#3D405A'}
            } }
          />
        );
    }
}

export default DownloadChart;