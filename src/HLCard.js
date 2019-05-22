import React, { Component } from 'react';
import './App.css';
import Draggable from 'react-draggable';
import lantern from './images/lantern_white.png';

export default class Gamelog extends Component {
 
render(){

    //Input:
    let hlCard = this.props.hlCard;
    
    /*
    let hlCard = {
        title: "Glorious Mane",
        impervious: true,
        description: "Impervious hit locations cannot be wounded. A wound or critical wound will not remove an AI card or defeat the monster.",
        critable: true,
        persistantInjury: false,
        reflexEffect: false,
        failureEffect: true,
        woundEffect: false,
        trap: true,
        criticalWound: {
            description: "Text description"
        }
    }
    */
    

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
        reflex = <div><div className="border-box hlCard-diamond hlCard-diamond-reflex"><div className="ghost"><div className="border-box  hlCard-diamond-reflex-char">{reflexChar}</div></div></div><div className="border-box  hlCard-reflex">{reflexStr}</div></div>
    }
    
    let description = <div className="border-box hlCard-description">{reflex}{hlCard.description}</div>

    let impervious = <div></div>
    if(hlCard.impervious){
        impervious = <div className="border-box hlCard-impervious">Impervious</div>
    }
    let persistantInjury = <div></div>
    if(hlCard.persistantInjury){
        persistantInjury = <div className="border-box hlCard-persistant">Persistant Injury | Keep in Play</div>
    }
    let crit = <div></div>
    //console.log("hlCard: " +hlCard.title);
    if(hlCard.critable){
        crit = 
        <div className="border-box hlCard-critical">
        <br/><br/>
        <b>Critical Wound</b><br/><br/>
            <div className="border-box hlCard-diamond hlCard-diamond-lantern"><div className="border-box ghost"><img className="border-box hlCard-lantern-image" src={lantern} alt="border-box lantern"/></div></div>
            {hlCard.criticalWound.description}
            {persistantInjury}
        </div>
    }
    let titleClassName = "border-box hlCard-top";
    if(hlCard.trap){
        titleClassName = titleClassName +" hlCard-top-trap";
    }
    let title = <div className={titleClassName}>{hlCard.title}</div>
    
    let top = this.props.top;
    let left = this.props.left;

    const hlCardGraphics = 
    <div className="border-box hlCard" style={{position: "absolute", top: top, left: left}}>
        {description}
        {title}
        {impervious}
        
        {crit}
    </div>

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
            <div className="handle">
                {hlCardGraphics}
            </div>
  
      </Draggable>
    )
  }
}