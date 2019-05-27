import React, { Component } from 'react';
import './App.css';
import HLCard from './HLCard';

export default class AllHLCards extends Component {
 
  render(){

    //console.log("cards in deck!: " +this.props.hlCards.length)

    const columns = 8;
    const rows = 3;
    const hlCards = this.props.hlCards.map((hlCard, index) => <HLCard key={index} hlCard={hlCard}/>)

    return(
        <div className="all-hl-cards">  
            {hlCards}
        </div>
    )
  }
}