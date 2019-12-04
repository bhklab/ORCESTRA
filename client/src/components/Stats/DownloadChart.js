import React from 'react';
import * as d3 from 'd3';

class DownloadChart extends React.Component{
    constructor(){
        super();
        this.drawChart = this.drawChart.bind(this);
    }

    componentDidMount(){
        let data = this.props.data.data;
        let name = this.props.data.name;
        let height = this.props.height;
        let width = this.props.width;
        this.drawChart(name, data, width, height);
    }

    drawChart(name, data, width, height){
        let margin = {top: 20, right: 20, bottom: 30, left: 40};
        const svg = d3.select("#chart").append("svg").attr("width", width).attr("height", height);
        svg.attr("transform", "translate(30, 0)");
        let w = width - margin.left - margin.right;
        let h = height - margin.top - margin.bottom;

        let xRange = d3.scaleBand().range([0, w]).padding(0.2);
        let yRange = d3.scaleLinear().range([h, 5]);

        xRange.domain(name);
        yRange.domain([0, d3.max(data, function(d){return(d.value) + 5})]);

        const xAxis = d3.axisBottom().scale(xRange)
        const yAxis = d3.axisLeft().scale(yRange).tickSize(5);

        svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        svg.append("g")
            .attr('class', 'x axis')
            .attr('transform', `translate(30,${h})`)
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-width', 0.2)
            .call(xAxis);
        
        svg.append("g")
            .attr('class', 'y axis')
            .attr('transform', `translate(20,0)`)
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-width', 0.2)
            .call(yAxis);
                  
        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("x", function(d){return(xRange(d.name));})
            .attr("y", function(d){return(yRange(d.value));})
            .attr("width", (xRange.bandwidth()))
            .attr("height", function(d){return(h - yRange(d.value));})
            .attr("transform", "translate(30, 0)")
            .attr("fill", "#3D405A");
    }
    
    render(){
        return(
            <div id="chart"></div>
        );
    }
}

export default DownloadChart;