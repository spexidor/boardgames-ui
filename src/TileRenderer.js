import React, { Component } from 'react';
import './App.css';
import skulls from './skulls.png';
import GameBoardTile from './GameBoardTile';

export default class TileRenderer extends Component 
{
    render(){

        let tiles = <div></div>;

        if(this.props.positions.length > 0){
            tiles = <div><MapTable data={this.props.positions} size={this.props.tileSize    }/></div>
        }

        return(
        <div>
            {tiles}
        </div>
        )
}
}

function clickTest(props){
    console.log("clicked a tile " +props);
}

function MapTable(props){
 
    return(
      props.data.map((s, index) => 
          <GameBoardTile click={clickTest} key={index} src={skulls} height={props.size} width={props.size} top={s.topPx} left={s.leftPx}/>
      ))
  }