import React, { Component } from 'react';
import './App.css';
import Draggable from 'react-draggable';
import GearCard from './GearCard';

export default class ActionBox extends Component {
 
  render(){

    let gear = this.props.survivor.gearGrid.gear.map((gear, index) => <GearCard key={index} index={index} act={this.props.act} selectGear={this.props.selectGear.bind(this)} specialUseGear={this.props.specialUseGear.bind(this)} gearCard={gear}/>)

    let gearGridLeft = 
        <div className="gear-grid-left"><button onClick={this.props.showGearGrid}>Hide Grid</button><br></br>
        Survivor: {this.props.survivor.name}
        </div>
        
    let gearGridRight = <div className="gear-grid-right">
        {gear}
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
            <div className="handle gear-grid">
                    {gearGridLeft}
                    {gearGridRight}
            </div>
        </Draggable>
    )
  }
}