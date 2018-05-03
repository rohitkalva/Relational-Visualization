import React, {Component} from 'react'
import { Link } from 'react-router-dom'

// The Header creates links that can be used to navigate
// between routes.

class Header extends Component{

  render(){
    return (
      <header>
      <nav className="navbar navbar-inverse">
    <div className="container-fluid">
      <div className="navbar-header">
        <a className="navbar-brand" href="/">Relational Visualization</a>
      </div>
      <ul className="nav navbar-nav">
      <li><Link to='/'>Home</Link></li>
      <li><Link to='/ChordDiagram'>Chord</Link></li>
      <li><Link to='/heatmap'>HeatMap</Link></li>
      <li><Link to='/Bar'>Bar</Link></li>
      <li><Link to='/Pie'>Pie</Link></li>
      </ul>
    </div>
      </nav>
    </header>
   
    )
  }
}

export default Header
