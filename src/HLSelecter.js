import React, { Component } from 'react';
import './App.css';

export default class HLSelecter extends React.Component {

    constructor(props){
      super(props);
  
      this.state = {
        selectedHitLocation: ""
      }
    }
  
    woundLocation = () => {
      let hlCard = 0;

      console.log("selectedHitLocation: " +this.state.selectedHitLocation);
      for(let n=0; n<this.props.hlCards.length; n++){
        if(this.props.hlCards[n].title === this.state.selectedHitLocation || this.props.hlCards[n].trap){
            hlCard = this.props.hlCards[n];
            break;
        }
      }

      if(hlCard !== 0){
        this.props.woundLocation(hlCard);
      }
      else{
        console.log("hl card not set properly in HLSelecter.js")
      }

      let newLoc;
      if(this.props.hlCards.length === 1){
          console.log("just one card left, setting it in state")
          newLoc = this.props.hlCards[0].title;
          this.setState({selectedHitLocation: newLoc});
      }
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
      //console.log("onChange, setting state to " +chosenLocation)
      this.setState({
        selectedHitLocation: chosenLocation
      });
    }
  
    render() {
  
      console.log("rendering HLSelecter.js");

      let hlCards = [];
      let trapIndex = -1;
      let resolveDisabled = true;
      let disabled = false;

      for(let n=0; n<this.props.hlCards.length; n++){
        if(this.props.hlCards[n].trap){
          trapIndex = n;
        }
      }

      for(let n=0; n<this.props.hlCards.length; n++){

        let title = this.props.hlCards[n].title;
        if(this.props.hlCards[n].trap){
          //title = title + " (trap)"
        }
        else{
          if(trapIndex !== -1){ //trap in list
            disabled = true;
          }
        }
        
        /*
        if(this.props.hlCards[n].woundEffect){
          title = title + " (with wound effect)"
        }
        else if(this.props.hlCards[n].reflexEffect){
          title = title + " (with reflex effect)"
        }
        else if(this.props.hlCards[n].failureEffect){
          title = title + " (with failure effect)"
        }
        */

        hlCards.push({
          value: title,
          onChange: this.onChange.bind(this),
          checked: this.props.hlCards[n].trap || this.props.hlCards.length===1, //only trap is checked from start
          disabled: disabled
        });
      }
      
      let radioButtons = <MapRadioButtons data={hlCards}/>
      let title = "";
      if(trapIndex !== -1){
        title = "Trap!"
      }
      else{
        title = "Choose hit location to wound"
      }
      if(trapIndex !== -1 || this.state.selectedHitLocation !== ""){
        console.log("resolveDisabled not disabled trapIndex=" +trapIndex +", selectedHitLocation=" +this.state.selectedHitLocation)
        resolveDisabled = false;
      }
      else{
        console.log("resolveDisabled! trapIndex=" +trapIndex +", selectedHitLocation=" +this.state.selectedHitLocation)
      }
  
      return (
        <div className='popup'>
          <div className='popup_inner'>
            <h2>{title}</h2>
  
            {radioButtons}
            
              <div>
                <button disabled={resolveDisabled} onClick={this.woundLocation}>Resolve</button>
              </div>
          </div>
        </div>
      );
    }
  }
  
  function MapRadioButtons(props){
   
    return(
      props.data.map((s, index) => 
          <RadioButtonOption disabled={s.disabled} checked={s.checked} value={s.value} onChange={s.onChange} key={index}/>
      ))
  }
  
  class RadioButtonOption extends React.Component {
    render(){
      return(
        <div>
          <label>
            <input
              type="radio"
              name="react-tips"
              defaultChecked={this.props.checked}
              disabled={this.props.disabled}
              value={this.props.value}
              onChange={this.props.onChange}
              className="form-check-input"
            />
            {this.props.value}
          </label>
          </div>
      )
    }
  }