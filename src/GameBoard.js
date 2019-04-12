import React, { Component } from 'react';
import './App.css';
import skulls from './skulls.png';
import GameBoardTile from './GameBoardTile';
import TileRenderer from './TileRenderer';

export default class GameBoard extends Component {
 


  render(){

    let tilePositions=[];
    const size = 50;
    const width_tiles = 22;
    const height_tiles = 10;
    const top_offset = 50;
    const left_offset = 50;
    let left = 0;
    let top = 0;

    for(let i=0;i<width_tiles;i++){
      left = size*i + left_offset;
      for(let j=0; j<height_tiles; j++){
        top = size*j + top_offset;
        //console.log("adding element with left=" +left +", top=" +top);
        tilePositions.push(
          {
            top: top, 
            left: left
          });
      }
    }

    return(
      <div>
        <TileRenderer positions={tilePositions} size={size}/>
      </div>
      )
  }
}