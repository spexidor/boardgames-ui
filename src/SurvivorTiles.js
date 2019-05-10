import React, { Component } from 'react';
import './App.css';
import SurvivorTile from './SurvivorTile';
import s1 from './images/s1_c.jpg';
import s2 from './images/s2_c.png';
import s3 from './images/s3_c.png';
import s4 from './images/s4_c.png';

export default class SurvivorTiles extends Component {
 
    constructor(props){
      super(props);

      let x_array = [];
      let y_array = [];
      for(let n=0; n<this.props.survivors.length; n++){
        //console.log("in child x:  " +this.props.survivors[n].position.x)
        //console.log("in child y:  " +this.props.survivors[n].position.y)

        x_array.push(this.props.survivors[n].position.x);
        y_array.push(this.props.survivors[n].position.y);
      }

      this.state = {
          //actualSurvivors: this.props.survivors,
          x:  x_array, //will diff during move animation
          y:  y_array
      }
    }

    tick(){
        this.updateRenderedSurvivors();
    }

    updateRenderedSurvivors = () => {
      //TODO: check if survivor killed
      let x = this.state.x;
      let y = this.state.y;
      const margin = 0.05;
      const moveSpeed = 0.2;
      for(let n=0; n<this.props.survivors.length; n++){
          if(x[n]+margin < this.props.survivors[n].position.x){
            x[n] += moveSpeed;
          }
          else if(x[n]-margin > this.props.survivors[n].position.x){
            x[n] -= moveSpeed;
          }
          if(y[n]+margin < this.props.survivors[n].position.y){
            y[n] += moveSpeed;
          }
          else if(y[n]-margin > this.props.survivors[n].position.y){
            y[n] -= moveSpeed;
          }
      }
      this.setState({x: x, y: y});
    }

    componentDidMount(){
      this.interval = setInterval(() => this.tick(), 30);
    }

    render(){

      //console.log("rendering SurvivorTiles.js")

        let tiles = <div></div>;
        let survivors = [];
        let srcArr = [s1, s2, s3, s4];
        const shrink = 3;
        if(this.props.survivors.length>0){
            
            for(let i =0; i<this.props.survivors.length; i++){

              let src;
              if(this.props.survivors[i].name === "Allister"){ 
                src = srcArr[0];
              }
              else if(this.props.survivors[i].name === "Lucy"){ 
                src = srcArr[1];
              }
              else if(this.props.survivors[i].name === "Erza"){ 
                src = srcArr[2];
              }
              else if(this.props.survivors[i].name === "Zachary"){ 
                src = srcArr[3];
              }

              let left = this.state.x[i]*this.props.tileSize + this.props.leftOffset;
              let top =  this.state.y[i]*this.props.tileSize + this.props.topOffset;
              survivors.push(
                  {
                    topPx: top+shrink, 
                    leftPx: left+shrink,
                    name: this.props.survivors[i].name + " (" +(i+1) +")",
                    id: this.props.survivors[i].id,
                    selectedSurvivorId: this.props.selectedSurvivorId,
                    src: src,
                    size: this.props.tileSize,
                    knockedDown: this.props.survivors[i].status === "KNOCKED_DOWN"
                  });
            }
            tiles = <MapSurvivors data={survivors} click={this.props.click}/>
        }
        
      return(
        <div>{tiles}</div>
      )
  }
}

function MapSurvivors(props){
    return(
      props.data.map((s, index) => 
          <SurvivorTile knockedDown={s.knockedDown} size={s.size} src={s.src} click={props.click} selectedSurvivorId={s.selectedSurvivorId} key={index} top={s.topPx} left={s.leftPx} name={s.name} id={s.id}/>
      ))
}