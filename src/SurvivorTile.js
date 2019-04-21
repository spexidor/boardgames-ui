import React, { Component } from 'react';
import './App.css';
import survivorImg from'./images/survivor_tile_1_1.png';

export default class SurvivorTile extends Component {

    constructor(props){
        super(props);
    
        this.state = {
            brightness: 100,
            hue: 0
        }
    
        this.hover = this.hover.bind(this);
        this.dehover = this.dehover.bind(this);
      }

    changeBrightness(percentage){
        let filterString = "brightness(" +percentage +"%)";
        return {filter: filterString};
    }

    hover(){
        this.setState({
            brightness: this.state.brightness+50
        })
    }

    dehover(){
        this.setState({
            brightness: this.state.brightness-50
        })
    }
    

    render(){
        let border = 0;
        if(this.props.selectedSurvivorId===this.props.id) //compares string and integers, hence == instead of ===
        {
            border = 1
        }

        return(
            <div style={this.changeBrightness(this.state.brightness)}>
                <img src={this.props.src} alt={"survivor_" +this.props.id} border={border} onClick={this.props.click} onMouseLeave={this.dehover} onMouseOver={this.hover} style={{position: 'absolute', height: 44, width: 44, top: this.props.top, left: this.props.left}}/>
            </div>
        )
    }
}       

          //<div alt={"survivor_" +this.props.id} onClick={this.props.click} onMouseLeave={this.dehover} onMouseOver={this.hover}  style={{borderRadius: "10px", background: "lightgreen", fontSize: "16px", color: "black", width: "20%", position: "absolute", height: 45, width: 45, top: this.props.top, left: this.props.left}}>{this.props.name}</div>
            