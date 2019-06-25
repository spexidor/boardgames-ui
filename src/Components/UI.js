import React, { Component } from 'react';
import '../App.css';

import TileRenderer from './TileRenderer';
import MonsterTile from './MonsterTile';
import SurvivorTiles from './SurvivorTiles';
import InfoBox from './InfoBox';
import ActionBox from './ActionBox';
import DodgeSelecter from './DodgeSelecter'
import HLSelecter from './HLSelecter'
import Gamelog from './Gamelog';
import AICard from './AICard';
import TurnChanger from './TurnChanger';
import GearGrid from './GearGrid';
import AllHLCards from './AllHLCards';
import Menu from './Menu'
import ReactTooltip from 'react-tooltip'

/*
Input properties:

gameState:      state of running game
gameEngine:     reference to game engine object

*/

export default class UI extends Component 
{
    constructor(props){
        super(props);

        this.state = {
            //placeholder
        }
    }

    click = () => {
        this.props.gameEngine.click();
    }

    render(){

        return(
        <div>

          <div className="gameboard-normal">
            <TileRenderer click={this.click} markedTile={{x: -1, y: -1}} targets={[]} monsterMoves={[]} monsterMoveHighlights={[]} highlights={[]}  />
          </div>

        </div>
        )
    }
}

/*
<TileRenderer monsterMoves={this.state.monsterMoves} targets={this.state.targets} tileSizeX={size} tileSizeY={size} topOffset={topOffset} leftOffset={leftOffset} click={this.click} monsterMoveHighlights={this.state.monsterMoveHighlights} highlights={highlights} markedX={this.state.selection.markedX} markedY={this.state.selection.markedY} width_tiles={width_tiles} height_tiles={height_tiles} />
<MonsterTile deHoverMonster={this.deHoverMonster} hoverMonster={this.hoverMonster} tileSize={size} topOffset={topOffset} leftOffset={leftOffset} click={this.click} facing={monsterFacing} selectedMonster={this.state.selection.selectedMonsterId} positionX={monsterPosX} positionY={monsterPosY} height={monsterHeight} width={monsterWidth} id={monsterId} gameStatus={gameStatus}/>
<SurvivorTiles deHoverSurvivor={this.deHoverSurvivor} hoverSurvivor={this.hoverSurvivor} tileSize={size} topOffset={topOffset} leftOffset={leftOffset} click={this.click} selectedSurvivorId={this.state.selection.selectedSurvivorId} survivors={survivors} />
*/