import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './Home'
import Chordfinal from './Chordfinal'
import Heatmap from './heatmap'
import Bar from './Bar'
import BarT from './BarT'
import BarK from './BarK'
import Pie from './Pie'
import PieT from './PieT'
import PieK from './PieK'
import PieKp from './PieKp'
import PieKPe from './PieKPe';
import PieTp from './PieTp';
import PieTPe from './PieTPe';


// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /Chordfinal
// and /Heatmap routes will match any pathname that starts
// with /Chordfinal or /Heatmap. The / route will only match
// when the pathname is exactly the string "/"
const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/Chordfinal' component={Chordfinal}/>
      <Route path='/Heatmap' component={Heatmap}/>
      <Route path='/Bar' component={Bar}/>
      <Route path='/BarT' component={BarT}/>
      <Route path='/BarK' component={BarK}/>
      <Route path='/Pie' component={Pie}/>
      <Route path='/PieT' component={PieT}/>
      <Route path='/PieK' component={PieK}/>
      <Route path='/PieKp' component={PieKp}/>
      <Route path='/PieKPe' component={PieKPe}/>
      <Route path='/PieTp' component={PieTp}/>
      <Route path='/PieTPe' component={PieTPe}/>
      
    </Switch>
  </main>
)

export default Main
