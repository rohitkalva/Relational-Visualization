import React from 'react';
import axios from 'axios';
import { Pie} from 'react-chartjs-2';

class PieK extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      chartData: {},
    }
  }

  componentDidMount() {
    
    
    var dynamicColors = function() {
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      return "rgb(" + r + "," + g + "," + b + ")";
  } 
const xyz = []
  var spectcolor = function(){
    for(var i=0;i<25;i++){
       xyz[i] = dynamicColors(); 
     }
    return xyz;
  }

       axios('http://localhost:8080/visualization/barpie/keyword')
      .then((response) => {
 
        const { keywordData } = response.data;
        const chartData = {
          labels: keywordData.map(k => k.keywordName),
               
          datasets: [
            {
              label: 'SpectraCount',
              data: keywordData.map(d => d.noOfSpectra),
              indexLabelPlacement: "outside",
              backgroundColor: spectcolor(),
              
            }
             ]
        }
        this.setState({ chartData });
      });
  }
  
  static defaultProps = {
    displayTitle:true,
    displayLegend: true,
    legendPosition:'right',
  }

render() {
  return (
    <div className="App">
       
    
      <Pie data={this.state.chartData}  
      options={{
        
        title:{
          display:this.props.displayTitle,
          text:'SPECTRA COUNT DATA',
          fontSize:25
        },
        legend:{
          display:this.props.displayLegend,
          position:this.props.legendPosition
        },
        tooltips: {
          callbacks: {
              label: function(tooltipItem, data) {
                  var allData = data.datasets[tooltipItem.datasetIndex].data;
                  var tooltipLabel = data.labels[tooltipItem.index];
                  var tooltipData = allData[tooltipItem.index];
                  var total = 0;
                  for (var i in allData) {
                      total += allData[i];
                  }
                  var tooltipPercentage = Math.round((tooltipData / total) * 100);
                  return tooltipLabel + ': ' + tooltipData + ' (' + tooltipPercentage + '%)';
              }
          }
      }
      }} />

    </div>
  );
}
}
export default PieK;