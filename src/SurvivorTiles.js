import React, { Component } from 'react';
import './App.css';
import SurvivorTile from './SurvivorTile';
import s1 from './images/s1_c.jpg';
import s2 from './images/s2_c.png';

export default class SurvivorTiles extends Component {
 
    render(){

        let tiles = <div></div>;
        let survivors = [];
        let src = [s1, s2];
        const shrink = 3;
        if(this.props.survivors.length>0){
            
            for(let i =0; i<this.props.survivors.length; i++){
                let top  = this.props.survivors[i].position.y*this.props.tileSize + this.props.topOffset;
                let left = this.props.survivors[i].position.x*this.props.tileSize + this.props.leftOffset;
                //console.log("creating survivor tile data, top " +top +" y " +this.props.survivors[i].position.y +" name " +this.props.survivors[i].name);
                survivors.push(
                    {
                      topPx: top+shrink, 
                      leftPx: left+shrink,
                      name: this.props.survivors[i].name,
                      id: this.props.survivors[i].id,
                      selectedSurvivorId: this.props.selectedSurvivorId,
                      src: src[i]
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
          <SurvivorTile src={s.src} click={props.click} selectedSurvivorId={s.selectedSurvivorId} key={index} top={s.topPx} left={s.leftPx} name={s.name} id={s.id}/>
      ))
}