import React, { Component } from 'react';
import '../App.css';
import monsterImg from'../images/kingdom_death_dig_tile_4x_transp_small.png';
import { properties } from '../properties'

export default class MonsterTile extends Component {
 
  constructor(props){
    super(props);

    this.state = {
        facing: props.facing,
        x: this.props.positionX,
        y: this.props.positionY 
    }
  }

  tick(){
    this.updateRenderedMonster();
}

updateRenderedMonster = () => {
  //TODO: check if survivor killed
  let x = this.state.x;
  let y = this.state.y;
  const margin = 0.05;
  const moveSpeed = 0.2;
  if(x+margin < this.props.positionX){
    x += moveSpeed;
  }
  else if(x-margin > this.props.positionX){
    x -= moveSpeed;
  }
  if(y+margin < this.props.positionY){
    y += moveSpeed;
  }
  else if(y-margin > this.props.positionY){
    y -= moveSpeed;
  }
  this.setState({x: x, y: y});
}

componentDidMount(){
  this.interval = setInterval(() => this.tick(), 30);
}

hover = (e) => {
  this.props.hoverMonster(e.screenX, e.screenY);
}

dehover = () => {
  this.props.deHoverMonster();
}

  render(){

    const tileSize = properties.GAMEBOARD_TILE_SIZE_X;
    const topOffset = properties.GAMEBOARD_TILE_TOP;
    const leftOffset = properties.GAMEBOARD_TILE_LEFT;

    const shrink = 10;
    let top=this.state.y*tileSize + topOffset +shrink;
    let left=this.state.x*tileSize+ leftOffset +shrink;
    let height = this.props.height*tileSize -shrink*2;
    let width = this.props.width*tileSize -shrink*2;
    let degree = 0; //Default up

    if(this.props.gameStatus === "WIN"){
      height = 0;
      width = 0;
    }

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
    if(this.props.selectedMonster!==-1)
    {
        border = 2
    }

    let img = <div></div>
    //console.log("size: " +tileSize +" top: " +top +" left: " +left +" height: " +height +" width: " +width);
    if(height>0 && width >0){
      img = <img className="monster-tile" src={monsterImg} alt={"monster_" +this.props.id} border={border} onClick={this.props.click} onMouseLeave={this.dehover} onMouseOver={this.hover} style={{transform: rotate, position: 'absolute', height: height, width: width, top: top-border, left: left-border}}/>
    }

      return(
        <div>{img}</div>
      )
  }
}
