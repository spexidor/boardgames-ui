import React from 'react';
import './App.css';
import HLCard from './HLCard';
import Draggable from 'react-draggable';

export default class HLSelecter extends React.Component {

    render() {

      let trapRevealed = false;
      let trap;
      for(let n=0; n<this.props.hlCards.length; n++){
        if(this.props.hlCards[n].trap){
          trapRevealed = true;
          trap = this.props.hlCards[n];
        }
      }
  
      let cards = this.props.hlCards.map((hlCard, index) => <HLCard key={index} trapRevealed={trapRevealed} hlCard={hlCard} clickedCard={this.props.woundLocation} />)

      return (
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
        <div className='handle hl-selecter'>
            {cards}
          </div>
        </Draggable>

          
      );
    }
  }