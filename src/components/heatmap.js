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
      dataset: [],
      taxlist: [],
      keylist: [],
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
      fetch("https://bitbucket.org/rohitkalva/viz/raw/57fded0791bdeefd5b2def0deab7ea89b3077dce/final.json")
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
    const taxls = {};
    const keyls = {};
    const masters = {};
    const taxlist = [];
    const keylist = [];    
    dataset.forEach(d => {
      const taxl = d.taxonomyName;
      const keyl = d.keywordName;

      taxls[taxl] = true;
      keyls[keyl] = true;
      if (!masters[taxl]) {
        masters[taxl] = {};
      }
      if (!masters[taxl][keyl]) {
        masters[taxl][keyl] = [];
      }

      masters[taxl][keyl].push(d);
    });

    for (let key in taxls) {
      if (taxls.hasOwnProperty(key)) {
        taxlist.push(key);
      }
    }

    for (let key in keyls) {
      if (keyls.hasOwnProperty(key)) {
        keylist.push(key);
      }
    }

    console.log('Tax', taxlist.length)
    console.log('Key', keylist.length)
    
    this.setState({
      dataset,
      taxlist,
      keylist
    }, () => {
      this.heatmapfunction()
    })  
  }

  heatmapfunction() {
        const data = this.state.dataset;
        const taxlists = this.state.taxlist;
        const keylists = this.state.keylist;
        //const keycount = responseJson.heatdata.keywordCount;
        //const taxcount = responseJson.heatdata.taxonomyCount;

        //console.log(keycount);
        //console.log(taxcount);

        const legendData = [
          { interval: 0, color: "#91e5e4" },
          { interval: 1, color: "#8ffaf8" },
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
          { interval: 9400, color: "darkred" },
        ];

       
        if(keylists.length>taxlists.length){

          const width = keylists.length * 35.7, //count*35.7
          height = taxlists.length * 48; //count*48

        // const width = 5000, height = 7000

        const itemSize = 35,
          cellSize = itemSize+12,
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
          .style('fill','#91e5e4')

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
          .attr("width", itemSize)
          .attr("height", cellSize)
          .on("mouseover", d => {
            // eslint-disable-next-line
            tooltip
              .html(
                "KeywordName: " +
                d.keywordName +
                "<br/> " +
                "Taxonomy Name: " +
                d.taxonomyName + // eslint-disable-next-line
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
          .attr("transform", "rotate(-65)")
          

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
          .attr("transform", "rotate(-40)")
       

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
            return i * 40;
          })
          .attr("y", -50)
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
            return i * 40;
          })
          .attr("y", -50)
          .text(d => {
            return d.interval;
          });}

          if(keylists.length<taxlists.length){

            const width = taxlists.length * 35.7, //count*35.7
            height = keylists.length * 48; //count*48
  
          // const width = 5000, height = 7000
  
          const itemSize = 35,
            cellSize = itemSize+12,
            margins = { top: 70, right: 50, bottom: 250, left: 200 };
            const xValues = d3.set(data.map(d => d.taxonomyName)).values();
        const yValues = d3.set(data.map(d => d.keywordName)).values();
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
          .style('fill','#91e5e4')

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
            return xScale(d.taxonomyName);
          })
          .attr("y", d => {
            return yScale(d.keywordName);
          })
          .style("fill", colorScale)
          .attr("width", itemSize)
          .attr("height", cellSize)
          .on("mouseover", d => {
            // eslint-disable-next-line
            tooltip
              .html(
                "KeywordName: " +
                d.keywordName +
                "<br/> " +
                "Taxonomy Name: " +
                d.taxonomyName + // eslint-disable-next-line
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
          .text("Keyword Name");

        //Append x axis label
        chart
          .append("text")
          .attr(
            "transform",
            "translate(" + width / 2 + "," + (height + 70) + ")"
          )
          .style("text-anchor", "middle")
          .text("Taxonomy Name");

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
            return i * 40 ;
          })
          .attr("y", -50)
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
            return i * 40 ;
          })
          .attr("y", -50)
          .text(d => {
            return d.interval;
          });
          }
     
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
      <div className="container">
        <Sidebar.Pushable as={Segment} >
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
              <div className = "chartdiv">
              <svg className="chart"/>
              </div>
                  
                
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}

export default Heatmap;