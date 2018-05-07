import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './Home'
import ChordFinal from './chord/ChordDiagram'
import Heatmap from './heatmap'
import Bar from './Bar'
import BarT from './BarT'
import BarK from './BarK'
import Pie from './Pie'
import PieT from './PieT'
import PieK from './PieK'


// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /Chordfinal
// and /Heatmap routes will match any pathname that starts
// with /Chordfinal or /Heatmap. The / route will only match
// when the pathname is exactly the string "/"


class Main extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      data: []
    }
    this.importJSON = this.importJSON.bind(this);
    //this.actualCallback = this.actualCallback.bind(this);
  }

  componentWillMount(){
    this.importJSON()
  }

  importJSON(){
    return fetch ("https://bitbucket.org/rohitkalva/viz/raw/adce478b74bae4e1204d057b3d0171d52e336648/fulldata_sort.json")
    .then(response => response.json())
    .then(responseJson => {
      this.setState({
        data: responseJson.fulldata
    })       
    })

  }

  render(){
    console.log(this.state.data)
    return(
      <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/ChordDiagram' render={()=><ChordFinal value={this.state.data}/>}/>
      <Route path='/Heatmap' render={()=><Heatmap values={this.state.data}/>}/>
      <Route path='/Bar' component={Bar}/>
      <Route path='/BarT' component={BarT}/>
      <Route path='/BarK' component={BarK}/>
      <Route path='/Pie' component={Pie}/>
      <Route path='/PieT' component={PieT}/>
      <Route path='/PieK' component={PieK}/>
      
    </Switch>
  </main>
    )
  }
}
export default Main
