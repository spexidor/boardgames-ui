import React from 'react';
import './App.css';
import HLCard from './HLCard';
import Draggable from 'react-draggable';

export default class HLSelecter extends React.Component {

    render() {
  
      let cards = this.props.hlCards.map((hlCard, index) => <HLCard key={index} hlCard={hlCard} woundLocation={this.props.woundLocation} />)
      let button = <div><button onClick={this.props.toggleHLSelecter}>Hide selecter</button></div>

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
            {button}
            {cards}
          </div>
        </Draggable>

          
      );
    }
  }