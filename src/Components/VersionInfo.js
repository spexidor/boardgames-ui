import React, { Component } from 'react';
import '../App.css';
import { GetGitInfo } from '../Functions/RestServices/BackendInfo';

 export default class Game extends Component {
 
  constructor(props){
    super(props);

    this.state = {
      backendInfo: "",
      frontendInfo: "",
    }
  }
  
  componentDidMount(){

    //backend git
    GetGitInfo().then(data => {
      console.log("received git info from backend: " +data);
      console.log("commit: " +data.commit_time);
      this.setState({backendInfo: "Latest commit: " +data.commit_time +" (" +data.commit_message  +")"});
    });

    //frontend git
    const data = require('../static/gitInfo.txt')
    fetch(data).then(result => 
      result.text()
    ).then(text => this.setState({frontendInfo: text}));
  }

  
  render(){

    return(
      <div className="version-info">
        {this.state.backendInfo +"|" +this.state.frontendInfo}
      </div>)
  }
}