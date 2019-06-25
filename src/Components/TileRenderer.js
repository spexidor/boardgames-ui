import React, { Component } from 'react';
import '../App.css';
import skulls from '../images/skulls4_bw.png';
import GameBoardTile from './GameBoardTile';
import { properties } from '../properties.js';

/*
Input properties:
click:                  function triggered when clicking a tile

monsterMoves:           array of coordinates where monster can move
targets:                array of possible monster targets
monsterMoveHighlights:  array of coordinates where monster can move (direction against survivor)
highlights:             array of coordinates where survivor can move
markedTile              coordinate of marked tile {x: 0, y: 0}
*/

export default class TileRenderer extends Component 
{
    render(){

        const width_tiles = properties.GAMEBOARD_WIDTH; //22
        const height_tiles = properties.GAMEBOARD_HEIGHT; //16
        const tileSizeX = properties.GAMEBOARD_TILE_SIZE_X;
        const tileSizeY = properties.GAMEBOARD_TILE_SIZE_Y;
        const leftOffset = properties.GAMEBOARD_TILE_LEFT;
        const topOffset = properties.GAMEBOARD_TILE_TOP;
        
        let left;
        let top;
        let tilePositions = [];

        for(let x=0;x<width_tiles;x++){
            left = tileSizeX*x + leftOffset;
            for(let y=0; y<height_tiles; y++){
              top = tileSizeY*y + topOffset;
      
              let highlight = false;
              let target = false;
              let inMonsterRange = false;
              for(let n=0; n<this.props.highlights.length; n++){
                  if(x===this.props.highlights[n].x && y===this.props.highlights[n].y){
                    highlight=true;
                    break;
                  }
              }
              for(let n=0; n<this.props.monsterMoveHighlights.length; n++){
                if(x===this.props.monsterMoveHighlights[n].x && y===this.props.monsterMoveHighlights[n].y){
                  highlight=true;
                  break;
                }
              }
              for(let n=0; n<this.props.monsterMoves.length; n++){
                if(x===this.props.monsterMoves[n].x && y===this.props.monsterMoves[n].y){
                  inMonsterRange=true;
                  break;
                }
              }
              for(let n=0; n<this.props.targets.length; n++){
                if(x===this.props.targets[n].position.x && y===this.props.targets[n].position.y){
                  target=true;
                  break;
                }
            }

              tilePositions.push(
                {
                  topPx: top, 
                  leftPx: left,
                  x: x,
                  y: y,
                  highlight: highlight,
                  target: target,
                  inMonsterRange: inMonsterRange
                });
            }
          }

        let tiles = <div></div>;

        if(tilePositions.length > 0){
            tiles = 
            <div>
              <MapTable data={tilePositions} sizeY={tileSizeY} sizeX={tileSizeX} click={this.props.click} markedX={this.props.markedTile.x} markedY={this.props.markedTile.y}/>
            </div>
        }

        return(
        <div>
            {tiles}
        </div>
        )
    }
}

function MapTable(props){
 
    return(
      props.data.map((s, index) => 
          <GameBoardTile inMonsterRange={s.inMonsterRange} target={s.target} highlight={s.highlight} click={props.click} key={index} markedX={props.markedX} markedY={props.markedY}  src={skulls} height={props.sizeY} width={props.sizeX} top={s.topPx} left={s.leftPx} x={s.x} y={s.y}/>
      ))
  }