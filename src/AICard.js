import React, { Component } from 'react';
import './App.css';
import Draggable from 'react-draggable';

export default class Gamelog extends Component {
 
mapTargets = (target) => {
let str = "";

if(target.random){
    str = "random  ";
}
if(target.closest){
    str = "closest  ";
}
if(target.threat){
    str = str +" threat, ";
}
if(target.facing) {
    str = str +" facing, ";
}
if(target.inRange){
    str = str +" in range, ";
}
if(target.inFieldOfView){
    str = str +" in field of view, ";
}

if(target.knockedDown){
    str = str +" knocked down, ";
}

if(target.blindSpot){
    str = str +" in blindspot, ";
}
if(target.lastToWound){
    str = str +" last to wound, ";
}

str = str.charAt(0).toUpperCase() + str.slice(1);
str = str.slice(0, str.length-2); //remove last ', '

return str;
}

render(){

    const aiCard = this.props.aiCard;
    console.log("aicard: " +aiCard.title);

    const triggerChar = "❂";
    let triggerDesc = "";
    const target = aiCard.targetRule.targetOrder.map((s, index) => <li key={index}>{this.mapTargets(s)}</li>);
    let trigger = "";
    if(aiCard.attack.trigger !== null){
        let name = "";
        if(aiCard.attack.triggerEffect.name){
            name = name + ": ";
        }
        if(aiCard.attack.trigger.afterHit){
            trigger = triggerChar +" After Hit";
        }
        else if(aiCard.attack.trigger !== null && aiCard.attack.trigger.afterDamage){
            trigger = triggerChar +" After Damage";
        }
        triggerDesc = 
            <div>
                <div className="aiCard-trigger-left">{triggerChar}</div>
                <div className="aiCard-trigger-right"><b>{name}</b>{aiCard.attack.triggerEffect.description}</div>
            </div>
    }
    
    const aiCardGraphics = 
    <div>
        <div className="aiCard-target">
            <div className="card-title">{aiCard.title}</div>
            <br/>
            Pick target
            <ul className="aiCard-target-list">{target}
            <li>No target: <b>{aiCard.noTarget.name}</b></li>
            </ul>
        </div>
        <div className="aiCard-attack">
            <div className="card-title">Move & Attack Target</div>
            <br/>
            <table className="aiCard-table"><tbody>
            <tr className="aiCard-table-header"><th>Speed</th><th>Accuracy</th><th>Damage</th><th className="aiCard-table-trigger-header">Trigger</th></tr>
            <tr><td>{aiCard.attack.speed}</td><td>{aiCard.attack.toHitValue}+</td><td>{aiCard.attack.damage}</td><td className="aiCard-table-trigger-body">{trigger}</td></tr>
            </tbody></table>
            <br/>
            {triggerDesc}
        </div>
        <div className="aiCard-round">▿</div>
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
            <div className="handle"><div className="aiCard">
            {aiCardGraphics}
            </div></div> 
  
      </Draggable>
    )
  }
}
//<img src={flow} alt="flow" style={{align: "center", position: "relative", height: 25, width: 25 }}/>
/*

{
                    },
                    "attack": {
                        "speed": 2,
                        "toHitValue": 4,
                        "damage": 1,
                        "ignoreEvasion": false,
                        "reach": 1,
                        "targetLocation": null,
                        "trigger": {
                            "afterDamage": true,
                            "afterHit": false
                        },
                        "cardEffect": {
                            "condition": null,
                            "move": null,
                            "bleed": 0,
                            "brainDamage": 0,
                            "damage": 0,
                            "knockDown": false,
                            "grab": false,
                            "basicAttack": false,
                            "priorityToken": false,
                            "drawAI": 1,
                            "knockBack": 0,
                            "gainSurvival": 0,
                            "gainUnderstanding": 0,
                            "gainCourage": 0
                        }
                    },
                    "noMove": false
                }

*/