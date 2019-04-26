import React, { Component } from 'react';
import './App.css';

export default class ActionBox extends Component {
 
  deadOrKnockedDown = () => {
      return (this.props.survivor.status === "KNOCKED_DOWN" || this.props.survivor.status === "DEAD");
  }

  render(){

    //survivor
    let moveDisabled = false;
    let activateDisabled = false;
    if(this.props.survivor.movesLeft < 1 || this.deadOrKnockedDown()){
        moveDisabled = true;
    }
    if(this.props.survivor.activationsLeft < 1 || this.deadOrKnockedDown()){
        activateDisabled = true;
    }

    //monster
    let attackDisabled = true;
    let getTargetDisabled = true;
    if(this.props.targets.length === 1){
        attackDisabled = false;
    }
    if(this.props.aiCard !== 0){
        getTargetDisabled = false;
    }

    let actionBox = <div></div>
    if(this.props.selection==="survivor"){
        actionBox = 
        <div>
        <button disabled={moveDisabled} onClick={this.props.move}>Move</button>
        <button disabled={activateDisabled} onClick={this.props.activate}>Activate</button>
        </div>
    }
    else if(this.props.selection==="monster"){
        actionBox = 
        <div>
        <button onClick={this.props.revealAI}>New AI</button>
        <button disabled={getTargetDisabled} onClick={this.props.target}>Get target</button>
        <button onClick={this.props.move}>Move</button>
        <button disabled={attackDisabled} onClick={this.props.attack}>Attack</button>
        <br/><br/>
        <button onClick={this.props.changeFacing.bind(this, "UP")}>Turn up</button>
        <button onClick={this.props.changeFacing.bind(this, "DOWN")}>Turn down</button>
        <button onClick={this.props.changeFacing.bind(this, "LEFT")}>Turn left</button>
        <button onClick={this.props.changeFacing.bind(this, "RIGHT")}>Turn right</button>
        </div>
    }
    else{
        actionBox = <button onClick={this.props.nextTurn}>Next turn</button>
    }
    
    return(
        <div align="left" style={{borderRadius: "5px", background: "#282c34", fontSize: "12px", color: "white", position: "absolute", height: 200, width: 250, top: 300, left: 800}}>   
            {actionBox}
        </div>   
    )
  }
}

//<button disabled={true} onClick={this.props.attack}>Attack</button>