import React, { Component } from 'react';
import './App.css';

export default class GameBoardTile extends Component {
    
    constructor(props){
        super(props);
    
        let brightMod = (-30 + Math.floor(Math.random() * Math.floor(30)));

        this.state = {
            brightMod: brightMod,
            brightness: 100 + brightMod,
            hue: 0
        }

        this.select = this.select.bind(this);
        this.deselect = this.deselect.bind(this);
    }
    
    changeHue(degree){
        let filterString = "hue-rotate(" +degree +"deg)";
        return {filter: filterString};
      }

      changeBrightness(percentage){
          if(this.props.highlight===true){
            percentage = percentage +50;
          }
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
        let border = 0;
        
        if(this.props.markedX===this.props.x && this.props.markedY===this.props.y)
        {
            border = 1
        }

        //console.log("target: " +this.props.target.toString());
        if(this.props.target === true){
            border = 2;
        }
    
        return(
            <div style={this.changeBrightness(this.state.brightness)}>
            <img src={src} alt={"board_" +this.props.x +"_" +this.props.y} border={border} onClick={this.props.click} onMouseLeave={this.deselect} onMouseOver={this.select} style={{position: 'absolute', height: this.props.height-(border*2), width: this.props.width-(border*2), top: this.props.top, left: this.props.left}}/>
            </div>
        )
    }
}