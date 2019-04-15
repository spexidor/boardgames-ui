import React, { Component } from 'react';
import './App.css';

export default class GameBoardTile extends Component {
    
    constructor(props){
        super(props);
    
        let brightMod = -30 + Math.floor(Math.random() * Math.floor(30));
        //console.log("bright mod: " +brightMod);

        this.state = {
            brightMod: brightMod,
            brightness: 100 + brightMod,
            hue: 0
        }

        this.select = this.select.bind(this);
        this.deselect = this.deselect.bind(this);
    }
    
    changeHue(degree){
        //console.log("setting hue to " +degree);
        let filterString = "hue-rotate(" +degree +"deg)";
        return {filter: filterString};
      }

      changeBrightness(percentage){
        //console.log("setting hue to " +degree);
        let filterString = "brightness(" +percentage +"%)";
        return {filter: filterString};
      }

    select(){
    this.setState({
        brightness: this.state.brightness+50
    })
    }

deselect(){
    this.setState({
      brightness: this.state.brightness-50
    })
}

    render(){

        let src = this.props.src;
    
        return(
            <div style={this.changeBrightness(this.state.brightness)}>
            <img src={src} alt="bg" onClick={this.props.click} onMouseLeave={this.deselect} onMouseOver={this.select} style={{position: 'absolute', height: this.props.height, width: this.props.width, top: this.props.top, left: this.props.left}}/>
            </div>
        )
    }
}