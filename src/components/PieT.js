import React from 'react';
import { Pie} from 'react-chartjs-2';
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

  constructor(props) {
    super(props);
    this.state = {
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

  componentDidMount() {   
    this.importJSON()

  }
  
  importJSON() {
    const ranks = {};
    const master = {};
    const rankList = [];
    var countList = [];


    return fetch("http://localhost:8080/visualization/barpie/taxonomy")
       .then(response => response.json())
        .then(responseJson => {
          this.setState(
            {
              TAXONOMY_DATA: responseJson.taxonomyData
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
             console.log("RankList", rankList);
              //console.log('master', master)
// eslint-disable-next-line
              countList = new Array ("Spectra Count", "Protein Count", "Peptide Count")

              this.setState(
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

    var dynamicColors = function() {
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      return "rgb(" + r + "," + g + "," + b + ")";
  } 


  const { master, selectedRank, countRank, } = this.state;
  console.log(`master[${selectedRank}]`);
  const Data = master[selectedRank];

    const xyz = []
    var spectcolor = function(){
      for(var i=0;i<Data.map(k => k.taxonomyName).length;i++){
         xyz[i] = dynamicColors(); 
       }
      return xyz;
    }
    if(countRank === "Spectra Count")
    {
        const chartData = {
          labels: Data.map(k => k.taxonomyName).sort((a, b) =>  a.toLowerCase() > b.toLowerCase() ? 1 : -1),
          datasets: [
            {
              label: 'SpectraCount',
              data: Data.map(d => d.noOfSpectra),
              indexLabelPlacement: "outside",
              backgroundColor: spectcolor(), 
            }
          ]
        }
        this.setState({ chartData });
      }

      if(countRank === "Peptide Count")
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

      if(countRank === "Protein Count")
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

  static defaultProps = {
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
          <Pie className="chart"
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