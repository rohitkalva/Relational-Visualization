import React from 'react'
import { Switch, Route,Link } from 'react-router-dom'
import BarK from './BarK'
import BarT from './BarT'

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /Chordfinal
// and /Heatmap routes will match any pathname that starts
// with /Chordfinal or /Heatmap. The / route will only match
// when the pathname is exactly the string "/"
const Bar = () => (
    <ul>
        <h1> Please Select Option </h1>
    <li><Link to='/BarK'>Keyword</Link></li>
    <li><Link to='/BarT'>Taxonomy</Link></li>
    </ul>
)

export default Bar
