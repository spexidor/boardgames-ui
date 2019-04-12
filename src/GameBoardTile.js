import React, { Component } from 'react';
import './App.css';

export default class GameBoardTile extends Component {
    
    constructor(props){
        super(props);
    
        this.state = {
          hue: 0
        }

        this.select = this.select.bind(this);
        this.deselect = this.deselect.bind(this);
      }
    
    changeHue(degree){
        let filterString = "hue-rotate(" +degree +"deg)"
        return {filter: filterString};
      }

    select(){
        this.setState({
            hue: 50
        })
    }

    deselect(){
        this.setState({
            hue: 0
        })
    }

    render(){
    
        return(
            <div style={this.changeHue(this.state.hue)}>
            <img src={this.props.src} alt="bg" onMouseLeave={this.deselect} onMouseOver={this.select} style={{position: 'absolute', height: this.props.height, width: this.props.width, top: this.props.top, left: this.props.left}}/>
            </div>
        )
    }
}