import React, { Component } from 'react';
import './App.css';

export default class SurvivorTile extends Component {

    constructor(props){
        super(props);
    
        this.state = {
            brightness: 100,
            hue: 0
        }
    
      }

    applyFilters(brightness, saturation){
        let filterString = "brightness(" +brightness +"%) saturate(" +saturation +"%)";
        return {filter: filterString};
    }

    hover = () => {
        this.props.hover(this.props.id);
        this.setState({
            brightness: this.state.brightness+50
        })
    }

    dehover = () => {
        this.props.deHover();
        this.setState({
            brightness: this.state.brightness-50
        })
    }
    

    render(){

        let border = 0;
        let name = this.props.name;
        if(this.props.selectedSurvivorId===this.props.id)
        {
            border = 1
        }
        let saturation = 100;
        if(this.props.knockedDown){
            saturation = 50;
        }

        return(
            <div style={this.applyFilters(this.state.brightness, saturation)}>
                <img src={this.props.src} alt={"survivor_" +this.props.id} border={border} onClick={this.props.click} onMouseLeave={this.dehover} onMouseOver={this.hover} style={{position: 'absolute', height: this.props.size*0.85, width: this.props.size*0.85, top: this.props.top, left: this.props.left}}/>
                <p style={{backgroundcolor: "red", color: "white", fontSize: "8px", position: 'absolute', height: 10, width: 60, top: this.props.top-9, left: this.props.left-14}}>{name}</p>
            </div>
        )
    }
}       

//