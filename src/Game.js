import React, { Component } from 'react';
import './App.css';
import GameBoard from './GameBoard';
import GameSelector from './GameSelector'
import { UpdateShowdown, GetShowdown, GetLatestShowdown, CreateShowdown} from './RestServices/Showdown';

 export default class Game extends Component {
 
  constructor(props){
    super(props);

    this.state = {
      showdown: []
    }
  }
  
  componentDidMount(){
    GetLatestShowdown(this.state.id).then(data => {
      this.setState({showdown: data});
    });
  }

  updateShowdown = (showdown) => {
    console.log("updating showdown state, turn=" +showdown.turn);
    
    UpdateShowdown(this.state.showdown);
    this.setState({showdown: showdown});
  }

  createGame = (e) => {
    
    CreateShowdown(e).then(data => {
      this.setState({
      showdown: data,
      })
    });
  }

  render(){
    return(
      <div>
        <GameSelector createGame={this.createGame}/>
        <GameBoard showdown={this.state.showdown} updateShowdown={this.updateShowdown}/>
      </div>)
  }
}