import React from 'react';
import * as d3 from 'd3';

class DownloadChart extends React.Component{
    constructor(){
        super();
        this.drawChart = this.drawChart.bind(this);
        this.width=500;
        this.height=500;
        
        this.name = ['A', 'B', 'C', 'D', 'E'];
        this.data = [
            {name: 'A', value: 10},
            {name: 'B', value: 40},
            {name: 'C', value: 30},
            {name: 'D', value: 60},
            {name: 'E', value: 30}
        ];
    }

    componentDidMount(){
        this.drawChart();
    }

    drawChart(){
        var bandScale = d3.scaleBand()
            .domain(this.name)
            .range([0, this.width])
            .paddingInner(0.05);

        const svg = d3.select("#chart")
                        .append("svg")
                        .attr("width", this.width)
                        .attr("height", this.height);
                  
        svg.selectAll("rect")
            .data(this.data)
            .enter()
            .append("rect")
            .attr("y", function(d){return(bandScale(d.name));})
            .attr("width", function(d){return(d.value)})
            .attr("height", (bandScale.bandwidth()))
            .attr("fill", "green")
    }
    
    render(){
        return(
            <div id="chart"></div>
        );
    }
}

export default DownloadChart;