import React, { Component } from 'react';
import { render } from 'react-dom';
import * as d3 from 'd3';
import axios from 'axios';
import './heatmap.css';

class Heatmap extends Component {

  componentDidMount() {
    const url = 'http://localhost:8080/visualization/data/heatmap';

    axios.get(url).then(res => {

      const data = res.data.heatdata;
      
      const legendData = [
        { 'interval': 0, 'color': '#cc444b' },
        { 'interval': 10, 'color': '#80dfff' },
        { 'interval': 15, 'color': '#a83239' },
        { 'interval': 20, 'color': ' #a64dff' },
        { 'interval': 25, 'color': '#e69900' },
        { 'interval': 30, 'color': '#84DE02' },
        { 'interval': 35, 'color': '#cc80ff' },
        { 'interval': 40, 'color': '#d147a3' },
        { 'interval': 45, 'color': '#79d2a6' },
        { 'interval': 50, 'color': '#df7373' },
        { 'interval': 75, 'color': '#e39695' },
        { 'interval': 100, 'color': '#FCD667' },
        { 'interval': 125, 'color': '#ED0A3F' },
        { 'interval': 150, 'color': '#da5552' },
        { 'interval': 175, 'color': '#FC80A5' },
        { 'interval': 200, 'color': '#e71d36' },
        { 'interval': 250, 'color': '#05668d' },
        { 'interval': 300, 'color': '#028090' },
        { 'interval': 350, 'color': '#00a896' },
        { 'interval': 400, 'color': '#02c39a' },
        { 'interval': 450, 'color': '#5bc0be' },
        { 'interval': 500, 'color': '#ff9f1c' },
        { 'interval': 550, 'color': '#66a6ff' },
        { 'interval': 600, 'color': '#dfa579' },
        { 'interval': 650, 'color': '#1e3c72' },
        { 'interval': 700, 'color': '#89da59' },
        { 'interval': 750, 'color': '#a43820' },
        { 'interval': 800, 'color': '#68829e' },
        { 'interval': 850, 'color': '#f18d9e' },
        { 'interval': 900, 'color': '#4cb5f5' },
        { 'interval': 1000, 'color': '#a1d6e2' },
        { 'interval': 1200, 'color': '#cb0000' },
        { 'interval': 1400, 'color': '#0f1b07' },
        { 'interval': 1600, 'color': '#523634' },
        { 'interval': 1800, 'color': '#d9412f' },
        { 'interval': 2000, 'color': '#ffec5c' },
        { 'interval': 2200, 'color': 'darkred' }
      ];

      const itemSize = 11,
        cellSize = itemSize - 1,
        margins = { top: 70, right: 50, bottom: 250, left: 300 };

      const width = 14250, //count*23.8
        height = 9488; //count*32

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
        for (let i = 0; i < legendData.length; i++) {
          if (d.spectCount < legendData[i].interval) {
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
        .on('mouseover', d => {
          tooltip.html(d.keywordName + '<br/> ' + d.taxId + '<br/>' + d.keywordId + '<br/>' +
            d3.format('.4r')(d.spectCount))
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
;

      //Append y axis label
      chart.append('text')
        .attr('transform', 'translate(-40,' + (height / 2) + ') rotate(-90)')
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
        .attr('x', (d, i) => { return i * 60 + width * .7; })
        .attr('y', height + margins.top)
        .style('fill', d => { return d.color; });

      //Append text labels for legend from legendData
      chart.append('g')
        .selectAll('text')
        .data(legendData).enter().append('text')
        .attr('x', (d, i) => { return i * 60 + width * .7 })
        .attr('y', height + margins.top * 1.5)
        .text(d => { return d.interval; });

    });
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