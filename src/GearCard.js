import React, { Component } from 'react';
import './App.css';

export default class GearCard extends Component {
 
selectGear = () => {
    this.props.selectGear(this.props.index, false);
}
specialUseGear = () => {
    this.props.specialUseGear(this.props.index);
}

  render(){

    let specialUse = <div></div>
    let gearCard = <div></div>
    /*
    if(this.props.gearCard.gearEffect !== null){
        specialUse = <button onClick={this.specialUseGear}>{this.props.gearCard.gearEffect.useName}</button>
    }
    */
    if(this.props.gearCard.type === "ARMOUR"){
        gearCard = 
        <div>
            <div className="gear-card-title">{this.props.gearCard.name}</div>
            <div className="gear-card-armour">{this.props.gearCard.hitpoints}</div>
            <br/>
            <div className="gear-card-description">{this.props.gearCard.description}</div>
            
        </div>
    }
    else if(this.props.gearCard.type === "WEAPON"){
        gearCard = 
        <div>
            <div className="gear-card-title">{this.props.gearCard.name}</div>
            {this.props.gearCard.attackValues[0].speed},
            {this.props.gearCard.attackValues[0].toHitValue}+,
            {this.props.gearCard.attackValues[0].strengthBonus}
            <br/>
            <div className="gear-card-description">{decodeURI(this.props.gearCard.description)}</div>
            <button onClick={this.selectGear} >Equip</button>
            {specialUse}
        </div>
    }

    return(
        <div className="gear-card">  
            {gearCard}
        </div>
    )
  }
}

//black chess knight: ♞
//thunder: ⚡
//Dice: ⚄
