import React, { Component } from 'react';
import './App.css';
import monsterImg from'./kingdom_death_dig_tile_4x_transp.png';

export default class MonsterTile extends Component {
 
  constructor(props){
    super(props);

    let brightMod = -10 + Math.floor(Math.random() * Math.floor(20));
console.log("bright mod: " +brightMod);
    this.state = {
        brightMod: brightMod,
        brightness: 100 + brightMod,
        hue: 0
    }

    this.select = this.select.bind(this);
    this.deselect = this.deselect.bind(this);
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

    let top=this.props.positionY*this.props.tileSize;
    let left=this.props.positionX*this.props.tileSize;
    let height = this.props.height*this.props.tileSize;
    let width = this.props.width*this.props.tileSize;

    let img = <div></div>
    //console.log("size: " +this.props.tileSize +" top: " +top +" left: " +left +" height: " +height +" width: " +width);
    if(height>0 && width >0){
      img = <img src={monsterImg} alt="monster" onMouseLeave={this.deselect} onMouseOver={this.select} style={{position: 'absolute', height: height, width: width, top: top, left: left}}/>
    }

      return(
        <div style={this.changeBrightness(this.state.brightness)}>{img}</div>
      )
  }
}
