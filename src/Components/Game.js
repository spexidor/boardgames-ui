import React, { Component } from 'react';
import '../App.css';
import GameBoard from './GameBoard';
import { UpdateShowdown, GetLatestShowdown, CreateShowdown} from '../Functions/RestServices/Showdown';
import { NewGameScreen } from '../Rendering/RenderFunctions';
import VersionInfo from './VersionInfo'
import { GameEngine } from '../Classes/GameEngine';

 export default class Game extends Component {
 
  constructor(props){
    super(props);

    this.state = {
      gameEngine: "",
      gameState: "",
      loaded: false,
    }
  }
  
  componentDidMount(){
    console.log("Starting new session in " +process.env.NODE_ENV +" environment");
    const loadExistingShowdown = true; //set to false to always create new showdown when reloading (as in prod)
    if ((!process.env.NODE_ENV || process.env.NODE_ENV === 'development') && loadExistingShowdown) {
      GetLatestShowdown(this.state.id).then(showdown => {
        if(showdown !== null){
          this.initGameState(showdown);
        }
      })
    } 
  }

  initGameState = (showdown) => {
    this.setState({
      loaded: true,
      gameState: showdown,
      gameEngine: new GameEngine(showdown, this.updateGameState)
    });
  }

  updateGameState = (showdown) => {
    this.setState({gameState: showdown});
  }

  saveGameState = (showdown) => {
    UpdateShowdown(showdown); //save to backend
  }

  createGame = (e) => {
    CreateShowdown(e).then(data => {
      this.initGameState(data);
    });
  }

  render(){

    return(
      <div>
        {!this.state.loaded ? NewGameScreen(this.createGame) : null } 
        {this.state.loaded ? <GameBoard gameState={this.state.gameState} gameEngine={this.state.gameEngine} updateShowdown={this.updateGameState} createGame={this.createGame}/> : null } 
        <VersionInfo/>
      </div>)
  }
}