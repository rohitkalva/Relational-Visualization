import React, { Component } from 'react';
import '../../css/style.css';
import '../../css/bootstrap.min.css';
import ChordDiagram from 'react-chord-diagram';

class Chord extends Component {

render() {
  return (
    <div>

    <ChordDiagram
                   matrix={this.props.matrix}
                   componentId={0}
                   width={700}
                   outerRadius={200}
                   innerRadius={190}
                   height={620}
                   style={{fontFamily: '10px sans-serif'}}
                   groupLabels={this.props.labels}
                   padAngle={0.05}
                   groupColors={['#99677B','#362F2A','#7B68EE','#FFFF00','#FF0000','#98FB98','#800000','#000000','#00FFFF','#C0C0C0']}
                   />
               </div>

    );
       }
}



export default Chord;







