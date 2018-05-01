import React, {Component} from 'react'
import { Link } from 'react-router-dom'

// The Header creates links that can be used to navigate
// between routes.

class Header extends Component{

  constructor(props){
    super(props)
    this.state = {
      data: []
    }
    this.importJSON = this.importJSON.bind(this);
    this.actualCallback = this.actualCallback.bind(this);
  }

  componentDidMount(){
    this.importJSON()
  }

  actualCallback(data) {    
    if(data.fulldata)
        this.setState({
            data: data.fulldata
        })
    else
        console.error("Empty response")
      }

  importJSON(){
    return fetch ("https://bitbucket.org/rohitkalva/viz/raw/adce478b74bae4e1204d057b3d0171d52e336648/fulldata_sort.json")
    .then(response => response.json())
    .then(responseJson => {
        this.actualCallback(responseJson)            
    })

  }
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
