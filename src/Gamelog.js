import React, { Component } from 'react';
import './App.css';
import Draggable from 'react-draggable';

export default class Gamelog extends Component {
 
/*
scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
}

    <div style={{ float:"left", clear: "both" }}
        ref={(el) => { this.messagesEnd = el; }}>
    </div>

componentDidMount = () => {
    this.scrollToBottom();
}

componentDidUpdate = () => {
    this.scrollToBottom();
}
*/
    
render(){

    let gameLog = ""

    gameLog = this.props.log.map((s, index) => <div className={s.type} key={index}>{s.message}</div>);


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
            <div className="handle"><div className="game-log">
            {gameLog}
            </div></div> 
  
      </Draggable>
    )
  }
}

//<div align="left" style={{paddingLeft: 15, overflow:"auto", borderRadius: "5px", opacity: 0.9, background: "#282c34", fontSize: "10px", color: "#65ff63", position: "absolute", height: 150, width: 250, top: 100, left: 500}}>