import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './Home'
import ChordFinal from './chord/ChordDiagram'
import Heatmap from './heatmap'
import BarT from './BarT'
import BarK from './BarK'
import PieT from './PieT'
import PieK from './PieK'
import Treetable from './tree/testmap'


class Main extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      data: [],
      selectedRank: "phylum",
      selectedCategory: "Ligand",
      treekeyData: [],
      treetaxData: []
    }
    this.importJSON = this.importJSON.bind(this);
    this.onchangeCategory = this.onchangeCategory.bind(this);
    this.onchangeRank = this.onchangeRank.bind(this);
    this.importtreekeyword = this.importtreekeyword.bind(this);
    this.importtreetaxonomy = this.importtreetaxonomy.bind(this);
  }

  componentWillMount(){
    this.importJSON()
    this.importtreekeyword()
    this.importtreetaxonomy()
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

  importtreekeyword(){
    return fetch ("http://localhost:8080/visualization/tree/keyword")
    .then(response => response.json())
    .then(responseJson => {
      this.setState({
        treekeyData: responseJson.keyword
    })       
    })
  }

  importtreetaxonomy(){
    return fetch ("http://localhost:8080/visualization/tree/taxonomy")
    .then(response => response.json())
    .then(responseJson => {
      this.setState({
        treetaxData: responseJson.taxonomy
    })       
    })
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
      <Route path='/BarT' component={BarT}/>
      <Route path='/BarK' component={BarK}/>
      <Route path='/PieT' component={PieT}/>
      <Route path='/PieK' component={PieK}/>
      <Route path='/Treetable' render={()=><Treetable treekeyData={this.state.treekeyData} treetaxData={this.state.treetaxData} />}/>
      
    </Switch>
  </main>
    )
  }
}
export default Main
