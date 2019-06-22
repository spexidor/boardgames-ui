import React, { Component } from 'react';
import '../App.css';
import Draggable from 'react-draggable';

export default class Gamelog extends Component {
 

scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth", block: 'nearest', inline: 'start' });
}

componentDidMount = () => {
    this.scrollToBottom();
}

componentDidUpdate = () => {
    this.scrollToBottom();
}

    
render(){

    let gameLog = ""

    gameLog = this.props.log.map((s, index) => 
    <div ref={(el) => { this.messagesEnd = el; }} className={s.type} key={index}>
        {s.message}
    </div>);


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
            <div className="handle game-log" >
                {gameLog}
            </div>
      </Draggable>
    )
  }
}