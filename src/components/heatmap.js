import React, { Component } from "react";
import * as d3 from "d3";
import {
  Sidebar,
  Segment,
  Dropdown,
  Button,
  Menu,
  Icon
} from "semantic-ui-react";
import "../css/appone.css";
import "../css/bootstrap.min.css";
import "../css/heatmap.css";
import "../css/style.css";


class Heatmap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {
      messages: null
    },
      master: {},
      pFormat: d3.format(".1%"),
      qFormat: d3.format(",.0f"),
      rankList: [],
      categoryList: [],
      selectedRank: "",
      selectedCategory: "",
      dataset: []
    };

    this.importJSON = this.importJSON.bind(this);
    this.updateList = this.updateList.bind(this);
  }

  toggleVisibility = () => this.setState({ visible: !this.state.visible });

  componentDidMount(){
    this.importJSON();
  }
 

  importJSON() {
    const ranks = {};
    const categories = {};
    const master = {};
    const rankList = [];
    const categoryList = [];

    return (
      fetch("http://localhost:8080/visualization/chord/fulldata")
      //https://bitbucket.org/rohitkalva/viz/raw/adce478b74bae4e1204d057b3d0171d52e336648/fulldata_sort.json
        //http://localhost:3000/fulldata_filter1.json
        // return fetch('https://bitbucket.org/rohitkalva/viz/raw/bc0d90fb1305689008c83d72bd27898c1417d3c8/fulldata_filter.json')
        //return fetch("http://localhost:8080/visualization/chord/fulldata")
        .then(response => response.json())
        .then(responseJson => {
          this.setState(
            {
              TAXONOMY_DATA: responseJson.fulldata
            },
            () => {
              this.state.TAXONOMY_DATA.forEach(d => {
                const rank = d.taxonomyRank;
                const keyword = d.keywordCategory;

                ranks[rank] = true;
                categories[keyword] = true;
                if (!master[rank]) {
                  master[rank] = {};
                }
                if (!master[rank][keyword]) {
                  master[rank][keyword] = [];
                }

                master[rank][keyword].push(d);
              });

              // add ranks/categories to list
              for (let key in ranks) {
                if (ranks.hasOwnProperty(key)) {
                  rankList.push(key);
                }
              }

              for (let key in categories) {
                if (categories.hasOwnProperty(key)) {
                  categoryList.push(key);
                }
              }
              console.log("rankList", rankList);
              console.log("categoryList", categoryList);
              //console.log('master', master)

              this.setState(
                {
                  rankList,
                  categoryList,
                  master,
                  selectedRank: rankList[0],
                  selectedCategory: categoryList[0]
                  // selectedRank: "kingdom",
                  // selectedCategory: "Technical term",
                },
                () => {
                  this.updateList();
                }
              );
            }
          );
        })
    )
  }
  // 1 - parse the data to get the list of ranks and categories

  // create taxonomy/keyword list
  updateList() {
    // temporary dictionary
    const { master, selectedRank, selectedCategory } = this.state;
    console.log(`master[${selectedRank}][${selectedCategory}]`);

    const dataset = master[selectedRank][selectedCategory];

    console.log("Data Test", dataset);
    
    this.setState({
      dataset,
    }, () => {
      this.heatmapfunction()
    })  
  }

  heatmapfunction() {
        const data = this.state.dataset;
        const tax = d3.set(data.map(d => d.taxonomyName)).values()
        const key = d3.set(data.map(d => d.keywordName)).values();
        //const keycount = responseJson.heatdata.keywordCount;
        //const taxcount = responseJson.heatdata.taxonomyCount;

        //console.log(keycount);
        //console.log(taxcount);

        const legendData = [
          { interval: 1, color: "#91e5e4" },
          //{ interval: 50, color: "#8ffaf8" },
          { interval: 100, color: "#9afaf8" },
          //{ interval: 150, color: "#a5fbf9" },
          { interval: 200, color: "#b0fbfa" },
          //{ interval: 250, color: "#bbfcfa" },
          { interval: 300, color: "#c7fcfb" },
          //{ interval: 350, color: "#d2fdfc" },
          { interval: 400, color: "#ddfdfc" },
          //{ interval: 450, color: "#e8fefd" },
          { interval: 500, color: "#f3fefe" },
         // { interval: 550, color: "#fef3f4" },
          { interval: 600, color: "#fee8e9" },
          //{ interval: 650, color: "#fdddde" },
          { interval: 700, color: "#fdd2d3" },
         // { interval: 750, color: "#fcc7c8" },
          { interval: 800, color: "#fcbbbd" },
          //{ interval: 850, color: "#fbb0b2" },
          { interval: 900, color: "#fba5a7" },
         // { interval: 1000, color: "#fa9a9c" },
          { interval: 1200, color: "#fa8f91" },
         // { interval: 1400, color: "#ff7275" },
          { interval: 1600, color: "#ff595c" },
         // { interval: 1800, color: "#f94549" },
          { interval: 2000, color: "#f43035" },
          { interval: 2200, color: "darkred" }
        ];

        const width = key.length * 23.8, //count*23.8
          height = tax.length * 32; //count*32

        // const width = 5000, height = 7000

        const itemSize = 11,
          cellSize = itemSize - 1,
          margins = { top: 70, right: 50, bottom: 250, left: 200 };

        const yValues = d3.set(data.map(d => d.taxonomyName)).values();
        const xValues = d3.set(data.map(d => d.keywordName)).values();
        const xScale = d3
          .scaleBand()
          .range([0, width])
          .domain(xValues); //X-Axis

        const yScale = d3
          .scaleBand()
          .range([0, height])
          .domain(yValues); //Y-Axis


          d3.select(".chart").selectAll("*").remove();

        //Setting chart width and adjusting for margins
        const chart = d3
        .select(".chart")
          .attr('width', width + margins.right + margins.left)
          .attr('height', height + margins.top + margins.bottom)
          .append('g')
          .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

          //Add background color to chart
          chart
          .append('rect')
          .attr('width',width)
          .attr('height', height)
          .style('fill','#ffdab9')

        //Tooltip class
        const tooltip = d3
          .select(".container")
          .append("div")
          .attr("class", "tooltip")
          .html("Tooltip");

        //Return dynamic color based on intervals in legendData
        const colorScale = d => {
          for (let i = 0; i < legendData.length; i++) {
            if (d.spectCount < legendData[i].interval) {
              return legendData[i].color;
            }
          }
          return "darkred";
        };

        chart.selectAll("g").remove();      

        //Append heatmap bars, styles, and mouse events
        chart
          .selectAll("g")
          .data(data)
          .enter()
          .append("g")
          .append("rect")
          .attr("x", d => {
            return xScale(d.keywordName);
          })
          .attr("y", d => {
            return yScale(d.taxonomyName);
          })
          .style("fill", colorScale)
          .attr("width", cellSize)
          .attr("height", cellSize)
          .on("mouseover", d => {
            // eslint-disable-next-line
            tooltip
              .html(
                "KeywordName: " +
                d.keywordName +
                "<br/> " +
                "Tax ID: " +
                d.taxId + // eslint-disable-next-line
                  "<br/>" +
                  "KeywordID: " +
                  d.keywordId +
                  "<br/>" +
                  "SpectCount: " +
                  d3.format(".4r")(d.spectCount)
              )
              .style("left", d3.event.pageX - 35 + "px")
              .style("top", d3.event.pageY - 73 + "px")
              .style("opacity", 0.9);
          })
          .on("mouseout", () => {
            tooltip.style("opacity", 0).style("left", "0px");
          })
          .exit()
          .remove()

        //Append x axis
        chart
          .append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(xScale))
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)");

        //Append y axis
        chart
          .append("g")
          .attr("transform", "translate(0,-" + itemSize / 2 + ")")
          .call(d3.axisLeft(yScale))
          .attr("class", "yAxis")
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-40)");

        //Append y axis label
        chart
          .append("text")
          .attr("transform", "translate(-90," + height / 2 + ") rotate(-90)")
          .style("text-anchor", "middle")
          .text("Taxonomy Name");

        //Append x axis label
        chart
          .append("text")
          .attr(
            "transform",
            "translate(" + width / 2 + "," + (height + 70) + ")"
          )
          .style("text-anchor", "middle")
          .text("Keyword Name");

        //Append color legend using legendData
        chart
          .append("g")
          .selectAll("g")
          .data(legendData)
          .enter()
          .append("rect")
          .attr("width", 60)
          .attr("height", 20)
          .attr("x", (d, i) => {
            return i * 40 + width * 0.1;
          })
          .attr("y", height + margins.top + 10)
          .style("fill", d => {
            return d.color;
          })
          .on("mouseover", d => {
            tooltip
              .html(d.interval)
              .style("left", d3.event.pageX - 35 + "px")
              .style("top", d3.event.pageY - 73 + "px")
              .style("opacity", 0.9);
          })
          .on("mouseout", () => {
            tooltip.style("opacity", 0).style("left", "0px");
          });

        //Append text labels for legend from legendData
        chart
          .append("g")
          .selectAll("text")
          .data(legendData)
          .enter()
          .append("text")
          .attr("x", (d, i) => {
            return i * 40 + width * 0.1;
          })
          .attr("y", height + 10 + margins.top * 1.5)
          .text(d => {
            return d.interval;
          });
     
  }

  render() {
    const {
      visible,
      rankList,
      categoryList,
      selectedRank,
      selectedCategory
    } = this.state;

    return (
      <div>
        <Sidebar.Pushable as={Segment}>
          <Button
            onClick={this.toggleVisibility}
            icon
            className="navbar-toggle"
          >
            <Icon name="align justify" />
          </Button>
          <Sidebar
            as={Menu}
            animation="overlay"
            width="very wide"
            direction="right"
            visible={visible}
            icon="labeled"
            vertical
            inverted
          >
            <Icon
              className="close"
              size="large"
              onClick={this.toggleVisibility}
            />
            <div className="row mt-50" />

            <div className="row mt-20">
              <div className="col-sm-6">
                <Dropdown
                  placeholder="Select Rank"
                  selection
                  value={selectedRank}
                  options={rankList.map(item => ({
                    key: item,
                    text: item,
                    value: item
                  }))}
                  onChange={(e, data) => {
                    this.setState({ selectedRank: data.value }, () => {
                      this.updateList();
                    });
                  }}
                />
              </div>
              <div className="col-sm-6">
                <Dropdown
                  placeholder="Select Category"
                  selection
                  value={selectedCategory}
                  options={categoryList.map(item => ({
                    key: item,
                    text: item,
                    value: item
                  }))}
                  onChange={(e, data) => {
                    this.setState({ selectedCategory: data.value }, () => {
                      this.updateList();
                    });
                  }}
                />
              </div>
            </div>
          </Sidebar>
          <Sidebar.Pusher>
            <Segment basic>
              <div className="row" style={{ position: "relative" }}>
                <div className="large-8 small-12">
                  <svg className="chart" />
                </div>
              </div>
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}

export default Heatmap;