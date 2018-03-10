import React from 'react';
import axios from 'axios';
import { Bar,Line, Radar} from 'react-chartjs-2';

class BarK extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      chartData: {},
    }
  }
   static defaultProps = {
        displayTitle:true,
        displayLegend:true,
        legendPosition:'right',
        
    }
  componentDidMount() {
     axios('http://localhost:8080/visualization/barpie/keyword')
      .then((response) => {
 
        const { keywordData } = response.data;
        const chartData = {
          labels: keywordData.map(k => k.keywordName),
          datasets: [
            {
              label: 'SpectraCount',
              data: keywordData.map(d => d.noOfSpectra),
              backgroundColor: '#1c0549', 
            },
            {
              label: 'ProteinCount',
              data: keywordData.map(p => p.noOfProtein),
              backgroundColor: '#ff005a',
            },
            {
              label: 'PeptideCount',
              data: keywordData.map(e => e.noOfPeptide),
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
        <Bar
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
                                labelString: 'keywordName'
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
                text:'"category": "Disease" ',
                fontsize:25
            },
            legend:{
                display:this.props.displayLegend,
                position:this.props.legendPosition
            }
        }}
        />       
    </div>
  );
}
}
export default BarK;