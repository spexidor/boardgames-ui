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
      backendInfo: "",
      frontendInfo: "",
      showHLCards: false
    }
  }
  
  componentDidMount(){

    console.log("ENV: " +process.env.NODE_ENV);
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      // dev code
      GetLatestShowdown(this.state.id).then(showdown => {
        if(showdown !== null){
          this.setState({
            loaded: true,
            showdown: showdown});
        }
      })
    } else {
        // production code
        
        //backend git
        GetGitInfo().then(data => {
          console.log("received git info from backend: " +data);
          console.log("commit: " +data.commit_time);
          this.setState({backendInfo: "Latest commit: " +data.commit_time +" (" +data.commit_message  +")"});
        });

        //frontend git
        const data = require('./static/gitInfo.txt')
        fetch(data).then(result => 
          result.text()
        ).then(text => this.setState({frontendInfo: text}));
    }
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

  showHLCards = () => {
    this.setState({showHLCards: !this.state.showHLCards})
  }

  render(){

    let gameBoard = <div></div>;
    let newGameScreen = <div></div>;
    let menu = <div></div>;

    let versionInfo = 
    <div className="version-info">
      {this.state.backendInfo} | {this.state.frontendInfo}
    </div>;

    if(this.state.loaded){
      gameBoard = <GameBoard showdown={this.state.showdown} updateShowdown={this.updateShowdown} showHLCards={this.state.showHLCards}/>;
      menu = <GameSelector createGame={this.createGame} hlCardsInDeck={this.showHLCards}/>;
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
          <li>Not able to choose move path when monster moves as a reaction</li>
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