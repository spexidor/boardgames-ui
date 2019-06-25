import React, { Component } from 'react';
import '../App.css';
import HLCard from './HLCard';

export default class AllHLCards extends Component {
 
  render(){

    console.log("cards in deck: " +this.props.hlCards.length)
    let hlCards = <div>No cards in deck</div>
    if(this.props.hlCards.length > 0){
      hlCards = this.props.hlCards.map((hlCard, index) => <HLCard key={index} clickedCard={this.props.clickedCard} hlCard={hlCard}/>)
    }
    
    return(
        <div className="all-hl-cards">  
            {hlCards}
        </div>
    )
  }
}