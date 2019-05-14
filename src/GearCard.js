import React, { Component } from 'react';
import './App.css';

export default class GearCard extends Component {
 
selectGear = () => {
    this.props.selectGear(this.props.gearCard);
}
specialUseGear = () => {
    this.props.specialUseGear(this.props.gearCard);
}

  render(){

    let gearCard = <div></div>
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
            {this.props.gearCard.speed},
            {this.props.gearCard.toHitValue}+,
            {this.props.gearCard.strengthBonus}
            <br/>
            <div className="gear-card-description">{decodeURI(this.props.gearCard.description)}</div>
            <button onClick={this.selectGear} >Use</button>
            <button onClick={this.specialUseGear}>Sling</button>
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
