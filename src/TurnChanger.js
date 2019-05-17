import React from 'react';
import './App.css';

export default class TurnChanger extends React.Component {

    render() {
  
    let nextAct ="";
    let monsterAction =<div></div>;
    if(this.props.act === "SURVIVORS"){
        nextAct = "Go to Monsters act";
    }
    else{
        nextAct = "Go to Survivors act";
        monsterAction = <button onClick={this.props.revealAI}>New AI</button>;
    }
    let actionBox = <button onClick={this.props.nextAct}>{nextAct}</button>
    
      return (
        <div className="round-gradient turn-changer">
        {actionBox}
        {monsterAction}
        </div>
      );
    }
  }
