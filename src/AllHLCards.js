import React, { Component } from 'react';
import './App.css';
import HLCard from './HLCard';

export default class AllHLCards extends Component {
 
  render(){

    //console.log("cards in deck!: " +this.props.hlCards.length)

    const columns = 8;
    const rows = 3;
    const hlCards = this.props.hlCards.map((hlCard, index) => <HLCard key={index} top={180*(index%rows)+100} left={130*(index%columns)+100} hlCard={hlCard}/>)

    return(
        <div style={{position: "absolute", top: 0, left: 0}}>  
            {hlCards}
        </div>
    )
  }
}