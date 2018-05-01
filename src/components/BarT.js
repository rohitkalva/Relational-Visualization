import React from 'react';
import { Bar} from 'react-chartjs-2';
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

class BarT extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      chartData: {},
      master: {},
      rankList: [],
      selectedRank: "",
    }

    this.importJSON = this.importJSON.bind(this);
    this.updateList = this.updateList.bind(this);
  }

  toggleVisibility = () => this.setState({ visible: !this.state.visible });

   static defaultProps = {
        displayTitle:true,
        displayLegend:true,
        legendPosition:'right',
        
    }
  componentDidMount() {
    this.importJSON()
  }

  importJSON() {
    const ranks = {};
    const master = {};
    const rankList = [];

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

              this.setState(
                {
                  rankList,
                  master,
                  selectedRank: rankList[0]
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
    const { master, selectedRank } = this.state;
    console.log(`master[${selectedRank}]`);
    const Data = master[selectedRank];

        const chartData = {
          labels: Data.map(k => k.taxonomyName),
          datasets: [
            {
              label: 'SpectraCount',
              data: Data.map(d => d.noOfSpectra),
              backgroundColor: '#1c0549', 
            },
            {
              label: 'ProteinCount',
              data: Data.map(p => p.noOfProtein),
              backgroundColor: '#ff005a',
            },
            {
              label: 'PeptideCount',
              data: Data.map(e => e.noOfPeptide),
              backgroundColor:  '#65cde3',
            }
          ]
        }
        this.setState({ chartData });
  }
  

render() {
  const {
    visible,
    rankList,
    selectedRank
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
              </div>
              </Sidebar> 
        <Bar className="chart"
        data={this.state.chartData}
        options={{

           scales: {
                    xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                ticks: {
                                   autoSkip: false
                                        },
                                labelString: 'Taxonomy Name'
                            }
                        }]
                },
            title:{
                display:this.props.displayTitle,
                text:"Rank: "+ this.state.selectedRank,
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
export default BarT;