import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { Dropdown} from 'semantic-ui-react';

// The Header creates links that can be used to navigate
// between routes.

const optionsBar = [
    {as: Link, content: 'Rank ', to: '/barT', key: 'Rank'},
    {as: Link, content: 'Category', to: '/barK', key: 'Category'},
]

const optionsPie = [
    {as: Link, content: 'Rank ', to: '/pieT', key: 'Rank'},
    {as: Link, content: 'Category', to: '/pieK', key: 'Category'},
]

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
      <li>
       <a>
        <Dropdown options = {optionsBar}  text='Bar'/>  
       </a>
      </li>
      <li>
       <a>
        <Dropdown options = {optionsPie} text='Pie' />  
       </a>
      </li>
      <li><Link to='/Treetable'>Tree Table </Link> </li>
      
      </ul>
    </div>
      </nav>
    </header>
   
    )
  }
}

export default Header
