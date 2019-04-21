import React, { Component } from 'react';
import './App.css';
import TileRenderer from './TileRenderer';
import MonsterTile from './MonsterTile';
import SurvivorTiles from './SurvivorTiles';
import InfoBox from './InfoBox';
import ActionBox from './ActionBox';
import { UpdateSurvivor, UpdateMonster , GetHits} from './RestServices'
import { GetAiDeck, GetTargets } from './AiHandler';

export default class GameBoard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      markedX: -1,
      markedY: -1,
      selectedMonster: -1,
      selectedSurvivorId: -1,
      selection: "",
      survivor: {},
      monster: {},
      highlights: [],
      moveSelected: false,
      showPopup: false,
      selectedWeapon: 2, //index in gear grid
      targets: []
    }

    this.click = this.click.bind(this);
    this.setSurvivorMoves = this.setSurvivorMoves.bind(this);
    this.clickedMove = this.clickedMove.bind(this);
  }

  togglePopup = () => {
    console.log("updating popup state")
    this.setState({
      showPopup: !this.state.showPopup
    });
  }

  click(props) {

    if (typeof this.state.monster.id === 'undefined') {
      this.setState({ monster: this.props.showdown.monster })
    }

    let identifier = props.target.alt.split("_")[0];
    let newX = parseInt(props.target.alt.split("_")[1]);
    let newY = parseInt(props.target.alt.split("_")[2]);
    let selectedId = newX;

    if (identifier === "survivor") {
      if (selectedId === this.state.selectedSurvivorId) { //deselect if click twice
        this.setState({
          selection: "",
          selectedSurvivorId: -1,
          highlights: [],
          moveSelected: false
        })
      }
      else {
        let survivor;
        for (let n = 0; n < this.props.showdown.survivors.length; n++) { //find selected survivor
          if (selectedId === this.props.showdown.survivors[n].id) {
            survivor = this.props.showdown.survivors[n];
            break;
          }
        }

        this.setState({
          selection: "survivor",
          survivor: survivor,
          selectedSurvivorId: newX,
          selectedMonster: -1,
          markedX: -1,
          markedY: -1,
          moveSelected: false
        })
        this.setSurvivorMoves(survivor.id);

      }
    }
    else if (identifier === "monster") {
      if (selectedId === this.state.selectedMonster) { //deselect if click twice
        this.setState({
          selection: "",
          selectedMonster: -1,
          highlights: [],
          moveSelected: false
        })
      }
      else {
        this.setState({
          selection: "monster",
          selectedMonster: newX,
          selectedSurvivorId: -1,
          markedX: -1,
          markedY: -1,
          moveSelected: false
        })
        this.setMonsterMoves(this.props.showdown.monster.id);
      }

    }
    else if ((identifier === "board")) {
      if (newX === this.state.markedX && newY === this.state.markedY) { //deselect if click twice
        this.setState({
          selection: "",
          markedX: -1,
          markedY: -1,
          highlights: []
        })
      }
      else {
        if (this.state.moveSelected === true) {         //MOVEMENT
          if (this.validMove(newX, newY)) {
            if (this.state.selection === "survivor") {  //MOVE SURVIVOR
              let survivor = this.state.survivor;
              survivor.position.x = newX;
              survivor.position.y = newY;
              survivor.movesLeft = 0;
              this.setState({
                survivor: survivor,
                selection: "board", //deselect survivor after move
                selectedSurvivorId: -1,
                highlights: []
              })
              UpdateSurvivor(survivor);
            }
            else if (this.state.selection === "monster") { //MOVE MONSTER
              let monster = this.state.monster;
              monster.position.x = newX;
              monster.position.y = newY;
              monster.activatedThisTurn = true;
              this.setState({
                monster: monster,
                selectedMonster: -1,
                highlights: []
              })
              this.updateMonsterInBackEnd(this.state.monster);
            }
          }
        }
        else {
          this.setState({
            selection: "board",
            markedX: newX,
            markedY: newY,
            selectedMonster: -1,
            selectedSurvivorId: -1,
            highlights: [],
          })
        }
        this.setState({ moveSelected: false })
      }
    }

  }

  validMove(x, y) {
    let validMove = false;
    for (let n = 0; n < this.state.highlights.length; n++) {
      if (this.state.highlights[n].x === x && this.state.highlights[n].y === y) {
        validMove = true;
      }
    }
    return validMove;
  }

  setSurvivorMoves(id) {
    let url = "http://localhost:8083/survivor/" + id + "/openMoves";
    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.setState({
          highlights: data
        })
      })
  }

  setMonsterMoves(id) {
    let url = "http://localhost:8083/monster/" + id + "/openMoves";
    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.setState({
          highlights: data
        })
      })
  }

  clickedMove = () => {
    this.setState({
      moveSelected: true
    })
  }

  clickedActivate = () => {
    let inRange = this.inRange();
    console.log("in range: " + inRange);
    if(inRange){
      GetHits(this.getSpeed(), this.getToHitValue()).then(data => {
        const numHits = data.length;
        console.log("hits: " +numHits);

        GetHits(numHits, this.toWoundValue()).then(data => {
          const numWounds = data.length;
          console.log("wounds: " +numWounds);

          let survivor = this.state.survivor;
          survivor.activationsLeft = survivor.activationsLeft -1;
          this.setState({
            survivor: survivor
          });
        })
        })
      }
  }

  getSpeed = () => {
    return this.getSelectedWeapon().speed;
  }

  getToHitValue = () => {
    const toHitValue = this.getSelectedWeapon().toHitValue;
    return Math.max(this.inBlindSpot(this.state.survivor) ? toHitValue-1 : toHitValue, 2);
  }

  inBlindSpot = (survivor) => {
    let inBlindSpot = false;
    for(let i=0; i<this.state.monster.blindspot.length; i++) {
      if(this.positionsEqual(survivor.position, this.state.monster.blindspot[i])){
        //console.log(survivor.position.x +"," +survivor.position.y +" in blind spot");
        inBlindSpot = true;
        break;
      }
    }
    return inBlindSpot;
  }

  positionsEqual = (p1, p2) => {
    return (p1.x===p2.x && p1.y===p2.y)
  }

  getSelectedWeapon = () => {
    return this.state.survivor.gearGrid.gear[this.state.selectedWeapon];
  }
  
  toWoundValue = () => {
    let t = this.state.monster.statline.toughness;
    //let s1 = this.state.survivor.strength;
    let s1 = 0;
    let s2 = this.state.survivor.gearGrid.gear[2].strengthBonus;
    console.log("t: " +t +", s1: " +s1 +", s2: " +s2);
    return Math.max(t - (s1+s2), 2); //1 to wound always fail
  }

  inRange = () => {
    let inRange = false;
    for(let i=0; i<this.state.monster.baseCoordinates.length; i++){
      if (this.adjacent(this.state.survivor.position, this.state.monster.baseCoordinates[i])) {
        inRange = true;
        break;
      }
    }
    return inRange;
  }

  adjacent = (p1, p2) => {
    //console.log("p1: x=" + p1.x + ", y=" + p1.y);
    //console.log("p2: x=" + p2.x + ", y=" + p2.y);
    if (p1.x === p2.x && (p1.y === p2.y + 1 || p1.y === p2.y - 1)) {
      return true;
    }
    else if (p1.y === p2.y && (p1.x === p2.x + 1 || p1.x === p2.x - 1)) {
      return true;
    }
    else { return false }
  }

  nextTurn = (e) => {
    let showdown = this.props.showdown;
    showdown.turn = showdown.turn + 1;

    for (let n = 0; n < showdown.survivors.length; n++) {
      showdown.survivors[n].movesLeft = 1;
      UpdateSurvivor(showdown.survivors[n])
    }

    //this.updateMonsterInBackEnd(this.state.monster);
    this.props.updateShowdown(showdown);
  }

  changeFacing = (e) => {
    let monster = this.state.monster;
    monster.facing = e;
    
    this.setState({
      monster: monster
    })
    this.updateMonsterInBackEnd(monster);
  }

  updateMonsterInBackEnd(monster){
    UpdateMonster(monster).then(data => {
      this.setState({monster: data});
    })
  }

  target = () => {
    console.log("revealed ai card: " +this.state.revealedAI.title);

    GetTargets(this.state.monster.id, this.state.revealedAI.targetRule).then(data => {
      this.setState({targets: data});
      if(data.length > 0){
        this.setState({
          identifier: "select target"
        })
      }
      else {
        console.log("no valid targets")
      }
    });
  }

  printTarget = (targetRule) => {
    if(targetRule){

    }
  }

  shuffleAI = () => {
    return null;
  }

  attack = () => {
    console.log("attacking survivor")
  }

  revealAI = () => {

    if (this.state.monster.aiDeck.cardsInDeck.length > 0) {
      console.log("new ai card: " +this.state.monster.aiDeck.cardsInDeck[0].title);
      this.setState({
        revealedAI: this.state.monster.aiDeck.cardsInDeck[0]
      })
    }
    else this.shuffleAI()
  }

  moveAI = () => {
    let monster = this.state.monster;
    let aiDeck = monster.aiDeck;
    let aiCard = monster.aiDeck.cardsInDeck[0];
    monster.aiDeck.cardsInDeck.shift();
    monster.aiDeck.cardsInDiscard.push(aiCard);

    this.setState({monster: monster});
  }

  printAI = () => {
    console.log("printing ai decks");
    for(let i=0; i<this.state.monster.aiDeck.cardsInDeck.length; i++){
      console.log("cards in deck: " +this.state.monster.aiDeck.cardsInDeck[i].title);
    }
    for(let i=0; i<this.state.monster.aiDeck.cardsInDiscard.length; i++){
      console.log("cards in discard: " +this.state.monster.aiDeck.cardsInDiscard[i].title);
    }
    for(let i=0; i<this.state.monster.aiDeck.cardsRemoved.length; i++){
      console.log("cards removed: " +this.state.monster.aiDeck.cardsRemoved[i].title);
    }
  }

  render() {

    //general
    const size = 50;
    const width_tiles = 14;
    const height_tiles = 10;
    const topOffset = 50;
    const leftOffset = 50;
    let highlights = this.state.highlights;

    //monster
    let monsterPosX = 0;
    let monsterPosY = 0;
    let monsterWidth = 0;
    let monsterHeight = 0;
    let monsterId = 0;
    let monsterFacing = 'UP';
    let monster;

    //survivor
    let survivors = [];

    if (typeof this.props.showdown === 'undefined' || typeof this.props.showdown.id === 'undefined') {
      //console.log("REST data monster not loaded yet");
    }
    else {
      //console.log("REST data monster is loaded " + this.props.showdown.monster.id);
      
      if(typeof this.state.monster.position === 'undefined'){
        monster = this.props.showdown.monster;
      }
      else{
        monster = this.state.monster;
      }
      monsterPosX = monster.position.x;
      monsterPosY = monster.position.y;
      monsterWidth = monster.statline.width;
      monsterHeight = monster.statline.height;
      monsterFacing = monster.facing;
      monsterId = monster.id;
      survivors = this.props.showdown.survivors;
    }

    return (
      <div>
        <div align="left" style={{ borderRadius: "5px", background: "#282c34", fontSize: "8px", color: "white", position: "absolute", height: 50, width: 250, top: 50, left: 800 }}>Game turn: {this.props.showdown.turn}, move selected: {this.state.moveSelected.toString()}, game status: {this.props.showdown.gameStatus}, survivorId: {this.state.survivor.id}, monsterId: {monsterId}</div>
        <TileRenderer targets={this.state.targets} tileSize={size} topOffset={topOffset} leftOffset={leftOffset} click={this.click} highlights={highlights} markedX={this.state.markedX} markedY={this.state.markedY} width_tiles={width_tiles} height_tiles={height_tiles} />
        <MonsterTile tileSize={size} topOffset={topOffset} leftOffset={leftOffset} click={this.click} facing={monsterFacing} selectedMonster={this.state.selectedMonster} positionX={monsterPosX} positionY={monsterPosY} height={monsterHeight} width={monsterWidth} id={monsterId} />
        <SurvivorTiles tileSize={size} topOffset={topOffset} leftOffset={leftOffset} click={this.click} selectedSurvivorId={this.state.selectedSurvivorId} survivors={survivors} />
        <InfoBox selection={this.state.selection} survivor={this.state.survivor} monster={monster} />
        <ActionBox selection={this.state.selection} target={this.target} revealAI={this.revealAI} nextTurn={this.nextTurn} move={this.clickedMove} activate={this.clickedActivate} changeFacing={this.changeFacing} />
        {this.state.showPopup ? <ActivationSelecter text='Close Me' closePopup={this.togglePopup.bind(this)} /> : null}
      </div>
    )
  }
}

class ActivationSelecter extends React.Component {
  render() {
    console.log("rendering popup");
    return (
      <div className='popup'>
        <div className='popup_inner'>
          <h1>{this.props.text}</h1>
          <button onClick={this.props.closePopup}>close me</button>
        </div>
      </div>
    );
  }
}