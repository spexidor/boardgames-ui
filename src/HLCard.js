import React, { Component } from 'react';
import './App.css';
import Draggable from 'react-draggable';
import lantern from './images/lantern_white.png';

export default class Gamelog extends Component {
 
render(){

    //let hlCard = this.props.hlCard;
    let hlCard = {
        title: "Glorious Mane",
        impervious: true,
        description: "Impervious hit locations cannot be wounded. A wound or critical wound will not remove an AI card or defeat the monster.",
        critable: true,
        persistantInjury: true,
        reflexEffect: true,
        failureEffect: false,
        woundEffect: false
    }

    let reflex = <div></div>
    if(hlCard.reflexEffect){
        reflex = <div><div className="border-box hlCard-diamond hlCard-diamond-reflex"><div className="ghost"><div className="border-box  hlCard-diamond-reflex-char">R</div></div></div><div className="border-box  hlCard-reflex">Reflex</div></div>
    }
    if(hlCard.failureEffect){
        reflex = <div className="border-box  hlCard-reflex">(F) Failure</div>
    }
    if(hlCard.woundEffect){
        reflex = <div className="border-box  hlCard-reflex">(W) Wound</div>
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
    if(hlCard.critable){
        crit = 
        <div>
        <div className="border-box hlCard-critical"><br/><br/>Critical Wound</div>
        <div className="border-box hlCard-diamond hlCard-diamond-lantern"><div className="border-box ghost"><img className="border-box hlCard-lantern-image" src={lantern} alt="border-box lantern"/></div></div>
        {persistantInjury}
        </div>
    }
    
    const hlCardGraphics = 
    <div className="border-box hlCard">
        {description}
        <div className="border-box hlCard-top">{hlCard.title}</div>
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