import React, { Component } from 'react';
import './App.css';
import GameBoard from './GameBoard';
import GameSelector from './GameSelector'
import { UpdateShowdown, GetLatestShowdown, CreateShowdown} from './Functions/RestServices/Showdown';

 export default class Game extends Component {
 
  constructor(props){
    super(props);

    this.state = {
      loaded: false
    }
  }
  
  componentDidMount(){
    GetLatestShowdown(this.state.id).then(data => {
      this.setState({
        loaded: true,
        showdown: data});
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
      showdown: data,
      })
    });
  }

  render(){
    let ids = [-1, -1, -1, -1];
    
    if(typeof this.state.showdown !== 'undefined'){
      for(let n=0; n<this.state.showdown.survivors.length; n++){
        ids[n] = this.state.showdown.survivors[n].id;
      }
    }

    let gameBoard = <div></div>;
    if(this.state.loaded){
      gameBoard = <GameBoard showdown={this.state.showdown} survivorIds={ids} updateShowdown={this.updateShowdown}/>
    }
    
    return(
      <div>
        <GameSelector createGame={this.createGame}/>
        {gameBoard}
      </div>)
  }
}