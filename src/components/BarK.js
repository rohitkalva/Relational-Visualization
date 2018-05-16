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

class BarK extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      chartData: {},
      master: {},
      categoryList: [],
      selectedCategory: "",
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
    const categories = {};
    const master = {};
    const categoryList = [];

    return fetch("http://localhost:8080/visualization/barpie/keyword")
       .then(response => response.json())
        .then(responseJson => {
          this.setState(
            {
              TAXONOMY_DATA: responseJson.keywordData
            },
            () => {
              this.state.TAXONOMY_DATA.forEach(d => {
                const keyword = d.category;

                categories[keyword] = true;
                if (!master[keyword]) {
                  master[keyword] = [];
                }

                master[keyword].push(d);
              });

              // add ranks/categories to list
              
              for (let key in categories) {
                if (categories.hasOwnProperty(key)) {
                  categoryList.push(key);
                }
              }
             console.log("categoryList", categoryList);
              //console.log('master', master)

              this.setState(
                {
                  categoryList,
                  master,
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
  }

  updateList(){
    const { master, selectedCategory } = this.state;
    console.log(`master[${selectedCategory}]`);
    const Data = master[selectedCategory];

        const chartData = {
          labels: Data.map(k => k.keywordName),
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
    categoryList,
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
                        labelString: 'Keyword Name'
                    }
                }]
        },
            title:{
                display:this.props.displayTitle,
                text: "Category: "+this.state.selectedCategory,
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
export default BarK;