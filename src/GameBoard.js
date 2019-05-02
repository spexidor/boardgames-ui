import React, { Component } from 'react';
import './App.css';
import TileRenderer from './TileRenderer';
import MonsterTile from './MonsterTile';
import SurvivorTiles from './SurvivorTiles';
import InfoBox from './InfoBox';
import ActionBox from './ActionBox';
import { UpdateSurvivor, DeleteSurvivor, GetHitlocations, GetSurvivorMoves, GetInjury} from './RestServices/Survivor';
import { UpdateMonster , UpdateMonsterAI, GetTargets, GetMonsterMoves } from './RestServices/Monster';
import { GetHits } from './RestServices/Dice'

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
      dodge: {
        showDodgePopup: false
      },
      survivor: {},
      monster: this.props.showdown.monster,
      highlights: [],
      
      showPopup: false,
      selectedWeapon: 2, //index in gear grid
      targets: [],
      revealedAI: 0
    }

    this.setSurvivorMoves = this.setSurvivorMoves.bind(this);
    this.clickedMove = this.clickedMove.bind(this);
  }

  componentDidMount(){
    document.addEventListener("keydown", this.keyFunction, false);
  }
  componentWillUnmount(){
    document.removeEventListener("keydown", this.keyFunction, false);
  }

  keyFunction = (event) => {
    //37, 38, 39, 40: left, up, right, down
    //49: 1
    //alert("onKeyPressed! " +event.keyCode);

   if(event.keyCode===49){ //1
    this.selectSurvivor(this.props.survivorIds[0]);
   }else if(event.keyCode===50){ //2
    this.selectSurvivor(this.props.survivorIds[1]);
   }
   else if(event.keyCode===51){ //3
    this.selectSurvivor(this.props.survivorIds[2]);
   }
   else if(event.keyCode===52){ //4
    this.selectSurvivor(this.props.survivorIds[3]);
   }
   else if(event.keyCode===53){ //5
    this.selectMonster();
   }
   else if(event.keyCode===77){ //m
    if((this.state.selection.selectedSurvivorId !== -1 && this.state.survivor.movesLeft > 0) || this.state.selection.selectedMonsterId !== -1){
      this.clickedMove(); 
    }
   }
   else if(event.keyCode===65){ //a
     if(this.state.selection.selectedSurvivorId !== -1 && this.state.survivor.activationsLeft > 0){
      this.clickedActivate();
     }
    
   }
 }

 survivorAlive = (id) => {
  return (this.getSurvivorById(id) !== null)
 }

 selectMonster = () => {
  let selection = this.state.selection;
  let action = this.state.action;

  if(selection.selectedMonsterId !== -1){
    this.deselect();
  }
  else {
    this.setMonsterMoves(this.props.showdown.monster.id);
    selection.selectedMonsterId = this.props.showdown.monster.id;
    selection.selectedSurvivorId = -1;
    selection.typeSelected = "monster";
    selection.markedX = -1;
    selection.markedY = -1;
    action.moveSelected = false;

    this.setState({
      selection: selection,
      action: action
    });
  }
 }

 selectSurvivor = (id) => {
  let selection = this.state.selection;
  let action = this.state.action;
  let survivor = this.getSurvivorById(id);

    if(id === selection.selectedSurvivorId){
      this.deselect();
    }
    else{

      selection.selectedMonsterId = -1;
      if(this.survivorAlive(id)){
        if(this.state.action.selectMonsterTarget){
          console.log("choosing among multiple survivors");
          selection.typeSelected = "monster";
          selection.monsterTarget = id;
          this.setState({
            targets: [survivor]
          });
        }
        else {
          selection.typeSelected = "survivor";
          selection.selectedMonsterId = -1;
          this.setSurvivorMoves(survivor.id);
        }

        selection.selectedSurvivorId = id;
        selection.markedX = -1;
        selection.markedY = -1;
        action.moveSelected = false;
        action.selectMonsterTarget = false;

        this.setState({
          selection: selection,
          survivor: this.getSurvivorById(id),
          action: action
        });
      }
      else{
        this.deselect();
      }
    }
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
      this.selectSurvivor(selectedId);
    }
    else if (identifier === "monster") { //clicked monster
      this.selectMonster();
    }
    else if ((identifier === "board")) { //clicked board
      if (newX === this.state.selection.markedX && newY === this.state.selection.markedY) { //deselect if click same tile twice
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

              if(survivor.activationsLeft === 0){ //deselect if acted
                selection.typeSelected = "board";
                selection.selectedSurvivorId = -1;
              }

              this.setState({
                survivor: survivor,
                selection: selection, //deselect survivor after move
                highlights: []
              })
              this.updateSurvivor(survivor);
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
              this.updateMonster(this.state.monster);
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

  setSurvivorMoves = (id) => {
    GetSurvivorMoves(id).then(data => {
        this.setState({
          highlights: data
        })
      })
  }


  setMonsterMoves = (id) => {
    GetMonsterMoves(id).then(data => {
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
          console.log("wounds: " +numWounds +" from " +this.state.survivor.name);
          this.removeAICard(numWounds);

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
    let survivor = this.getSurvivorById(this.state.selection.monsterTarget);
    for(let i=0; i<this.state.monster.baseCoordinates.length; i++){
      if (this.validTarget(survivor) && this.adjacent(survivor.position, this.state.monster.baseCoordinates[i])) {
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
      this.updateSurvivor(showdown.survivors[n]);
    }

    this.props.updateShowdown(showdown);
  }

  changeFacing = (e) => {
    let monster = this.state.monster;

    if(e !== monster.facing){
      console.log("turning monster to " +e);
      monster.facing = e;
      this.updateMonster(monster);
    }
    else{
      console.log("no turning needed, already facing");
    }
  }

  updateMonster(monster){
    UpdateMonster(monster).then(data => {
      this.setState({monster: data});
    })
  }

  updateSurvivor = (survivor) => {
    console.log("survivor to be updated: " +survivor.id);
    if(typeof survivor !== 'undefined'){
      UpdateSurvivor(survivor).then(data => {
        this.setState({survivor: data});
      });
    }
    else {
      console.log("survivor not defined");
    }
  }

  target = () => {
    console.log("finding target. revealed ai card: " +this.state.revealedAI.title);

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

  turnMonsterToSurvivor = () => {
    let survivor = this.getSurvivorById(this.state.selection.monsterTarget);
    if(survivor.position.y < this.state.monster.position.y){
      this.changeFacing("UP");
    }else if(survivor.position.x < this.state.monster.position.x){
      this.changeFacing("LEFT");
    }
    else if(survivor.position.y > (this.state.monster.position.y + this.state.monster.statline.height-1)){
      this.changeFacing("DOWN");
    }else if(survivor.position.x > (this.state.monster.position.x + this.state.monster.statline.width-1)){
      this.changeFacing("RIGHT");
    }
  }

  attack = () => {

    let aiCard = this.state.revealedAI;
    if(this.monsterInRange()){
      this.turnMonsterToSurvivor();

      GetHits(aiCard.attack.speed, aiCard.attack.toHitValue).then(data => {
        console.log("hits: " +data.length);
        const numHits = data.length;

        let action = this.state.action;
        action.selectMonsterTarget = false;
        this.deselect();
        this.damageSurvivor(this.state.selection.monsterTarget, numHits, aiCard.attack);
        this.moveAI();
        this.setState({
          targets: [],
          action: action
        });
      });
    }
    else{
      console.log("monster not in range, canelling attack");
      this.moveAI();
    }
  }

  damageSurvivor = (survivorId, numHits, attack) => {

    if(numHits > 0)
    {
      let survivor = this.getSurvivorById(survivorId);
      let damage = attack.damage;

      if(attack.brainDamage){
        console.log(survivor.name +" took brain damage (damage=" +damage +")");
        for(let i=0; i<numHits; i++)
        {
          this.removeArmourAt(survivor, "BRAIN", damage);
        }
      }
      else 
      {
        GetHitlocations(numHits).then(data => {
        //console.log(survivor.name +" took hits to " +data +" (damage=" +damage +")");
        
        //TODO: DODGE HERE
        console.log(survivor.name +" has " +survivor.survival +" survival")
        if(survivor.survival > 0){
          data = this.dodgePopUp(data, survivor, damage); //may remove 1 hit
        }
        else {
          this.removeArmourWrapper(data, survivor, damage);
        }
      });
      }
    }
  }
  removeArmourWrapper = (data, survivor, damage) => {
    //console.log("removeArmourWrapper! data=" +data +"survivor=" +survivor +"damage=" +damage)
    for(let i=0; i<data.length; i++)
        {
            this.removeArmourAt(survivor, data[i], damage);
        }
  }

  dodgePopUp = (hits, survivor, damage) => {
    const dodge = {
      hits: hits,
      survivor: survivor,
      damage: damage,
      showDodgePopup: true
    }

    this.setState({
      dodge: dodge
    })
  }

  dodgePopUpClosed = (dodgedHit) => {

    console.log("selected to dodge hit: " +dodgedHit);
    let dodge = this.state.dodge;
    dodge.showDodgePopup = false;

    let hits = this.dodge(dodge.hits, dodgedHit);
    console.log("total hits after dodge: " +hits);
   
    let survivor = dodge.survivor;
    survivor.survival--;
    this.updateSurvivor(survivor);
    this.removeArmourWrapper(hits, survivor, this.state.dodge.damage);

    this.setState({
      dodge: dodge
    })
  }


  dodge = (hits, locationToDoge) => {
    console.log("hits before splice: " +hits)
    for(let n=0; n<hits.length; n++){
      if(hits[n] === locationToDoge){
        hits.splice(n,1);
        break;
      }
    }
    console.log("hits after splice: " +hits)
    return hits;
  }

  removeArmourAt = (survivor, hitlocation, damage) => {
    //console.log("removeArmourAt: damage=" +damage +", survivor=" +survivor +", hitLocation=" +hitlocation);
    while(damage>0){
      for(let n=0; n<survivor.hitlocations.length; n++){
          if(survivor.hitlocations[n].type === hitlocation){

            if(survivor.hitlocations[n].hitpoints > 0){
              console.log("removing armour");
              survivor.hitlocations[n].hitpoints--;
            }
            else if(!survivor.hitlocations[n].lightInjury){
              console.log("adding light injury");
              survivor.hitlocations[n].lightInjury = true;
            }
            else if(!survivor.hitlocations[n].heavyInjury){
              console.log("adding heavy injury");
              survivor.hitlocations[n].heavyInjury = true;
              survivor.status = "KNOCKED_DOWN";
            }
            else {
              damage = 0; //Single roll on injury table
              console.log("query for injury");
              
              GetInjury(hitlocation).then(data => {
                console.log(" took injury " +data.title);
                if(data.dead){
                  survivor.status = "DEAD";
                }
                if(data.bleed > 0){
                  console.log(survivor.name +" get bleed " +data.bleed);
                  survivor.bleed = survivor.bleed+data.bleed;
                  if(survivor.bleed > 5){
                    console.log(survivor.name +" bled to death.")
                    survivor.status = "DEAD";
                  }
                }

                if(survivor.status === "DEAD"){
                  console.log(survivor.name +" was killed.")
                  this.survivorKilled(survivor);
                }
                else if(data.knockedDown){
                  console.log("survivor knocked down from injury");
                  survivor.status = "KNOCKED_DOWN";
                }
              })
            }
            break; //Matching hit location processed
          }
      }
      damage--;
      this.updateSurvivor(survivor);
    }
  }

  survivorKilled = (survivor) => {
    console.log(survivor.name +" was killed, removing from props.showdown")
    let showdown = this.props.showdown;
    let survivors = showdown.survivors;
    let index = -1;
    for(let n=0; n<survivors.length; n++){
      if(survivors[n].id === survivor.id){
        index = n;
        break;
      }
    }
    if(index !== -1){
      survivors.splice(index, 1);
      DeleteSurvivor(survivor);
      this.props.updateShowdown(showdown);
    }
    if(survivors.length === 0){
      this.gameLoss();
    }
  }

  gameLoss = () => {
    console.log("all survivors dead, game lost");

    let showdown = this.props.showdown;
    showdown.gameStatus = "LOSS";

    this.props.updateShowdown(showdown);
  }

  getSurvivorById = (id) => {
    for(let i=0; i<this.props.showdown.survivors.length; i++){
        if(this.props.showdown.survivors[i].id === id){
          return this.props.showdown.survivors[i];
        } 
    }
    console.log("no survivor with id=" +id +" found");
    return null;
  }

  revealAI = () => {

    let monster = this.state.monster;
    if (this.state.revealedAI === 0){
      if(this.state.monster.aiDeck.cardsInDeck.length === 0 && this.state.monster.aiDeck.cardsInDiscard.length > 0){
        this.shuffleAI();
      }
      if (this.state.monster.aiDeck.cardsInDeck.length > 0) {
        let aiCard = monster.aiDeck.cardsInDeck[0];
        monster.aiDeck.cardsInDeck.shift();
        console.log("new ai card: " +aiCard.title +", cards in deck: " +this.state.monster.aiDeck.cardsInDeck.length);
        this.setState({
          revealedAI: aiCard,
          monster: monster
        })
      }
      else{
        console.log("using basic action");
        this.setState({revealedAI: this.state.monster.aiDeck.basicAction});
      }
    }
    else {
      console.log("ai card already revealed");
    }
  }

  shuffleAI = () => {
    let monster = this.state.monster;
    console.log("shuffling ai deck");
    //move cards from discard to deck
    while(monster.aiDeck.cardsInDiscard.length>0){
      let aiCard = monster.aiDeck.cardsInDiscard.shift();
      monster.aiDeck.cardsInDeck.push(aiCard);
    }

    //shuffle
    this.shuffle(monster.aiDeck.cardsInDeck);

    this.setState({
      revealedAI: 0,
      monster: monster
    });
  }

  shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
      [array[i], array[j]] = [array[j], array[i]]; // swap elements
    }
  }

  moveAI = () => {
    let monster = this.state.monster;
    if(this.state.revealedAI.title !== 'Basic Action'){
      monster.aiDeck.cardsInDiscard.push(this.state.revealedAI);
    }
    
    this.setState({
      revealedAI: 0,
      monster: monster
    });
  }

  removeAICard = (numWounds) => {
    let monster = this.state.monster;
    
    while(numWounds > 0){
      if(monster.aiDeck.cardsInDeck.length > 0){
        monster.aiDeck.cardsRemoved.push(monster.aiDeck.cardsInDeck.shift());
      }
      else if (monster.aiDeck.cardsInDiscard.length > 0){
        this.shuffleAI();
        monster.aiDeck.cardsRemoved.push(monster.aiDeck.cardsInDeck.shift());
      }
      else {
        this.gameWon();
      }
      numWounds--;
    }

    UpdateMonsterAI(monster);
  }

  gameWon = () => {
    console.log("The monster is dead! You win!");

    let showdown = this.props.showdown;
    showdown.gameStatus = "WIN";

    this.props.updateShowdown(showdown);
  }

  printAI = () => {
    console.log("printing ai deck");
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
    const gameStatus = this.props.showdown.gameStatus;

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
        <div align="left" style={{ borderRadius: "5px", background: "#282c34", fontSize: "8px", color: "white", position: "absolute", height: 50, width: 250, top: 50, left: 800 }}>Game turn: {this.props.showdown.turn}, move selected: {this.state.action.moveSelected.toString()}, game status: {this.props.showdown.gameStatus}, showdown id: {this.props.showdown.id}, survivorId: {this.state.survivor.id}, monsterId: {monsterId}
        , revealed ai: {this.state.revealedAI.title}, game name: {this.props.showdown.description}</div>
        <TileRenderer targets={this.state.targets} tileSize={size} topOffset={topOffset} leftOffset={leftOffset} click={this.click} highlights={highlights} markedX={this.state.selection.markedX} markedY={this.state.selection.markedY} width_tiles={width_tiles} height_tiles={height_tiles} />
        <MonsterTile tileSize={size} topOffset={topOffset} leftOffset={leftOffset} click={this.click} facing={monsterFacing} selectedMonster={this.state.selection.selectedMonsterId} positionX={monsterPosX} positionY={monsterPosY} height={monsterHeight} width={monsterWidth} id={monsterId} gameStatus={gameStatus}/>
        <SurvivorTiles tileSize={size} topOffset={topOffset} leftOffset={leftOffset} click={this.click} selectedSurvivorId={this.state.selection.selectedSurvivorId} survivors={survivors} />
        <InfoBox selection={this.state.selection.typeSelected} survivor={this.state.survivor} monster={monster} />
        <ActionBox moveSelected={this.state.action.moveSelected} survivor={this.state.survivor} aiCard={this.state.revealedAI} targets={this.state.targets} selection={this.state.selection.typeSelected} attack={this.attack} target={this.target} revealAI={this.revealAI} nextTurn={this.nextTurn} move={this.clickedMove} activate={this.clickedActivate} changeFacing={this.changeFacing} />
        {this.state.showPopup ? <ActivationSelecter text='Close Me' closePopup={this.togglePopup.bind(this)} /> : null}
        {this.state.dodge.showDodgePopup ? <DodgeSelecter hits={this.state.dodge.hits} dodgeHits={this.dodgePopUpClosed.bind(this)} /> : null}
      </div>
    )
  }
  
  togglePopup = () => {
    console.log("updating popup state")
    this.setState({
      showPopup: !this.state.showPopup
    });
  }
}

class ActivationSelecter extends React.Component {
  render() {
    //console.log("rendering popup");
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

class DodgeSelecter extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      selectedHit: ""
    }
  }

  dododge = () => {
    this.props.dodgeHits(this.state.selectedHit);
  }

  dontdodge = () => {
    this.props.dodgeHits("");
  }

  onChange = (e) => {
    this.setState({
      selectedHit: e.target.value
    });
  }

  render() {

    let hitLocations = [];
    for(let n=0; n<this.props.hits.length; n++){
      hitLocations.push({
        value: this.props.hits[n],
        onChange: this.onChange.bind(this)
      });
    }
    
    let radioButtons = <MapRadioButtons data={hitLocations}/>

    return (
      <div className='popup'>
        <div className='popup_inner'>
          <h2>Dodge hits?</h2>

          {radioButtons}
          
            <div>
              <button onClick={this.dododge} >Dodge</button>
              <button onClick={this.dontdodge}>Skip</button>
            </div>
        </div>
      </div>
    );
  }
}

function MapRadioButtons(props){
 
  return(
    props.data.map((s, index) => 
        <RadioButtonOption value={s.value} onChange={s.onChange} key={index}/>
    ))
}

class RadioButtonOption extends React.Component {
  render(){
    return(
      <div>
        <label>
          <input
            type="radio"
            name="react-tips"
            value={this.props.value}
            onChange={this.props.onChange}
            className="form-check-input"
          />
          {this.props.value}
        </label>
        </div>
    )
  }
}
