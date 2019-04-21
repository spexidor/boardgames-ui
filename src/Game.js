import React, { Component } from 'react';
import './App.css';
import GameBoard from './GameBoard.js';
import { UpdateShowdown, GetShowdown} from './RestServices';

 export default class Game extends Component {
 
  constructor(props){
    super(props);

    this.state = {
      showdown: []
    }
  }
  
  componentDidMount(){
    GetShowdown().then(data => {
      this.setState({showdown: data});
    });
  }

  updateShowdown = (showdown) => {
    console.log("updating showdown state, turn=" +showdown.turn);
    
    UpdateShowdown(this.state.showdown);
    this.setState({showdown: showdown});
  }

  render(){
    return(<GameBoard showdown={this.state.showdown} updateShowdown={this.updateShowdown}/>)
  }
}