import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './Home'
import Chordfinal from './chord/ChordDiagram'
//import AppComponent from './appComponent';
//import ChordComponent from './chordComponent';
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


const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/ChordDiagram' component={Chordfinal}/>
      <Route path='/Heatmap' component={Heatmap}/>
      <Route path='/Bar' component={Bar}/>
      <Route path='/BarT' component={BarT}/>
      <Route path='/BarK' component={BarK}/>
      <Route path='/Pie' component={Pie}/>
      <Route path='/PieT' component={PieT}/>
      <Route path='/PieK' component={PieK}/>
      
    </Switch>
  </main>
)

export default Main
