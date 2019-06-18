import React, { Component } from 'react';
import './App.css';

export default class GameSelector extends Component {

    constructor(props) {
        super (props)
        this.state = {
           hidden: true,
        }
      }

    newGame = () =>{
        this.props.createGame("");
    }

    hlCardsInDeck = () => {
      this.props.hlCardsInDeck();
    }

    /*
    handleChange = (e) => {
        this.setState({
          input: e.target.value
        })
      }*/

      toggleHide = () => {
        //const wrapper = document.getElementById('wrapper');
        //wrapper.classList.toggle('is-nav-open');
  
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
            <div className="menu-shown">
                <div className="menu-hide" onClick={this.toggleHide}>
                  <div className="arrow-up"></div>
                </div>
                <button onClick={this.newGame}>New Game</button>
                <br/>
                 Debug options:
                <button onClick={this.hlCardsInDeck}>Show/hide HL cards deck</button>
            </div>
      }

        return(
          <div id="wrapper" className="wrapper">{menu}</div>
        )
    }
}       