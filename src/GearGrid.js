import React, { Component } from 'react';
import './App.css';
import Draggable from 'react-draggable';

export default class ActionBox extends Component {
 
  render(){

    let gearGrid = <div></div>

    return(
        <Draggable
            axis="both"
            handle=".handle"
            defaultPosition={{x: 0, y: 0}}
            position={null}
            grid={[1, 1]}
            scale={1}
            onStart={this.handleStart}
            onDrag={this.handleDrag}
            onStop={this.handleStop}>
            <div className="handle">
                <div className="gear-grid">  
                    {gearGrid}
                </div>
            </div>
        </Draggable>
    )
  }
}

//<button disabled={true} onClick={this.props.attack}>Attack</button>