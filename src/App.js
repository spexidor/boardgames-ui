import React, { Component } from 'react';
import Game from './Game.js';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="bg">
          <Game/>
      </div>
    );
  }
}

export default App;
