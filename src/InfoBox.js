import React, { Component } from 'react';
import './App.css';
import Draggable from 'react-draggable';

export default class InfoBox extends Component {
 
  render(){

    let name ="";
    let id="";
    let survival="";
    let movesLeft="";
    let activationsLeft="";
    let status ="";
    let bleed = "";
    let infoBox = <div></div>

    if(this.props.selection==="survivor"){
      if(this.props.survivor !== undefined){
        name = this.props.survivor.name;
        id = this.props.survivor.id;
        survival = this.props.survivor.survival;
        movesLeft = this.props.survivor.movesLeft;
        activationsLeft = this.props.survivor.activationsLeft;
        status = this.props.survivor.status;
        bleed = this.props.survivor.bleed;

        infoBox = <div>
        Survivor Status
        <ul>Survivor: {name+", id=" +id}</ul>
        <ul>Survival: {survival}</ul>
        <ul>Bleed: {bleed}</ul>
        <ul>Moves left: {movesLeft}</ul>
        <ul>Activations left: {activationsLeft}</ul>
        <ul>Status: {status}</ul>
        </div>
      }
    }
    else if(this.props.selection==="monster"){
      if(this.props.monster !== undefined){
        infoBox = <div>
        Monster Status
        <ul>Name: {this.props.monster.statline.name}</ul>
        <ul>Movement: {this.props.monster.statline.movement}</ul>
        <ul>Toughness: {this.props.monster.statline.toughness}</ul>
        <ul>Remaining AI: {this.props.aiDeck.cardsInDeck.length + this.props.aiDeck.cardsInDiscard.length}</ul>
        <ul>Activated this turn: {this.props.monster.activatedThisTurn.toString()}</ul>
        </div>
      }
    }
    else if(this.props.selection==="board"){
      infoBox = <div>
      Tile Status
      <ul>Board tile selected</ul>
      </div>
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
      <div className="handle" align="left" style={{borderRadius: "5px", opacity: 0.9, background: "#282c34", fontSize: "10px", color: "white", position: "absolute", height: 150, width: 250, top: 125, left: 800}}>
          {infoBox} 
      </div>
      </Draggable>
    )
  }
}