import React, { Component } from 'react';
import '../App.css';
import GameBoard from './GameBoard';
import Menu from './Menu'
import { UpdateShowdown, GetLatestShowdown, CreateShowdown} from '../Functions/RestServices/Showdown';
import { GetGitInfo } from '../Functions/RestServices/BackendInfo';
import { BugInfo, VersionInfo } from '../Rendering/RenderFunctions';
import {Survivor} from '../Classes/Survivor';

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
    if ((!process.env.NODE_ENV || process.env.NODE_ENV === 'development') && true) {
      GetLatestShowdown(this.state.id).then(showdown => {
        if(showdown !== null){
          this.setState({
            loaded: true,
            showdown: showdown});
        }
      })
    } else {
        //backend git
        GetGitInfo().then(data => {
          console.log("received git info from backend: " +data);
          console.log("commit: " +data.commit_time);
          this.setState({backendInfo: "Latest commit: " +data.commit_time +" (" +data.commit_message  +")"});
        });

        //frontend git
        const data = require('../static/gitInfo.txt')
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

    let versionInfo = VersionInfo(this.state.backendInfo +"|" +this.state.frontendInfo);

    if(!this.state.loaded){
      //newGameScreen = ;
    }
    
    return(
      <div>
        {!this.state.loaded ? BugInfo(this.createGame) : null } 
        {this.state.loaded ? <GameBoard showdown={this.state.showdown} updateShowdown={this.updateShowdown} showHLCards={this.state.showHLCards}/> : null } 
        {this.state.loaded ? <Menu createGame={this.createGame} hlCardsInDeck={this.showHLCards}/> : null } 
        {versionInfo}
      </div>)
  }
}