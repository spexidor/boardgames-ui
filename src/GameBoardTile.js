import React, { Component } from 'react';
import './App.css';

export default class GameBoardTile extends Component {
    
    render(){

        let src = this.props.src;
        let border = 0;
        let tileCSS = "gameboard-tile";
        if(this.props.highlight){
            tileCSS = tileCSS + " gameboard-tile-selected";
        }
        /*
        if(this.props.inMonsterRange){
            tileCSS = tileCSS + " gameboard-tile-monster-range";
        }
        */
        
        if(this.props.markedX===this.props.x && this.props.markedY===this.props.y)
        {
            border = 1
        }
        if(this.props.target === true){
            border = 2;
        }
    
        return(
            <div>
                <img className={tileCSS} src={src} alt={"board_" +this.props.x +"_" +this.props.y} border={border} onClick={this.props.click} style={{position: 'absolute', height: this.props.height-(border*2), width: this.props.width-(border*2), top: this.props.top, left: this.props.left}}/>
            </div>
        )
    }
}