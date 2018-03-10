import React from 'react';
import axios from 'axios';
import { Pie} from 'react-chartjs-2';

class PieTp extends React.Component {

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
              label: 'ProteinCount',
              data: taxonomyData.map(p => p.noOfProtein),
              backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850","#1c0549","#db316d","#ff005a","+  #ff6700","#13890f"],
            }


          ]
        }

        this.setState({ chartData });
      });
  }
  
  static defaultProps = {
    displayTitle:true,
    displayLegend: true,
    legendPosition:'bottom',
  }

render() {
  return (
    <div className="App">
       
  
      <Pie data={this.state.chartData}
        />

    </div>
  );
}
}
export default PieTp;