import React, { Component } from 'react';
import './App.css';

export default class ActionBox extends Component {
 
  deadOrKnockedDown = () => {
      return (this.props.survivor.status === "KNOCKED_DOWN" || this.props.survivor.status === "DEAD");
  }

  render(){

    let activateDisabled = false;
    let moveDisabled = false;
    let moveDisabledReasonStr = "1";
    let activateDisabledReasonStr = "2";
    let gearButtonDisabled = true;

    if(this.props.act === "MONSTERS"){
        moveDisabled = true;
        moveDisabledReasonStr = "Waiting for survivors turn";
        activateDisabledReasonStr = moveDisabledReasonStr;
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

    let monsterActions = <div></div>;
    let actionMove = 
    <div>
        <span data-tip={moveDisabledReasonStr}>
            <button disabled={moveDisabled} className={moveActive} onClick={this.props.survivorMove}>Move</button>
        </span>
    </div>
    let actionActivate = 
    <span data-tip={activateDisabledReasonStr}>
        <button disabled={activateDisabled} onClick={this.props.activate}>Activate</button>
    </span>
    
    if(this.props.selection==="survivor"){
        gearButtonDisabled = false;
    }
    
    let actionShowGearGrid = 
    <div>
        <button disabled={gearButtonDisabled} onClick={this.props.showGearGrid}>Gear</button>
    </div>

    return(
        <div className="round-gradient action-box">
           {actionMove}
           {actionActivate}
           {actionShowGearGrid}
           {monsterActions}
        </div>
    )
  }
}
//<button disabled={moveDisabled} className={moveActive} onClick={this.props.survivorMove}>Move</button>

/*

 <span data-tip={activateDisabledReasonStr}>
                <button disabled={activateDisabled} onClick={this.props.activate}>Activate</button>
            </span>
            <button onClick={this.props.showGearGrid}>Gear</button>
        </div>;

        */