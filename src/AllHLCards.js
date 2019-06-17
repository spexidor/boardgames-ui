import React, { Component } from 'react';
import './App.css';
import HLCard from './HLCard';

export default class AllHLCards extends Component {
 
  render(){

    const hlCards = this.props.hlCards.map((hlCard, index) => <HLCard key={index} clickedCard={this.props.clickedCard} hlCard={hlCard}/>)

    return(
        <div className="all-hl-cards">  
            {hlCards}
        </div>
    )
  }
}