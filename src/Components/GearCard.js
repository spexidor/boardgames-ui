import React, { Component } from 'react';
import '../App.css';

export default class GearCard extends Component {
 
selectGear = () => {
    this.props.selectGear(this.props.gearCard, -1);
}
specialUseGear = () => {
    this.props.specialUseGear(this.props.gearCard, 1);
}

  render(){

    let specialUse = <div></div>
    let gearCard = <div></div>
    
    if(typeof this.props.gearCard.attackProfiles !== 'undefined' && this.props.gearCard.attackProfiles.length > 0){
        
        for(let n=0; n<this.props.gearCard.attackProfiles.length; n++){
            if(this.props.gearCard.attackProfiles[n].useName != null){
                specialUse = <button className="gear-card-button" disabled={this.props.act === "MONSTERS"} onClick={this.specialUseGear}>{this.props.gearCard.attackProfiles[n].useName}</button>
            }
        }
    }
    
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
            {this.props.gearCard.attackProfiles[0].speed},
            {this.props.gearCard.attackProfiles[0].toHitValue}+,
            {this.props.gearCard.attackProfiles[0].strengthBonus}
            <br/>
            <div className="gear-card-description">{this.props.gearCard.description}</div>
            <button className="gear-card-button" onClick={this.selectGear} >Equip</button>
            {specialUse}
        </div>
    }

    return(
        <div className="gear-card border-box">  
            {gearCard}
        </div>
    )
  }
}

//black chess knight: ♞
//thunder: ⚡
//Dice: ⚄
