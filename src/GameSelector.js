import React, { Component } from 'react';
import './App.css';
//import {CreateShowdown} from './RestServices/Showdown'

export default class GameSelector extends Component {

    constructor(props) {
        super (props)
        this.state = {
           input: 'Game name',
        }
      }

    newGame = () =>{
        this.props.createGame(this.state.input);
    }

    handleChange = (e) => {
        this.setState({
          input: e.target.value
        })
      }

    render(){
        return(
            <div style={{borderRadius: "5px", background: "#282c34", fontSize: "12px", color: "white", position: "absolute", height: 40, width: 300, top: 5, left: 50}}>
                <input
                type="text"
                value= {this.state.input || ''}
                onChange= {this.handleChange}
                placeholder = "Game name"
                />
                <button onClick={this.newGame}>New Game</button>
            </div>
        )
    }
}       

          //<div alt={"survivor_" +this.props.id} onClick={this.props.click} onMouseLeave={this.dehover} onMouseOver={this.hover}  style={{borderRadius: "10px", background: "lightgreen", fontSize: "16px", color: "black", width: "20%", position: "absolute", height: 45, width: 45, top: this.props.top, left: this.props.left}}>{this.props.name}</div>
            