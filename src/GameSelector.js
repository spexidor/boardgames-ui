import React, { Component } from 'react';
import './App.css';
//import {CreateShowdown} from './RestServices/Showdown'

export default class GameSelector extends Component {

    constructor(props) {
        super (props)
        this.state = {
           input: 'Game name',
           hidden: true
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

      toggleHide = () => {
        this.setState({hidden: !this.state.hidden});
      }

    render(){

      let menu = <div></div>
      if(this.state.hidden){
        menu = 
        <div className="menu-hidden" onClick={this.toggleHide}>
            <div className="menu-hidden-bar"></div>
            <div className="menu-hidden-bar"></div>
            <div className="menu-hidden-bar"></div>
        </div>
      }
      else {
        menu = 
<           div className="menu-shown">
                <div className="menu-hide" onClick={this.toggleHide}>
                  <div className="arrow-up"></div>
                </div>
                <input
                type="text"
                value= {this.state.input || ''}
                onChange= {this.handleChange}
                placeholder = "Game name"
                />
                <button onClick={this.newGame}>New Game</button>
            </div>
      }

        return(
          <div>{menu}</div>
        )
    }
}       

          //<div alt={"survivor_" +this.props.id} onClick={this.props.click} onMouseLeave={this.dehover} onMouseOver={this.hover}  style={{borderRadius: "10px", background: "lightgreen", fontSize: "16px", color: "black", width: "20%", position: "absolute", height: 45, width: 45, top: this.props.top, left: this.props.left}}>{this.props.name}</div>
            