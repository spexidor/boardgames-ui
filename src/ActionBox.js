import React, { Component } from 'react';
import './App.css';
//import Draggable from 'react-draggable';

export default class ActionBox extends Component {
 
  deadOrKnockedDown = () => {
      return (this.props.survivor.status === "KNOCKED_DOWN" || this.props.survivor.status === "DEAD");
  }

  render(){

    //survivor
    let activateDisabled = false;
    let moveDisabled = false;
    let moveDisabledReasonStr = "";
    let activateDisabledReasonStr = "";
    if(this.props.act === "MONSTERS"){
        moveDisabled = true;
        moveDisabledReasonStr = "Waiting for survivors turn";
    }
    else if(this.props.survivor.movesLeft < 1){
        moveDisabled = true;
        moveDisabledReasonStr = "No moves left";
    }
    else if(this.deadOrKnockedDown()){
        moveDisabled = true;
        moveDisabledReasonStr = "Knocked down";
    }
    if(this.props.survivor.activationsLeft < 1){
        activateDisabled = true;
        activateDisabledReasonStr = "No activations left";
    }
    else if(this.deadOrKnockedDown() || this.props.act === "MONSTERS"){
        activateDisabled = true;
    }

    let moveActive = "";
    if(this.props.moveSelected){
        moveActive = "button-active";
    }

    let actionBox = <div></div>
    if(this.props.selection==="survivor"){

        actionBox = 
        <div>
        <button disabled={moveDisabled} className={moveActive} onClick={this.props.survivorMove}>Move</button>
        <button disabled={activateDisabled} onClick={this.props.activate}>Activate</button>
        <button onClick={this.props.showGearGrid}>Gear</button>
        {moveDisabled ? <i>{moveDisabledReasonStr}</i>: null}
        {activateDisabled ? <i>{activateDisabledReasonStr}</i>: null}
        </div>
    }
    else if(this.props.selection==="monster"){
        actionBox = 
        <div>
        <button className="button" onClick={this.props.changeFacing.bind(this, "UP")}>Turn up</button>
        <button className="button" onClick={this.props.changeFacing.bind(this, "DOWN")}>Turn down</button>
        <button className="button" onClick={this.props.changeFacing.bind(this, "LEFT")}>Turn left</button>
        <button className="button" onClick={this.props.changeFacing.bind(this, "RIGHT")}>Turn right</button>
        </div>
    }
    
    return(
        <div className="round-gradient action-box">
            {actionBox}
        </div>
    )
  }
}
