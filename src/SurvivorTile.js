import React, { Component } from 'react';
import './App.css';

export default class SurvivorTile extends Component {

    hover = () => {
        this.props.hover(this.props.id);
    }

    dehover = () => {
        this.props.deHover();
    }

    render(){

        let border = 0;
        let name = this.props.name;
        if(this.props.selectedSurvivorId===this.props.id)
        {
            border = 1
        }
        let survivorCSS = "survivor-tile"
        if(this.props.knockedDown){
            survivorCSS = survivorCSS +" survivor-tile-knocked-down";
        }

        return(
            <div>
                <img className={survivorCSS} src={this.props.src} alt={"survivor_" +this.props.id} border={border} onClick={this.props.click} onMouseLeave={this.dehover} onMouseOver={this.hover} style={{position: 'absolute', height: this.props.size*0.85, width: this.props.size*0.85, top: this.props.top, left: this.props.left}}/>
                <p style={{backgroundcolor: "red", color: "white", fontSize: "8px", position: 'absolute', height: 10, width: 60, top: this.props.top-9, left: this.props.left-14}}>{name}</p>
            </div>
        )
    }
}       

//