import React, { Component } from 'react';
import '../App.css';
import lantern from '../images/lantern_white.png';

export default class HLCard extends Component {

clickedCard = () => {
    if(!this.props.trapRevealed || (this.props.trapRevealed && this.props.hlCard.trap)){
        this.props.clickedCard(this.props.hlCard);
    }
}

render(){

    let grayScale = "";
    if(this.props.trapRevealed && !this.props.hlCard.trap){
        grayScale = "gray-scale";
    }

    //Input:
    let hlCard = this.props.hlCard;
    
    let reflex = <div></div>
    let reflexStr = "";
    let reflexChar = "";
    if(hlCard.reflexEffect){
        reflexStr = "Reflex";
        reflexChar = "R";
    }
    if(hlCard.failureEffect){
        reflexStr = "Failure";
        reflexChar = "F";
    }
    if(hlCard.woundEffect){
        reflexStr = "Wound";
        reflexChar = "W";
    }
    if(reflexStr.length !== 0){
        reflex = 
        <div className="hlCard-reflex">
            <div className="border-box hlCard-diamond hlCard-diamond-reflex">
                <div className="ghost">
                    <div className="border-box  hlCard-diamond-reflex-char">{reflexChar}</div>
                </div>
            </div>
            <div className="border-box hlCard-reflex-title">{reflexStr}</div>
        </div>
    }
    
    let description = <div className="border-box hlCard-description">{hlCard.description}</div>

    let impervious = <div></div>
    if(hlCard.impervious){
        impervious = <div className="border-box hlCard-impervious">Impervious</div>
    }
    let persistantInjuryFooter = <div></div>
    let persistantInjuryDescription = <div></div>
    if(hlCard.critable && hlCard.criticalWound && hlCard.criticalWound.persistantInjury){
        persistantInjuryDescription = <div className="border-box hlCard-persistant-title">💀Persistant Injury - {hlCard.criticalWound.cardEffect.name}</div>
        persistantInjuryFooter = <div className="border-box hlCard-persistant">Persistant Injury | Keep in Play</div>
    }
    let crit1 = <div></div>
    let crit2 = <div></div>
    let crit3 = <div></div>
    //console.log("hlCard: " +hlCard.title);
    if(hlCard.critable && hlCard.criticalWound){
        crit1 = 
        <div className="border-box hlCard-critical">
        <b>Critical Wound</b>
        </div>
        crit2 = 
        <div className="hlCard-diamond hlCard-diamond-lantern">
            <div className="border-box ghost">
                <img className="border-box hlCard-lantern-image" src={lantern} alt="border-box lantern"/>
            </div>
        </div>
            
        crit3 = 
        <div className="hlCard-critical-description">
            {hlCard.criticalWound.description}
        </div>
    }
    let titleClassName = "border-box hlCard-top";
    if(hlCard.trap){
        titleClassName = titleClassName +" hlCard-top-trap";
    }
    let title = <div className={titleClassName}>{hlCard.title}</div>
    let className = "border-box hlCard " +grayScale;
    
   return(
    <div className={className} onClick={this.clickedCard}>
        {title}
        {impervious}
        {reflex}
        {description}
        {crit2}
        {crit1}
        {persistantInjuryDescription}
        {crit3}
        {persistantInjuryFooter}
    </div>
    )
  }
}