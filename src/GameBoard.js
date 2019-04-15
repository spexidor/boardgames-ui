import React, { Component } from 'react';
import './App.css';
import TileRenderer from './TileRenderer';
import MonsterTile from './MonsterTile';

export default class GameBoard extends Component {
 


  render(){

    let tilePositions=[];

    const size = 50;
    const width_tiles = 14;
    const height_tiles = 10;
    const top_offset = 50;
    const left_offset = 50;
    let left = 0;
    let top = 0;

    let monsterPosX=0;
    let monsterPosY=0;
    let monsterWidth = 0;
    let monsterHeight = 0;

    let showdownLoaded = false;

    if(this.props.showdown.id === undefined){
      console.log("REST data monster not loaded yet");
    }
    else{
      console.log("REST data monster loaded " +this.props.showdown.monster.id);
      monsterPosX = this.props.showdown.monster.position.x;
      monsterPosY = this.props.showdown.monster.position.y;
      monsterWidth = this.props.showdown.monster.monsterStatline.width;
      monsterHeight = this.props.showdown.monster.monsterStatline.height;
      showdownLoaded = true;
    }

    for(let x=0;x<width_tiles;x++){
      left = size*x + left_offset;
      for(let y=0; y<height_tiles; y++){
        top = size*y + top_offset;

        tilePositions.push(
          {
            topPx: top, 
            leftPx: left,
            x: x,
            y: y
          });
      }
    }

    return(
      <div>
        <TileRenderer positions={tilePositions} tileSize={size}/>
        <MonsterTile tileSize={size} positionX={monsterPosX} positionY={monsterPosY} height={monsterHeight} width={monsterWidth}/>
      </div>
      )
  }
}