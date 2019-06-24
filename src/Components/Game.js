import React, { Component } from 'react';
import '../App.css';
import GameBoard from './GameBoard';
import Menu from './Menu'
import { UpdateShowdown, GetLatestShowdown, CreateShowdown} from '../Functions/RestServices/Showdown';
import { BugInfo } from '../Rendering/RenderFunctions';
import VersionInfo from './VersionInfo'

 export default class Game extends Component {
 
  constructor(props){
    super(props);

    this.state = {
      loaded: false,
      showHLCards: false
    }
  }
  
  componentDidMount(){

    console.log("ENV: " +process.env.NODE_ENV);
    const loadExistingShowdown = true; //set to false to always create new showdown (as in prod)
    if ((!process.env.NODE_ENV || process.env.NODE_ENV === 'development') && loadExistingShowdown) {
      GetLatestShowdown(this.state.id).then(showdown => {
        if(showdown !== null){
          this.setState({
            loaded: true,
            showdown: showdown});
        }
      })
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

    return(
      <div>
        {!this.state.loaded ? BugInfo(this.createGame) : null } 
        {this.state.loaded ? <GameBoard showdown={this.state.showdown} updateShowdown={this.updateShowdown} showHLCards={this.state.showHLCards}/> : null } 
        {this.state.loaded ? <Menu createGame={this.createGame} hlCardsInDeck={this.showHLCards}/> : null } 
        <VersionInfo/>
      </div>)
  }
}