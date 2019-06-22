import React, { Component } from 'react';
import '../App.css';
import lantern from '../images/lantern2.png';

export default class InfoBox extends Component {
 
  riskOfTrapSingleDraw = (cardsRemaining) => {
    if(cardsRemaining > 0){
      return 1/cardsRemaining;
    }
    else return -1;
  }

  riskOfTrapDrawMany = (cardsRemaining, cardsDrawn) => {
    if(cardsDrawn >= cardsRemaining){
      return 1;
    }
    else {
      let inverseRisk = 1;
      for(let n=1; n<=cardsDrawn; n++){
          inverseRisk =  inverseRisk * ((cardsRemaining-n)/(cardsRemaining-(n-1)));
      }
      return 1-inverseRisk;
    }
  }

  printTokens = (negativeTokens) => {
    let tokenStr = "";
    for(let n=0; n<negativeTokens.length; n++){
      tokenStr = tokenStr + negativeTokens[n] +","
    }
    return tokenStr.substring(0, tokenStr.length - 1);
  }

  render(){

    let name ="";
    let id="";
    let survival="";
    let movesLeft="";
    let activationsLeft="";
    let status ="";
    let bleed = "";
    let weapon = "";
    let infoBox = <div></div>

    if(this.props.hover==="survivor"){
      if(this.props.survivor !== undefined){
        name = this.props.survivor.name;
        id = this.props.survivor.id;
        survival = this.props.survivor.survival;
        movesLeft = this.props.survivor.movesLeft;
        activationsLeft = this.props.survivor.activationsLeft;
        status = this.props.survivor.status;
        bleed = this.props.survivor.bleed;
        weapon = this.props.weapon.name;

        infoBox = 
        <div className="handle round-gradient info-box" style={{position: "absolute", top: this.props.top-50, left: this.props.left+25}}>
          <ul className="info-box-list">
          <li><b>{name+", id=" +id}</b></li>
          <li>Survival: {survival}</li>
          <li>Bleed: {bleed}</li>
          <li>Moves left: {movesLeft}</li>
          <li>Activations left: {activationsLeft}</li>
          <li>Status: {status}</li>
          <li>Equiped weapon: {weapon}</li>
          </ul>
          <img className="lantern-corner" src={lantern} alt="lantern"/>
        </div>
      }
    }
    else if(this.props.hover==="monster"){
      let monster = this.props.monster;
      if(monster !== undefined){
        let trapRisk1 = this.riskOfTrapDrawMany(this.props.hlDeck.cardsInDeck.length, 1)*100;
        let trapRisk2 = this.riskOfTrapDrawMany(this.props.hlDeck.cardsInDeck.length, 2)*100;
        let trapRisk3 = this.riskOfTrapDrawMany(this.props.hlDeck.cardsInDeck.length, 3)*100;

        let negativeTokens = <li></li>;
        if(monster.negativeTokens !== null && monster.negativeTokens.length > 0){
          negativeTokens = <li>Negative tokens: {this.printTokens(monster.negativeTokens)}</li>;
        }
        let positiveTokens = <li></li>;
        if(monster.positiveTokens !== null && monster.positiveTokens.length > 0){
          positiveTokens = <li>Positive tokens: {this.printTokens(monster.positiveTokens)}</li>;
        }

        let persistantInjuries0 = null;
        let persistantInjuries1 = null;
        let persistantInjuries2 = null;
        if(monster.hlDeck.cardsRemoved && monster.hlDeck.cardsRemoved.length > 0){
          persistantInjuries0 = <li>_ _ _ _ _ _ _ _ _ _ _ _ _ _ </li> 
          persistantInjuries1 = <li><b>Persistant Injuries:</b></li> 
          persistantInjuries2 = monster.hlDeck.cardsRemoved.map((card, index) => <li key={index} >{card.criticalWound.cardEffect.name}</li>)
        }

        let trapRiskStr = "(" +trapRisk1.toFixed(0) +"/" +trapRisk2.toFixed(0) +"/" +trapRisk3.toFixed(0) +"% risk of trap)"
        infoBox = 
        <div className="handle round-gradient info-box" style={{position: "absolute", top: this.props.top-50, left: this.props.left}}>
          <ul className="info-box-list">
            <li><b>{this.props.monster.name}</b></li>
            <li>Status: {this.props.monster.status}</li>
            <li>Movement: {this.props.monster.statline.movement}</li>
            <li>Toughness: {this.props.monster.statline.toughness}</li>
            <li>Remaining AI: {this.props.aiDeck.cardsInDeck.length + this.props.aiDeck.cardsInDiscard.length} ({this.props.aiDeck.cardsInDeck.length}+{this.props.aiDeck.cardsInDiscard.length})</li>
            <li>Lost AI: {this.props.aiDeck.cardsRemoved.length}</li>
            <li>Remaining HL cards: {this.props.hlDeck.cardsInDeck.length} {trapRiskStr}</li>
            <li>Activated this turn: {this.props.monster.activatedThisTurn.toString()}</li>
            {negativeTokens}
            {positiveTokens}
            {persistantInjuries0}
            {persistantInjuries1}
            {persistantInjuries2}
          </ul>
        </div>
      }
    }
    else if(this.props.selection==="board"){
      infoBox = <div>
      Tile Status
      <li>Board tile selected</li>
      </div>
    }
    else {

    }

    return(
      <div>
        {infoBox} 
      </div>
    )
  }
}