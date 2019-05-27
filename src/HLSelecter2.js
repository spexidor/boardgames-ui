import React from 'react';
import './App.css';
import HLCard from './HLCard';

export default class HLSelecter extends React.Component {

  /*
    woundLocation = () => {
      let hlCard = 0;

      if(this.props.hlCards.length === 1){
        hlCard = this.props.hlCards[0];
      }
      else {
        for(let n=0; n<this.props.hlCards.length; n++){
          if(this.props.hlCards[n].title === this.state.selectedHitLocation || this.props.hlCards[n].trap){
              hlCard = this.props.hlCards[n];
              break;
          }
        }
      }
      
      if(hlCard !== 0){
        this.props.woundLocation(hlCard);
      }
      else{
        console.log("HL card not set properly in HLSelecter.js")
      }
      this.setState({selectedHitLocation: ""});
    }
  
    onChange = (e) => {

      let noTrapRevealed = true;
      let trap;
      for(let n=0; n<this.props.hlCards.length; n++){
        if(this.props.hlCards[n].trap){
          noTrapRevealed = false;
          trap = this.props.hlCards[n];
        }
      }

      let chosenLocation;
      if(noTrapRevealed){
        chosenLocation = e.target.value;
      }
      else{
        chosenLocation = trap.title;
      }
      this.setState({
        selectedHitLocation: chosenLocation
      });
    }
  */
    render() {
  
      /*
      let radioButtonData = [];
      let trapIndex = -1;
      let resolveDisabled = true;
      let disabled = false;

      let selected = this.state.selectedHitLocation;

      for(let n=0; n<this.props.hlCards.length; n++){
        if(this.props.hlCards[n].trap){
          trapIndex = n;
        }
      }

      for(let n=0; n<this.props.hlCards.length; n++){

        let title = this.props.hlCards[n].title;
        if(trapIndex !== -1){ 
          disabled = true; //trap in list, unable to change target from it
        }
      
        radioButtonData.push({
          value: title,
          onChange: this.onChange.bind(this),
          checked: this.props.hlCards[n].trap, //only trap is checked from start
          disabled: disabled
        });
      }
      
      let radioButtons = <MapRadioButtons data={radioButtonData}/>
      let title = "";
      if(trapIndex !== -1){
        title = "Trap!"
      }
      else{
        title = "Choose hit location to wound"
      }
      
      if(trapIndex !== -1 || selected !== ""){
        resolveDisabled = false;
      }
      else if(this.props.hlCards.length === 1){
        resolveDisabled = false;
      }
*/
      let cards = this.props.hlCards.map((hlCard, index) => <HLCard key={index} hlCard={hlCard} woundLocation={this.props.woundLocation} />)
  
      return (
          <div className='hl-selecter'>
            {cards}
          </div>
      );
    }
  }