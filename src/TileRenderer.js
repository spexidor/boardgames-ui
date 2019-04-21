import React, { Component } from 'react';
import './App.css';
import skulls from './images/skulls3.png';
import GameBoardTile from './GameBoardTile';

export default class TileRenderer extends Component 
{
    render(){

        let left;
        let top;
        let tilePositions = [];

        for(let x=0;x<this.props.width_tiles;x++){
            left = this.props.tileSize*x + this.props.leftOffset;
            for(let y=0; y<this.props.height_tiles; y++){
              top = this.props.tileSize*y + this.props.topOffset;
      
              let highlight = false;
              let target = false;
              for(let n=0; n<this.props.highlights.length; n++){
                  if(x===this.props.highlights[n].x && y===this.props.highlights[n].y){
                    highlight=true;
                    break;
                  }
              }
              for(let n=0; n<this.props.targets.length; n++){
                if(x===this.props.targets[n].x && y===this.props.targets[n].y){
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
                  target: target
                });
            }
          }

        let tiles = <div></div>;

        if(tilePositions.length > 0){
            tiles = <div><MapTable data={tilePositions} size={this.props.tileSize} click={this.props.click} markedX={this.props.markedX} markedY={this.props.markedY}/></div>
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
          <GameBoardTile target={s.target} highlight={s.highlight} click={props.click} key={index} markedX={props.markedX} markedY={props.markedY}  src={skulls} height={props.size} width={props.size} top={s.topPx} left={s.leftPx} x={s.x} y={s.y}/>
      ))
  }