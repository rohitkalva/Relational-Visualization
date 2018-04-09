import React, { Component } from 'react';
import * as d3 from 'd3';
//import axios from 'axios';
import '../css/heatmap.css';
import {chordMatrix} from './chord/matrixFactory'

class Heatmap extends Component {
  constructor(props){
    super(props);
    this.state = {
      params: {
        Chord : new chordMatrix()
      }
      
    }
  }

  componentWillMount(){
    const chord_data = this.state.params.Chord.Initialize.matrix
    
    console.log(chord_data);
  }

  componentDidMount(){
    const url = 'http://localhost:8080/visualization/data/heatmap';
    return fetch(url)
    .then((response)=> response.json())
    .then((responseJson)=>{
   const data = responseJson.heatdata.heatmap;
   const keycount = responseJson.heatdata.keywordCount;
   const taxcount = responseJson.heatdata.taxonomyCount;

   console.log(keycount);
   console.log(taxcount);
   
   const legendData = [
    { 'interval': 1,   'color': '#91e5e4' },
    { 'interval': 50,  'color': '#8ffaf8' },
    { 'interval': 100, 'color': '#9afaf8' },
    { 'interval': 150, 'color': '#a5fbf9' },
    { 'interval': 200, 'color': '#b0fbfa' },
    { 'interval': 250, 'color': '#bbfcfa' },
    { 'interval': 300, 'color': '#c7fcfb' },
    { 'interval': 350, 'color': '#d2fdfc' },
    { 'interval': 400, 'color': '#ddfdfc' },
    { 'interval': 450, 'color': '#e8fefd' },
    { 'interval': 500, 'color': '#f3fefe' },
    { 'interval': 550, 'color': '#fef3f4' },
    { 'interval': 600, 'color': '#fee8e9' },
    { 'interval': 650, 'color': '#fdddde' },
    { 'interval': 700, 'color': '#fdd2d3' },
    { 'interval': 750, 'color': '#fcc7c8' },
    { 'interval': 800, 'color': '#fcbbbd' },
    { 'interval': 850, 'color': '#fbb0b2' },
    { 'interval': 900, 'color': '#fba5a7' },
    { 'interval': 1000, 'color': '#fa9a9c' },
    { 'interval': 1200, 'color': '#fa8f91' },
    { 'interval': 1400, 'color': '#ff7275' },
    { 'interval': 1600, 'color': '#ff595c' },
    { 'interval': 1800, 'color': '#f94549' },
    { 'interval': 2000, 'color': '#f43035' },
    { 'interval': 2200, 'color': 'darkred' }
  ];

 const width = taxcount*23.8, //count*23.8
    height = keycount*32; //count*32

    const itemSize = 11,
    cellSize = itemSize - 1,
    margins = { top: 70, right: 50, bottom: 250, left: 200 };

  const xValues = d3.set(data.map(d => d.taxId)).values();
  const yValues = d3.set(data.map(d => d.keywordName)).values();
  const xScale = d3.scaleBand()
    .range([0, width])
    .domain(xValues); //X-Axis

  const yScale = d3.scaleBand()
    .range([0, height])
    .domain(yValues); //Y-Axis

  //Setting chart width and adjusting for margins
  const chart = d3.select('.chart')
    .attr('width', width + margins.right + margins.left)
    .attr('height', height + margins.top + margins.bottom)
    .append('g')
    .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

  //Tooltip class
  const tooltip = d3.select('.container').append('div')
    .attr('class', 'tooltip')
    .html('Tooltip')

  //Return dynamic color based on intervals in legendData
  const colorScale = d => {
    for (let i = 0; i < legendData.length; i++) 
    {
      if (d.spectCount < legendData[i].interval) 
      {
        return legendData[i].color;
      }
    }
    return 'darkred';
  };

  //Append heatmap bars, styles, and mouse events
  chart.selectAll('g')
    .data(data).enter().append('g')
    .append('rect')
    .attr('x', d => { return xScale(d.taxId) })
    .attr('y', d => { return yScale(d.keywordName) })
    .style('fill', colorScale)
    .attr('width', cellSize)
    .attr('height', cellSize)
    .on('mouseover', d => { // eslint-disable-next-line
      tooltip.html('KeywordName: ' + d.keywordName + '<br/> ' + 'Tax ID: ' + d.taxId // eslint-disable-next-line
       + '<br/>' + 'KeywordID: ' + d.keywordId + '<br/>' 
       + 'SpectCount: ' + d3.format('.4r')(d.spectCount))
        .style('left', d3.event.pageX - 35 + 'px')
        .style('top', d3.event.pageY - 73 + 'px')
        .style('opacity', .9);
    }).on('mouseout', () => {
      tooltip.style('opacity', 0)
        .style('left', '0px');
    });

  //Append x axis
  chart.append('g')
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).tickFormat(d3.format('')))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");

  
  //Append y axis
  chart.append('g')
    .attr('transform', 'translate(0,-' + itemSize / 2 + ')')
    .call(d3.axisLeft(yScale))
    .attr('class', 'yAxis')
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-40)");


  //Append y axis label
  chart.append('text')
    .attr('transform', 'translate(-90,' + (height / 2) + ') rotate(-90)')
    .style('text-anchor', 'middle')
    .text('Keyword Names');

  //Append x axis label
  chart.append('text')
    .attr('transform', 'translate(' + (width / 2) + ',' + (height + 70) + ')')
    .style('text-anchor', 'middle')
    .text('Taxynomy ID');

  //Append color legend using legendData
  chart.append('g')
    .selectAll('g')
    .data(legendData).enter()
    .append('rect')
    .attr('width', 60)
    .attr('height', 20)
    .attr('x', (d, i) => { return i * 40 + width * .1; })
    .attr('y', height + margins.top + 10)
    .style('fill', d => { return d.color; })
    .on('mouseover', d => {
        tooltip.html(d.interval )
          .style('left', d3.event.pageX - 35 + 'px')
          .style('top', d3.event.pageY - 73 + 'px')
          .style('opacity', .9);
      }).on('mouseout', () => {
        tooltip.style('opacity', 0)
          .style('left', '0px');
      });

  //Append text labels for legend from legendData
  chart.append('g')
    .selectAll('text')
    .data(legendData).enter().append('text')
    .attr('x', (d, i) => { return i * 40 + width * .1 })
    .attr('y', height +10 + margins.top * 1.5)
    .text(d => { return d.interval; });

})
}

  render() {
    return (
      <div className="container">
        <h1>HeatMap</h1>
        <svg className='chart'></svg>
      </div>
    );
  }
}

export default Heatmap;