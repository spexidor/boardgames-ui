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
      selection: {
        markedX: -1,
        markedY: -1,
        selectedMonsterId: -1,
        selectedSurvivorId: -1,
        typeSelected: "",
        monsterTarget: -1
      },
      action: {
        moveSelected: false,
        selectMonsterTarget: false
      },
      survivor: {},
      monster: {},
      highlights: [],
      
      showPopup: false,
      selectedWeapon: 2, //index in gear grid
      targets: [],
      revealedAI: 0
    }

    this.click = this.click.bind(this);
    this.setSurvivorMoves = this.setSurvivorMoves.bind(this);
    this.clickedMove = this.clickedMove.bind(this);
  }

  click = (props) => {

    if (typeof this.state.monster.id === 'undefined') {
      this.setState({ monster: this.props.showdown.monster })
    }

    let identifier = props.target.alt.split("_")[0];
    let newX = parseInt(props.target.alt.split("_")[1]);
    let newY = parseInt(props.target.alt.split("_")[2]);
    let selectedId = newX;

    if (identifier === "survivor") { //clicked a survivor
      
      if (selectedId === this.state.selection.selectedSurvivorId) { //deselect if click twice
        this.deselect();
      }
      else {
        let survivor;
        for (let n = 0; n < this.props.showdown.survivors.length; n++) { //find selected survivor
          if (selectedId === this.props.showdown.survivors[n].id) {
            survivor = this.props.showdown.survivors[n];
            break;
          }
        }

        let selection = this.state.selection;
        let action = this.state.action;

        if(this.state.action.selectMonsterTarget){
          console.log("choosing among multiple survivors");
          selection.typeSelected = "monster";
          selection.monsterTarget = selectedId;
          this.setState({
            targets: [survivor]
          });
        }
        else{
          selection.typeSelected = "survivor";
          selection.selectedMonsterId = -1;
          this.setSurvivorMoves(survivor.id);
        }
        selection.selectedSurvivorId = selectedId;
        selection.markedX = -1;
        selection.markedY = -1;

        action.moveSelected = false;

        this.setState({
          selection: selection,
          survivor: survivor,
          action: action
        })
        

      }
    }
    else if (identifier === "monster") {
      if (selectedId === this.state.selection.selectedMonsterId) { //deselect if click twice
        this.deselect();
      }
      else {

        let selection = this.state.selection;
        selection.typeSelected = "monster";
        selection.selectedMonsterId = selectedId;
        selection.selectedSurvivorId = -1;
        selection.markedX = -1;
        selection.markedY = -1;
        let action = this.state.action;
        action.moveSelected = false;

        this.setState({
          selection: selection,
          action: action
        })
        this.setMonsterMoves(this.props.showdown.monster.id);
      }

    }
    else if ((identifier === "board")) {
      if (newX === this.state.selection.markedX && newY === this.state.selection.markedY) { //deselect if click twice
        this.deselect();
      }
      else {
        if (this.state.action.moveSelected === true) {         //MOVEMENT
          if (this.validMove(newX, newY)) {
            if (this.state.selection.typeSelected === "survivor") {  //MOVE SURVIVOR
              let survivor = this.state.survivor;
              survivor.position.x = newX;
              survivor.position.y = newY;
              survivor.movesLeft = 0;

              let selection = this.state.selection;
              selection.typeSelected = "board";
              selection.selectedSurvivorId = -1;

              this.setState({
                survivor: survivor,
                selection: selection, //deselect survivor after move
                highlights: []
              })
              UpdateSurvivor(survivor);
            }
            else if (this.state.selection.typeSelected === "monster") { //MOVE MONSTER
              let monster = this.state.monster;
              monster.position.x = newX;
              monster.position.y = newY;
              monster.activatedThisTurn = true;
              
              let selection = this.state.selection;
              selection.selectedMonsterId = -1;

              this.setState({
                monster: monster,
                selection: selection,
                highlights: []
              })
              this.updateMonsterInBackEnd(this.state.monster);
            }
          }
        }
        else {

          let selection = this.state.selection;
          selection.typeSelected = "board";
          selection.markedX = newX;
          selection.markedY = newY;
          selection.selectedMonsterId = -1;
          selection.selectedSurvivorId = -1;

          this.setState({
            selection: selection,
            highlights: [],
          })
        }

        let action = this.state.action;
        action.moveSelected = false;
        this.setState({ action: action })
      }
    }
  }

  deselect = () => {
    let selection = this.state.selection;
    selection.typeSelected = "";
    selection.markedX = -1;
    selection.markedY = -1;
    selection.selectedSurvivorId = -1;
    selection.selectedMonsterId = -1;
    
    let action = this.state.action;
    action.moveSelected = false;

    this.setState({
      selection: selection,
      highlights: [],
      action: action
    })
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

    let action = this.state.action;
    action.moveSelected = true;
    this.setState({
      action: action
    })
  }

  clickedActivate = () => {
    let inRange = this.survivorInRange();
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

  survivorInRange = () => {
    let inRange = false;
    for(let i=0; i<this.state.monster.baseCoordinates.length; i++){
      if (this.adjacent(this.state.survivor.position, this.state.monster.baseCoordinates[i])) {
        inRange = true;
        break;
      }
    }
    return inRange;
  }

  monsterInRange = () => {
    let inRange = false;
    for(let i=0; i<this.state.monster.baseCoordinates.length; i++){
      if (this.validTarget(this.state.survivor) && this.adjacent(this.state.survivor.position, this.state.monster.baseCoordinates[i])) {
        inRange = true;
        break;
      }
    }
    return inRange;
  }

  validTarget = (survivor) => {
    for(let i=0; i<this.state.targets.length; i++){
        if(this.state.targets[i].id === survivor.id){
          return true;
        }
    }
    console.log("Chosen survivor not valid target");
    return false;
    }

  getSurvivor = (id) => {

    const survivors = this.props.showdown.survivors;
    let survivor = null;
    for(let n=0; n<survivors.length; n++){
      if(id === survivors[n].id){
        survivor = survivors[n];
      }
    }
    return survivor;
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
      showdown.survivors[n].activationsLeft = 1;
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

    GetTargets(this.state.monster.id, this.state.revealedAI.id).then(data => {
      this.setState({targets: data});
      if(data.length === 1){
        console.log("single possible target!");
        let selection = this.state.selection;
        selection.monsterTarget = data[0].id;
      }
      else if(data.length > 0){
        console.log("multiple possible targets, choose 1");
        let action = this.state.action;
        action.selectMonsterTarget = true;
        this.setState({
          action: action
        })
      }
      else {
        console.log("no valid targets")
      }
    });
  }

  shuffleAI = () => {
    return null;
  }

  attack = () => {
    console.log("pressed attack");

    let aiCard = this.state.revealedAI;

    if(this.monsterInRange()){
      GetHits(aiCard.attack.speed, aiCard.attack.toHitValue).then(data => {
        console.log("hits: " +data.length);

        let action = this.state.action;
        action.selectMonsterTarget = false;
        this.deselect();
        this.moveAI();
        this.setState({
          targets: [],
          action: action
        });
      });
    }
    else{
      console.log("monster not in range");
    }
    
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
    let aiCard = monster.aiDeck.cardsInDeck[0];
    monster.aiDeck.cardsInDeck.shift();
    monster.aiDeck.cardsInDiscard.push(aiCard);

    this.setState({
      revealedAI: {},
      monster: monster
    });
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
        <div align="left" style={{ borderRadius: "5px", background: "#282c34", fontSize: "8px", color: "white", position: "absolute", height: 50, width: 250, top: 50, left: 800 }}>Game turn: {this.props.showdown.turn}, move selected: {this.state.action.moveSelected.toString()}, game status: {this.props.showdown.gameStatus}, survivorId: {this.state.survivor.id}, monsterId: {monsterId}
        , </div>
        <TileRenderer targets={this.state.targets} tileSize={size} topOffset={topOffset} leftOffset={leftOffset} click={this.click} highlights={highlights} markedX={this.state.selection.markedX} markedY={this.state.selection.markedY} width_tiles={width_tiles} height_tiles={height_tiles} />
        <MonsterTile tileSize={size} topOffset={topOffset} leftOffset={leftOffset} click={this.click} facing={monsterFacing} selectedMonster={this.state.selection.selectedMonsterId} positionX={monsterPosX} positionY={monsterPosY} height={monsterHeight} width={monsterWidth} id={monsterId} />
        <SurvivorTiles tileSize={size} topOffset={topOffset} leftOffset={leftOffset} click={this.click} selectedSurvivorId={this.state.selection.selectedSurvivorId} survivors={survivors} />
        <InfoBox selection={this.state.selection.typeSelected} survivor={this.state.survivor} monster={monster} />
        <ActionBox survivor={this.state.survivor} aiCard={this.state.revealedAI} targets={this.state.targets} selection={this.state.selection.typeSelected} attack={this.attack} target={this.target} revealAI={this.revealAI} nextTurn={this.nextTurn} move={this.clickedMove} activate={this.clickedActivate} changeFacing={this.changeFacing} />
        {this.state.showPopup ? <ActivationSelecter text='Close Me' closePopup={this.togglePopup.bind(this)} /> : null}
      </div>
    )
  }

  togglePopup = () => {
    console.log("updating popup state")
    this.setState({
      showPopup: !this.state.showPopup
    });
  }
  /*
  survivorAtPos = (position) => {
    console.log("finding survivor in " +position.x +"," +position.y);
    const survivors = this.props.showdown.survivors;

    for(let n=0; n<survivors.length; n++){
        if(survivors[n].position.x === position.x && survivors[n].position.y === position.y){
            return survivors[n];
        }
    }
    return null;
  }*/
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