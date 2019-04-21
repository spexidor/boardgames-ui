import React, { Component } from 'react';
import './App.css';
import monsterImg from'./images/kingdom_death_dig_tile_4x_transp_small.png';
//import monsterImg from'./images/white_lion_1.png';


export default class MonsterTile extends Component {
 
  constructor(props){
    super(props);

    this.state = {
        brightness: 100,
        brightMod: 20,
        hue: 0,
        facing: props.facing
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
        brightness: this.state.brightness+this.state.brightMod
    })
  }

  dehover(){
    this.setState({
      brightness: this.state.brightness-this.state.brightMod
    })
  }

  render(){

    //console.log("MonsterTile.js: facing=" +this.props.facing)
    //console.log("MonsterTile.js: x=" +this.props.positionX)
    //console.log("MonsterTile.js: y=" +this.props.positionY)
    
    const shrink = 10;
    let top=this.props.positionY*this.props.tileSize + this.props.topOffset +shrink;
    let left=this.props.positionX*this.props.tileSize+ this.props.leftOffset +shrink;
    let height = this.props.height*this.props.tileSize -shrink*2;
    let width = this.props.width*this.props.tileSize -shrink*2;
    let degree = 0; //Default up
    if(this.props.facing==="LEFT"){
      degree = 270;
    }
    else if(this.props.facing==="DOWN"){
      degree = 180;
    }
    else if(this.props.facing==="RIGHT"){
      degree = 90;
    }
    let rotate = "rotate(" +degree +"deg)";

    let border = 0;
    if(this.props.selectedMonster!==-1) //compares string and integers, hence == instead of ===
    {
        border = 2
    }

    let img = <div></div>
    //console.log("size: " +this.props.tileSize +" top: " +top +" left: " +left +" height: " +height +" width: " +width);
    if(height>0 && width >0){
      img = <img src={monsterImg} alt={"monster_" +this.props.id} border={border} onClick={this.props.click} onMouseLeave={this.dehover} onMouseOver={this.hover} style={{transform: rotate, position: 'absolute', height: height, width: width, top: top-border, left: left-border}}/>
    }

      return(
        <div style={this.changeBrightness(this.state.brightness)}>{img}</div>
      )
  }
}
