import React, { Component } from 'react';
import './App.css';
import Draggable from 'react-draggable';

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
    let moveActive = "";
        if(this.props.moveSelected){
            moveActive = "button-active";
        }

    let actionBox = <div></div>
    if(this.props.selection==="survivor"){

        actionBox = 
        <div>
        <button className={moveActive} disabled={moveDisabled} onClick={this.props.move}>Move</button>
        <button disabled={activateDisabled} onClick={this.props.activate}>Activate</button>
        <button onClick={this.props.showGearGrid}>Gear Grid</button>
        </div>
    }
    else if(this.props.selection==="monster"){
        actionBox = 
        <div>
        <button onClick={this.props.revealAI}>New AI</button>
        <button disabled={getTargetDisabled} onClick={this.props.target}>Get target</button>
        <button className={moveActive} onClick={this.props.move}>Move</button>
        <button disabled={attackDisabled} onClick={this.props.attack}>Attack</button>
        <br/><br/>
        <button onClick={this.props.changeFacing.bind(this, "UP")}>Turn up</button>
        <button onClick={this.props.changeFacing.bind(this, "DOWN")}>Turn down</button>
        <button onClick={this.props.changeFacing.bind(this, "LEFT")}>Turn left</button>
        <button onClick={this.props.changeFacing.bind(this, "RIGHT")}>Turn right</button>
        </div>
    }
    else{
        let nextAct ="";
        if(this.props.act === "SURVIVORS"){
            nextAct = "Go to Monsters act";
        }
        else{
            nextAct = "Go to Survivors act";
        }
        actionBox = <button onClick={this.props.nextAct}>{nextAct}</button>
    }
    
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
            <div className="handle" align="left" style={{borderRadius: "5px", opacity: 0.9, background: "#282c34", fontSize: "12px", color: "white", position: "absolute", height: 200, width: 250, top: 300, left: 800}}>   
                {actionBox}
            </div>
        </Draggable>
    )
  }
}

//<button disabled={true} onClick={this.props.attack}>Attack</button>