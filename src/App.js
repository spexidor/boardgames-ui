import React, { Component } from 'react';
import GameBoard from './GameBoard.js';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <GameBoard/>
        </header>
      </div>
    );
  }
}

export default App;
