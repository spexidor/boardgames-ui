import React, { Component } from 'react';
import './App.css';
import skulls from './skulls.png';
import GameBoardTile from './GameBoardTile';

export default class TileRenderer extends Component 
{
    constructor(props){
        super(props);
    
        this.state = {
            markedX: -1,
            markedY: -1
        }

        this.clickTest = this.clickTest.bind(this);
    }

    clickTest(props){
        let newX = props.target.alt.split("_")[0];
        let newY = props.target.alt.split("_")[1];
        if(newX==this.state.markedX && newY==this.state.markedY){ //deselect
            this.setState({
            markedX: -1,
            markedY: -1
            })
        }
        else {
            this.setState({
                markedX: newX,
                markedY: newY
                })
        }
        
    }

    render(){

        let tiles = <div></div>;

        if(this.props.positions.length > 0){
            tiles = <div><MapTable data={this.props.positions} size={this.props.tileSize} click={this.clickTest} markedX={this.state.markedX} markedY={this.state.markedY}/></div>
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
          <GameBoardTile click={props.click} key={index} markedX={props.markedX} markedY={props.markedY}  src={skulls} height={props.size} width={props.size} top={s.topPx} left={s.leftPx} x={s.x} y={s.y}/>
      ))
  }