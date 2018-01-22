import React, {Component} from 'react';
import ChordDiagram from './ChordDiagram';
import './chord.css';
//import Combobox from '../combobox';
import axios from 'axios';
class Demo extends Component {
constructor(){
    super();
    this.state = {
      matrix:[],
      labels:[],
      
    }
  }

componentWillMount(){
        return fetch('https://api.myjson.com/bins/im1a5https://api.myjson.com/bins/im1a5')
    .then((response)=> response.json())
    .then((responseJson)=>{
      this.setState({
         matrix:responseJson.data.chordMatrix,
         labels:responseJson.data.chordLabel
         
        })
      console.log(this.state.matrix);
      console.log(this.state.labels);
    })


    
  }


     //updatedfunction
     componentDidUpdate(prevProps, prevState) {
      
      if (prevProps.handleSelect !== this.props.handleSelect1 || prevProps.handleSelect1 !== this.props.handleSelect1 ) {
        this.update()        
      }            
      if (this.props.data !== prevProps.data) {
        this.reset()        
      }            

  }

  

    
    update() {
      axios.post('http://localhost:8080/visualization/interact/keyword/update', 
      { 
        data: this.props.handleSelect
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
       
      });
      //console.log(handleSelect);
      axios.post('http://localhost:8080/visualization/interact/taxonomy/update', 
 { 
   data: this.props.handleSelect1
  }
    
    )
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
      console.log(this.state.handleSelect);
      console.log(this.state.handleSelect1);
    }  


reset(){
  axios.get('http://localhost:8080/visualization/interact/reset')
  .then(function (response) {
   console.log(response);
 })
  .catch(function (error) {
    console.log(error);
  });
}

  

  render() {
    return (
      <div className="chordfig">
     
    <ChordDiagram
        matrix={this.state.matrix}
        componentId={0}
        width={650}
        height={550}
        style={{fontFamily: 'sans-serif'}}
        groupLabels={this.state.labels}
        groupColors={['#9C6744','#C9BEB9','#CFA07E','#C4BAA1','#C2B6BF','#121212','#8FB5AA','#85889E','#9C7989','#91919C','#242B27','#212429','#99677B','#36352B','#33332F','#2B2B2E','#2E1F13','#2B242A','#918A59','#6E676C','#6E4752','#6B4A2F','#998476','#8A968D','#968D8A','#968D96','#CC855C', '#967860','#929488','#949278','#A0A3BD','#BD93A1','#65666B','#6B5745','#6B6664','#695C52','#56695E','#69545C','#565A69','#696043','#63635C','#636150','#333131','#332820','#302D30','#302D1F','#2D302F','#CFB6A3','#362F2A']} 
        />

    </div>
    );
  }
}

export default Demo;

