import React, { Component } from 'react';
import './App.css';
import GameBoard from './GameBoard.js';

export class Game extends Component {
 
  constructor(props){
    super(props);

    this.state = {
      showdown: []
    }
  }
  
  componentDidMount(){
    
    fetch('localhost:8083/showdown/1')
    .then(response => response.json())
    .then(data => {
      this.setState({showdown: data});
    })
  }

  render(){
    return(<GameBoard data={this.state.showdown}/>)
  }
}