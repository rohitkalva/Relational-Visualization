import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom'
import Components from './components/components';
//import Heatmap from './heatmap';

class App extends Component {

  render() {
    
    return(
      <BrowserRouter>
      <Components />
      </BrowserRouter>
 )
  }
};

export default App;