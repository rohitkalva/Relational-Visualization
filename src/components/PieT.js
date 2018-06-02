import React from 'react'; 
import { Pie} from 'react-chartjs-2';                                         //import chart.js library 
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
import "../css/style.css";
import "../css/bar.css";

class PieT extends React.Component {

  constructor(props) {                                                     //defining initial state in the constructor
    super(props);
    this.state = {                                                         //adding local state 
      chartData: {},
      master: {},
      rankList: [],
      selectedRank: "",
      countRank: "", 
      countList:[]
    }

    this.importJSON = this.importJSON.bind(this);
    this.updateList = this.updateList.bind(this);
  }

  toggleVisibility = () => this.setState({ visible: !this.state.visible });   
                                                                            // adding lifecycle methods
  componentDidMount() {                                                    //this life cycle hook runs after the component is mounted.
    this.importJSON()

  }
  
  importJSON() {                                                        // assigning required variables 
    const ranks = {};
    const master = {};
    const rankList = [];
    var countList = [];


    return fetch("http://localhost:8080/visualization/barpie/taxonomy") //GET api for pie chart data
       .then(response => response.json())
        .then(responseJson => {                                         // assiging the json response
          this.setState(                                               // setting up a state so that local state will be updated
            {
              TAXONOMY_DATA: responseJson.taxonomyData                //assiging responsejson to TAXONOMY_DATA
            },
            () => {
              this.state.TAXONOMY_DATA.forEach(d => {
                const rank = d.rank;

                ranks[rank] = true;
                if (!master[rank]) {
                  master[rank] = [];
                }

                master[rank].push(d);
              });

                                                                       // add ranks/categories to list
              
              for (let key in ranks) {
                if (ranks.hasOwnProperty(key)) {
                  rankList.push(key);
                }
              }
             console.log("RankList", rankList);                       //checking up data stored in Ranklist on console
                                                                  
                                                                     
      countList = new Array ("Spectra Count", "Protein Count", "Peptide Count") 

              this.setState(                                        //function for updating chart whenever user selects a different rank/catogory/countlist
                {
                  rankList,
                  master,
                  selectedRank: rankList[0],
                  countRank: countList[0],
                   countList,
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
  }

  updateList(){
                                                                      
    var dynamicColors = function() {                              // a function for generating random colors
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      return "rgb(" + r + "," + g + "," + b + ")";
  } 


  const { master, selectedRank, countRank, } = this.state;
  console.log(`master[${selectedRank}]`);
  const Data = master[selectedRank];

    const xyz = []                                              //a function for plotting random colors
    var spectcolor = function(){
      for(var i=0;i<Data.map(k => k.taxonomyName).length;i++){
         xyz[i] = dynamicColors(); 
       }
      return xyz;
    }
    if(countRank === "Spectra Count")                         //functional block for spectra count,invoked whenever user selects this in countlist
    {
        const chartData = {                                   //Data Structure
                                                              //mapping of lables with taxonomy names and sorting them in alphabetical order
          labels: Data.map(k => k.taxonomyName).sort((a, b) =>  a.toLowerCase() > b.toLowerCase() ? 1 : -1),
          datasets: [                                        //Dataset properties 
            {
              label: 'SpectraCount',                         //header for the chart
              data: Data.map(d => d.noOfSpectra),           //mapping data with what needs to be plotted(noofspectra)
                                                            //map() function  transforms one array into another array
              indexLabelPlacement: "outside",              // position of the Header
              backgroundColor: spectcolor(),               //assiging random colors to the chart
            }
          ]
        }
        this.setState({ chartData });                     // Now the chart will be updated when ever there are any server response or prop changes.
      }

      if(countRank === "Peptide Count")                  //functional block for Peptide count,invoked whenever user selects this in countlist
    {
        const chartData = {
          labels: Data.map(k => k.taxonomyName).sort((a, b) =>  a.toLowerCase() > b.toLowerCase() ? 1 : -1),
          datasets: [                                  
            {
              label: 'PeptideCount',
              data: Data.map(d => d.noOfPeptide),
              indexLabelPlacement: "outside",
              backgroundColor: spectcolor(), 
            }
          ]
        }
        this.setState({ chartData });
      }

      if(countRank === "Protein Count")             //functional block for Protein count,invoked whenever user selects this in countlist
    {
        const chartData = {
          labels: Data.map(k => k.taxonomyName).sort((a, b) =>  a.toLowerCase() > b.toLowerCase() ? 1 : -1),
          datasets: [
            {
              label: 'ProteinCount',
              data: Data.map(d => d.noOfProtein),
              indexLabelPlacement: "outside",
              backgroundColor: spectcolor(), 
            }
          ]
        }
        this.setState({ chartData });
      }
  }

  static defaultProps = {                       //assiging props,default options for legend
    displayTitle:true, 
    displayLegend: false,
    legendPosition:'right',
  }

  render() {
    const {
      visible,
      rankList,
      selectedRank,
      countRank,
      countList
    } = this.state; 
  
    return (
      <div className="container">
       <h4>{this.state.countRank}</h4>
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
                            <Dropdown placeholder="Select Count" selection value={countRank} options={countList.map(
                                item => ({ key: item, text: item, value: item })
                            ).sort((a, b) => a.text.toLowerCase() > b.text.toLowerCase() )} onChange={(e, data) => {
                                this.setState(
                                    { countRank: data.value },
                                    () => {
                                        this.updateList();
                                    }
                                );
                            }} />
                        </div>
              <div className="col-sm-6">
                  <Dropdown
                    placeholder="Select Rank"
                    selection
                    value={selectedRank}
                    options={rankList.map(item => ({
                      key: item,
                      text: item,
                      value: item
                    })).sort((a, b) => a.text.toLowerCase() > b.text.toLowerCase() )}
                    onChange={(e, data) => {
                      this.setState({ selectedRank: data.value }, () => {
                        this.updateList();
                      });
                    }}
                  />
                </div>
                </div>
                </Sidebar> 
          <Pie className="chart" // Configuration options for chart
          data={this.state.chartData}
          options={{
  
              title:{
                  display:this.props.displayTitle,
                  text: "Rank: " +this.state.selectedRank,
                  fontsize:25
              },
              legend:{ 
                  display:this.props.displayLegend,
                  position:this.props.legendPosition
              }
          }}
          />    
            
          </Sidebar.Pushable>
      </div>
    );
  }
  }
export default PieT;