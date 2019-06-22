import React from 'react';
import '../App.css';

export default class TurnChanger extends React.Component {

    render() {
  
    let nextAct ="";
    let newAiButton =<div></div>;
    let nextActDisabled = false;
    let nextActTooltip = "";

    if(this.props.act === "SURVIVORS"){
        nextAct = "> Go to Monsters act >";
    }
    else{
        nextAct = "> Go to Survivors act >";
        nextActDisabled = !this.props.activatedThisTurn;
        const newAiDisabled = this.props.activatedThisTurn;

        let newAiDisabledReasonStr = "";
        
        if (newAiDisabled) {
          newAiDisabledReasonStr = "Monster activated this turn"
        }
        if (nextActDisabled) {
          
          nextActTooltip = "No AI Card has been revealed yet"
        }
        newAiButton = 
        <div>
          <span data-tip={newAiDisabledReasonStr}>
            <button disabled={newAiDisabled} onClick={this.props.revealAI}>New AI</button>
          </span>
        </div>
    }
      let nextActButton = 
      <div>
        <span data-tip={nextActTooltip}>
          <button disabled={nextActDisabled} onClick={this.props.nextAct}>{nextAct}</button>
        </span>
      </div>
        
    
      return (
        <div className="round-gradient turn-changer">
          {newAiButton}
          {nextActButton}
        </div>
      );
    }
  }
