import React from 'react';
import './App.css';

export default class DodgeSelecter extends React.Component {

    constructor(props){
      super(props);
  
      this.state = {
        selectedHit: ""
      }
    }
  
    dododge = () => {
      this.props.dodgeHits(this.state.selectedHit);
    }
  
    dontdodge = () => {
      this.props.dodgeHits("");
    }
  
    onChange = (e) => {
      this.setState({
        selectedHit: e.target.value
      });
    }
  
    render() {
  
      let hitLocations = [];
      for(let n=0; n<this.props.hits.length; n++){
        hitLocations.push({
          value: this.props.hits[n],
          onChange: this.onChange.bind(this)
        });
      }
      
      let radioButtons = <MapRadioButtons data={hitLocations}/>
  
      return (
        <div className='popup'>
          <div className='popup_inner'>
            <h2>Dodge hits?</h2>
  
            {radioButtons}
            
              <div>
                <button onClick={this.dododge} >Dodge</button>
                <button onClick={this.dontdodge}>Skip</button>
              </div>
          </div>
        </div>
      );
    }
  }
  
  function MapRadioButtons(props){
   
    return(
      props.data.map((s, index) => 
          <RadioButtonOption value={s.value} onChange={s.onChange} key={index}/>
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