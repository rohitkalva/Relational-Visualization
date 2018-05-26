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


class Main extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      data: [],
      selectedRank: "phylum",
      selectedCategory: "Ligand",
    }
    this.importJSON = this.importJSON.bind(this);
    this.onchangeCategory = this.onchangeCategory.bind(this);
    this.onchangeRank = this.onchangeRank.bind(this);
  }

  componentWillMount(){
    this.importJSON()
  }

  importJSON(){
    //return fetch ("https://bitbucket.org/rohitkalva/viz/raw/master/final.json")
    return fetch ("http://localhost:8080/visualization/chord/fulldata")
    .then(response => response.json())
    .then(responseJson => {
      this.setState({
        data: responseJson.fulldata
    })       
    })
  }


  onchangeRank=(data) => {
    this.setState({
      selectedRank: data
    });
  }

  onchangeRank(val){
    this.setState({
      selectedRank: val
    })
  }

  onchangeCategory(val){
    this.setState({
      selectedCategory: val
    })
  }


  render(){
    console.log(this.state.data)
    return(
      <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/ChordDiagram' render={()=><ChordFinal value={this.state.data} onchangeRank={this.onchangeRank} onchangeCategory={this.onchangeCategory} selectedCategory={this.state.selectedCategory} selectedRank={this.state.selectedRank} importJSON={this.importJSON} />}/>
      <Route path='/Heatmap' render={()=><Heatmap values={this.state.data} onchangeRank={this.onchangeRank} onchangeCategory={this.onchangeCategory} selectedCategory={this.state.selectedCategory} selectedRank={this.state.selectedRank} />}/>
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
