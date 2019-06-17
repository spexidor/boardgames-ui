import React, { Component } from 'react';
import './App.css';
import GameBoard from './GameBoard';
import GameSelector from './GameSelector'
import { UpdateShowdown, GetLatestShowdown, CreateShowdown} from './Functions/RestServices/Showdown';
import { GetGitInfo } from './Functions/RestServices/BackendInfo';

 export default class Game extends Component {
 
  constructor(props){
    super(props);

    this.state = {
      loaded: false,
      info: "",
    }
  }
  
  componentDidMount(){
    /*
    GetLatestShowdown(this.state.id).then(showdown => {
      if(showdown !== null){
        this.setState({
          loaded: true,
          showdown: showdown});
      }
      })
    */

    GetGitInfo().then(data => {
      console.log("received git info from backend: " +data);
      console.log("commit: " +data.commit_time);
      this.setState({info: "Latest commit: " +data.commit_time +" (" +data.commit_message  +")"});
    });
  }

  updateShowdown = (showdown) => {
    console.log("updating showdown state, turn=" +showdown.turn);
    
    UpdateShowdown(this.state.showdown);
    this.setState({
      showdown: showdown});
  }

  createGame = (e) => {
    
    CreateShowdown(e).then(data => {
      console.log("new game: " +data.id)
      this.setState({
        loaded: true,
        showdown: data
      })
    });
  }

  render(){

    let gameBoard = <div></div>;
    let newGameScreen = <div></div>;
    let menu = <div></div>;

    let versionInfo = 
    <div className="version-info">
      {this.state.info}
    </div>;

    if(this.state.loaded){
      gameBoard = <GameBoard showdown={this.state.showdown} updateShowdown={this.updateShowdown}/>;
      menu = <GameSelector createGame={this.createGame}/>;
    }
    else {
      newGameScreen = 
      <div>
        <div className="new-game">
        <button onClick={this.createGame}>New Game</button>
        </div>
        <div className="bug-list">
        Known bugs:
        <p>
          <li>Grab on multiple run over survivors not implemented</li>
          <li>Sniff not implemented</li>
          <li> + to many to list :) </li>
        </p>
        </div>
      </div>
    }
    
    return(
      <div>
        {newGameScreen}
        {gameBoard}
        {menu}
        {versionInfo}
      </div>)
  }
}