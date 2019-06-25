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
      NEW: false,
    }
  }
  
  componentDidMount(){

    console.log("Starting new session in " +process.env.NODE_ENV +" environment");
    const loadExistingShowdown = true; //set to false to always create new showdown (as in prod)
    if ((!process.env.NODE_ENV || process.env.NODE_ENV === 'development') && loadExistingShowdown) {
      GetLatestShowdown(this.state.id).then(showdown => {
        if(showdown !== null){
          this.setState({
            loaded: true,
            gameState: showdown,
            gameEngine: new GameEngine(showdown, this.updateGameState)
          });
        }
      })
    } 
  }

  updateGameState = (showdown) => {
    console.log("updating showdown state, turn=" +showdown.turn);
    
    UpdateShowdown(this.state.gameState);
    this.setState({gameState: showdown});
  }

  createGame = (e) => {
    
    CreateShowdown(e).then(data => {
      console.log("new game: " +data.id)
      this.setState({
        loaded: true,
        gameState: data,
        gameEngine: new GameEngine(data, this.updateGameState),
      })
    });
  }

  render(){

    return(
      <div>
        {!this.state.loaded ? NewGameScreen(this.createGame) : null } 
        {this.state.loaded && !this.state.NEW ? <GameBoard showdown={this.state.gameState} gameEngine={this.state.gameEngine} updateShowdown={this.updateGameState}/> : null } 
        <VersionInfo/>
      </div>)
  }
}

/*


        

*/