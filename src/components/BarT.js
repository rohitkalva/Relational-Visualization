import React from 'react';
import axios from 'axios';
import { Bar,Line, Radar} from 'react-chartjs-2';

class BarT extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      chartData: {},
    }
  }

  componentDidMount() {

     axios('http://localhost:8080/visualization/barpie/taxonomy')
      .then((response) => {
 
        const { taxonomyData } = response.data;
        const chartData = {
          labels: taxonomyData.map(k => k.taxonomyName),
          datasets: [
            {
              label: 'SpectraCount',
              data: taxonomyData.map(d => d.noOfSpectra),
              backgroundColor: '#1c0549', 
            },
            {
              label: 'ProteinCount',
              data: taxonomyData.map(p => p.noOfProtein),
              backgroundColor: '#ff005a',
            },
            {
              label: 'PeptideCount',
              data: taxonomyData.map(e => e.noOfPeptide),
              backgroundColor:  '#65cde3',
            }


          ]
        }

        this.setState({ chartData });
      });
  }
  

render() {
  return (
    <div className="App">
       <Bar data={this.state.chartData} 
        options={{

          scales: {
                   xAxes: [{
                           display: true,
                           scaleLabel: {
                               display: true,
                               ticks: {
                                  autoSkip: false
                                       },
                               labelString: 'TaxynomyName'
                           }
                       }],
                   yAxes: [{
                           display: true,
                           ticks: {
                               beginAtZero: true,
                               steps: 1000,
                               stepValue: 500,
                               max: 5000
                           }
                       }]
               },
           title:{
               display:this.props.displayTitle,
               text:'"RANK": "species" ',
               fontsize:25
           },
           legend:{
               display:this.props.displayLegend,
               position:this.props.legendPosition
           }
       }} />

      
      

    </div>
  );
}
}
export default BarT;