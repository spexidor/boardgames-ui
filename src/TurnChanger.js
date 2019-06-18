import React from 'react';
import './App.css';

export default class TurnChanger extends React.Component {

    render() {
  
    let nextAct ="";
    let monsterAction =<div></div>;
    let nextActDisabled = false;

    if(this.props.act === "SURVIVORS"){
        nextAct = "Go to Monsters act";
    }
    else{
        nextAct = "Go to Survivors act";
        nextActDisabled = !this.props.activatedThisTurn;
        monsterAction = 
        <div>
          <button disabled={this.props.activatedThisTurn} onClick={this.props.revealAI}>New AI</button>
          {this.props.activatedThisTurn ? <i>Monster activated this turn</i>: null} 
        </div>
    }
      let actionBox = 
      <div>
        <button disabled={nextActDisabled} onClick={this.props.nextAct}>{nextAct}</button>
      </div>
        
    
      return (
        <div className="round-gradient turn-changer">
          {monsterAction}
          {actionBox}
        </div>
      );
    }
  }
