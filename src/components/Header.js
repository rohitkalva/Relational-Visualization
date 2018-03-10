import React from 'react'
import { Link } from 'react-router-dom'

// The Header creates links that can be used to navigate
// between routes.
const Header = () => (
  <header>
    <nav>
      <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/Chordfinal'>Chord</Link></li>
        <li><Link to='/heatmap'>HeatMap</Link></li>
        <li><Link to='/Bar'>Bar</Link></li>
        <li><Link to='/Pie'>Pie</Link></li>
        </ul>
    </nav>
  </header>
)

export default Header
