import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './Home'
import Chordfinal from './Chordfinal'
import Heatmap from './heatmap'

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
    </Switch>
  </main>
)

export default Main
