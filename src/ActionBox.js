import React, { Component } from 'react';
import './App.css';

export default class ActionBox extends Component {
 
  render(){

    let actionBox = <div></div>
    if(this.props.selection==="survivor"){
        actionBox = 
        <div>
        <button onClick={this.props.move}>Move</button>
        <button onClick={this.props.activate}>Activate</button>
        </div>
    }
    else if(this.props.selection==="monster"){
        actionBox = 
        <div>
        <button onClick={this.props.revealAI}>New AI</button>
        <button onClick={this.props.target}>Get target</button>
        <button onClick={this.props.move}>Move</button>
        <button disabled={true} onClick={this.props.attack}>Attack</button>
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

