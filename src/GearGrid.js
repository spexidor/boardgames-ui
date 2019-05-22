import React, { Component } from 'react';
import './App.css';
import Draggable from 'react-draggable';
import GearCard from './GearCard';

export default class ActionBox extends Component {
 
  render(){

    let gear = this.props.survivor.gearGrid.gear.map((gear, index) => <GearCard key={index} index={index} act={this.props.act} selectGear={this.props.selectGear.bind(this)} specialUseGear={this.props.specialUseGear.bind(this)} top={index*100} gearCard={gear}/>)

    let gearGrid = 
    <div>
        <div className="gear-grid-left"><button onClick={this.props.showGearGrid}>Hide Grid</button><br></br>
        Survivor: {this.props.survivor.name}
        </div>
        <div className="gear-grid-right">
        {gear}
        </div>
    </div>

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