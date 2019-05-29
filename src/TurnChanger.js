import React from 'react';
import './App.css';

export default class TurnChanger extends React.Component {

    render() {
  
    let nextAct ="";
    let monsterAction =<div></div>;
    let showHLSelecter = <div></div>;
    if(!this.props.selectHLCard && this.props.hlCards.length > 0){
      showHLSelecter = <button onClick={this.props.toggleHLSelecter}>Show HL selecter</button>
    }
    if(this.props.act === "SURVIVORS"){
        nextAct = "Go to Monsters act";
    }
    else{
        nextAct = "Go to Survivors act";
        monsterAction = 
        <div>
          <button disabled={this.props.activatedThisTurn} onClick={this.props.revealAI}>New AI</button>
          {this.props.activatedThisTurn ? <i>Monster activated this turn</i>: null} 
        </div>
    }
      let actionBox = 
      <div>
        {showHLSelecter}
        <button onClick={this.props.nextAct}>{nextAct}</button>
      </div>
        
    
      return (
        <div className="round-gradient turn-changer">
          {actionBox}
          {monsterAction}
        </div>
      );
    }
  }
