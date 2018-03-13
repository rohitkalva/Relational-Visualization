import React, { Component } from 'react';
import {Container, Sidebar, Dropdown,  Segment, Button, Menu, Icon } from 'semantic-ui-react';
import '../css/style.css'
import '../css/bootstrap.min.css';
import Combobox from '../sidebar/combobox';
import Chord from '../chord/src/chord';
class Chordfinal extends Component {
  constructor(){
    super();
    this.state = {
      matrix: [],
      labels: [],
      chord_labels: [],
      keywords: [],
      taxonomies: [],
      visible: false,
      options: [{ key: 0, text: 'None', value: 0 },
        { key: 1, text: 'Chord Daigram', value: 1 },
        { key: 2, text: 'Pie Chart', value: 2 },
        { key: 3, text: 'Heat Map', value: 3 },
        { key: 4, text: 'Bar Chart', value: 4 }]
    };

    this.toggleVisibility = this.toggleVisibility.bind(this);
    this.setChordParams   = this.setChordParams.bind(this);
    this.clickchord = this.clickchord.bind(this);
  }

  toggleVisibility = () => {
    this.setState({ visible: !this.state.visible });
  };

  setChordParams = () => {
    this.clickchord()
};

componentDidMount(){
    this.clickchord()
  }

clickchord()
{
  const url = 'http://localhost:8080/visualization/taxonomymatrix';
  return fetch(url)
    // https://api.myjson.com/bins/hpbqh
      .then((response)=> response.json())
      .then((responseJson)=>{
        this.setState({
          matrix:responseJson.data.chordMatrix,
          labels:responseJson.data.chordLabel,
          chord_labels:responseJson.data.chordLabel,
          keywords: responseJson.data.keywords,
          taxonomies: responseJson.data.taxonomies
        })})
}

  render() {
    
    return(
      <div>
        <Sidebar.Pushable as={Segment}>
          <div className="ui icon Button">
            <Button basic floated='right' icon onClick={this.toggleVisibility}><Icon name='align justify'/></Button>
          </div>
          <Sidebar
            as={Menu}
            animation='overlay'
            width='very wide'
            direction='right'
            visible={this.state.visible}
            icon='labeled'
            vertical
          >
            <Segment>
              <div>
                <Container textAlign='right'>
                  <Icon onClick={this.toggleVisibility} floated='right' >
                    <Icon name='close'
                          size='large'/>
                  </Icon>
                </Container>
              </div>
              <br/>
               <div className="row"> 
                <div className="row mt-12">
                  <div className="col-md-6 text-right">
                    <Dropdown  placeholder='Select Rank' selection  options={this.state.options}  />
                  </div>
                  <div className="col-md-6 text-left">
                     <Dropdown  placeholder='Select Category' selection  options={this.state.options}  />
                  </div>  
                </div>
               </div>
              <br/>
              <Combobox keywords={this.state.keywords}
                        taxonomies = {this.state.taxonomies}
                        setChordParams = {this.setChordParams}/>
              <br/>
            </Segment>
          </Sidebar>
          <Sidebar.Pusher>
            <Chord matrix={this.state.matrix} labels={this.state.chord_labels}/>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
 )
  }
};

export default Chordfinal;
