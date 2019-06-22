import React, { Component } from 'react';
import '../App.css';
import TileRenderer from './TileRenderer';
import MonsterTile from './MonsterTile';
import SurvivorTiles from './SurvivorTiles';
import InfoBox from './InfoBox';
import ActionBox from './ActionBox';
import DodgeSelecter from './DodgeSelecter'
import HLSelecter from './HLSelecter'
import Gamelog from './Gamelog';
import AICard from './AICard';
import TurnChanger from './TurnChanger';
import GearGrid from './GearGrid';
import AllHLCards from './AllHLCards';
import ReactTooltip from 'react-tooltip'

import { UpdateSurvivor, DeleteSurvivor, GetHitlocations, GetSurvivorMoves, GetInjury} from '../Functions/RestServices/Survivor';
import { UpdateMonster , UpdateMonsterAI, UpdateMonsterHL, GetTargets, GetMonsterMoves, GetMonsterSpecialMove } from '../Functions/RestServices/Monster';
import { PositionsEqual, EmptySpaceInFrontOfMonster, SurvivorInRange, MonsterInRange, MonsterOnSurvivor, GetDiceRoll, GetDiceRolls, GetMonsterDirectionMarks, DirectionsAgainstSurvivor} from '../Functions/HelperFunctions'


export default class GameBoard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selection: {
        markedX: -1,
        markedY: -1,
        selectedMonsterId: -1,
        selectedSurvivorId: -1,
        hoverSurvivor: 0,
        hoverGear: 0,
        hover_x: 0,
        hover_y: 0,
        typeSelected: "",
        typeHover: "",
        monsterTarget: -1,
        equipedGear: this.initGear(),
      },
      action: {
        moveSelected: false,
        monsterMoveSelected: false,
        selectMonsterTarget: false,
        survivorGrabbed: false,
        selectHLCard: false
      },
      keyDown: {
        shift: false
      },
      dodge: {
        showDodgePopup: false
      },
      survivor: this.props.showdown.survivors[0],
      survivors: this.props.showdown.survivors,
      survivorIds: this.initSurvivorIds(),
      monster: this.props.showdown.monster,
      monsterInRange: false,
      aiDeck: this.props.showdown.monster.aiDeck,
      hlDeck: this.props.showdown.monster.hlDeck,
      hlCard: 0,
      highlights: [],
      monsterMoves: [],
      remainingMonsterMove: 0,
      monsterMoveHighlights: [],
      
      popUp: {
        showGearGrid: false
      },

      selectedWeapon: 2, //index in gear grid
      targets: [],
      revealedAI: 0,
      revealedHL: 0,
      log: [
        {message: "New game started (id=" +this.props.showdown.id +")", type: "GAME_INFO"},
        {message: "** Turn 1, MONSTERS act starting", type: "GAME_INFO"}
      ],

      debug: {
        showAllHLcards: false,
        hlCard: this.props.showdown.monster.hlDeck.cardsInDeck[0]
      }
    }
  }

  initGear = () => {
    
    let gearArr = [];
    for (let n=0; n<this.props.showdown.survivors.length; n++){
      gearArr.push({survivorId: this.props.showdown.survivors[n].id, gear: this.props.showdown.survivors[n].gearGrid.gear[2], attackProfileIndex: -1});
    }
    return gearArr;
  }

  initSurvivorIds = () => {
    let idsArr = [];
    for (let n=0; n<this.props.showdown.survivors.length; n++){
      idsArr.push(this.props.showdown.survivors[n].id);
    }
    return idsArr;
  }

  componentDidMount(){
    document.addEventListener("keydown", this.keyFunction, false);
    document.addEventListener("keyup", this.keyUpFunction, false);
    //document.addEventListener("mousemove", this.mouseFunction, false);
  }
  componentWillUnmount(){
    document.removeEventListener("keydown", this.keyFunction, false);
    document.removeEventListener("keyup", this.keyUpFunction, false);
  }

  componentWillReceiveProps(){
    console.log("receiving new props!");
    console.log("showdown id: " +this.props.showdown.id);
  }

  /*
  mouseFunction = (event) => {
    this.setState({
      x_mouse: event.screenX,
      y_mouse: event.screenY
    })
  }
  */

  keyUpFunction = (event) => {
    if(event.keyCode===16){ //shift
      let keyDown = this.state.keyDown;
      keyDown.shift = false;
      this.setState({keyDown: keyDown});
    }
  }

  keyFunction = (event) => {
    //37, 38, 39, 40: left, up, right, down
    //49: 1
    //alert("onKeyPressed! " +event.keyCode);
    if(event.keyCode===16){ //shift
      let keyDown = this.state.keyDown;
      keyDown.shift = true;
      this.setState({keyDown: keyDown});
    }

   if(event.keyCode===49){ //1
    this.selectSurvivor(this.state.survivorIds[0]);
   }else if(event.keyCode===50){ //2
    this.selectSurvivor(this.state.survivorIds[1]);
   }
   else if(event.keyCode===51){ //3
    this.selectSurvivor(this.state.survivorIds[2]);
   }
   else if(event.keyCode===52){ //4
    this.selectSurvivor(this.state.survivorIds[3]);
   }
   else if(event.keyCode===53){ //5
    this.selectMonster();
   }
   else if(event.keyCode===77){ //m
    if((this.state.selection.selectedSurvivorId !== -1 && this.state.survivor.movesLeft > 0) || this.state.selection.selectedMonsterId !== -1){
      this.clickedSurvivorMove(); 
    }
   }
   else if(event.keyCode===65){ //a
     if(this.state.selection.selectedSurvivorId !== -1 && this.state.survivor.activationsLeft > 0){
      this.clickedActivate();
    }
   }
   else if(event.keyCode===78){ //n
    if(this.state.selection.selectedMonsterId !== -1 && this.state.revealedAI === 0){
      this.clickedRevealAI();
    }
   }
   else if(event.keyCode===80){ //p
    if(this.state.revealedAI !== 0){
      this.findAvailableTargets();
    }
   }
   else if(event.keyCode===71){ //g
    if(this.state.selection.selectedSurvivorId !== -1){
      this.showGearGrid();
    }
   }
   else if(event.keyCode===37){ //left
    this.moveMonsterInDirection("LEFT");
   }
   else if(event.keyCode===38){ //up
    this.moveMonsterInDirection("UP");
   }
   else if(event.keyCode===39){ //right
    this.moveMonsterInDirection("RIGHT");
   }
   else if(event.keyCode===40){ //down
    this.moveMonsterInDirection("DOWN");
   }
 }

 clickedAttack = () => {
  let aiCard = this.state.revealedAI;
  let survivor = this.state.selection.monsterTarget;
  let monster = this.state.monster;

  let action = this.state.action;
  action.monsterMoveSelected = false;

  this.setState({action: action});

  console.log("monster attacking, fetching aiCard=" +aiCard.title +" from state");
  this.attack(monster, aiCard, survivor);
}

  /*
  * Handles a click on the board
  */
 click = (props) => {

  let identifier = props.target.alt.split("_")[0];
  let x = parseInt(props.target.alt.split("_")[1]);
  let y = parseInt(props.target.alt.split("_")[2]);

  if (identifier === "survivor") { //clicked a survivor
    this.selectSurvivor(x);
  }
  else if (identifier === "monster") { //clicked monster
    this.selectMonster();
  }
  else if ((identifier === "board")) { //clicked board
    this.clickedBoard(x, y);
  }
}

clickedSurvivorMove = () => {
  let action = this.state.action;
  action.moveSelected = !action.moveSelected;
  this.setState({
    action: action
  })
}

clickedMonsterMove = () => {
  let action = this.state.action;
  action.moveSelected = !action.moveSelected;
  action.monsterMoveSelected = !action.monsterMoveSelected;
  let remainingMonsterMove = this.state.monster.statline.movement;

  this.addLogMessage("Use arrow keys to move monster into position. Hold shift to change facing.", "GAME_INFO");
  this.markDirectionsAgainstSurvivor(this.state.monster, this.state.selection.monsterTarget);

  this.setState({
    action: action,
    remainingMonsterMove: remainingMonsterMove
  })
}

clickedActivate = () => {
  this.activateSurvivor(this.state.survivor);
}

clickedBoard = (x,y) => {

  this.addLogMessage("CLICKED TILE " +x +"," +y, "GAME_INFO");

  if (x === this.state.selection.markedX && y === this.state.selection.markedY) { //deselect if click same tile twice
    this.deselect();
  }
  else {
    if (this.state.action.moveSelected === true) {         //MOVEMENT
        if (this.state.selection.typeSelected === "survivor") {  //MOVE SURVIVOR
          if(this.survivorValidMove(x, y)){
            this.moveSurvivor(x,y);
          }
        }
        let action = this.state.action;
        action.moveSelected = false;
        this.setState({ action: action })
    }
    else if(this.state.action.monsterMoveSelected === true){
      if(this.monsterValidMove(x,y)){ //MOVE MONSTER
        this.moveMonsterToValidPosition(x,y);
      }
    }
    else {

      let selection = this.state.selection;
      selection.typeSelected = "board";
      selection.markedX = x;
      selection.markedY = y;
      selection.selectedMonsterId = -1;
      selection.selectedSurvivorId = -1;

      this.setState({
        selection: selection,
        highlights: [],
      })
    }
  }

  if(this.state.revealedHL !== 0 && this.state.revealedHL.length > 0){
    let action = this.state.action;
    action.selectHLCard = true;
    this.setState({action: action});
  }
 }

/*
 * Deselects survivor/monster
 */
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

 moveMonsterInDirection = (direction) => {
  if(this.state.action.monsterMoveSelected){

    let target = this.state.selection.monsterTarget; //survivor
    let monster = this.state.monster;
    let survivors = this.state.survivors;
    let attack = {reach: 1};
    let remainingMonsterMove = this.state.remainingMonsterMove;

    if(!this.state.keyDown.shift){

      if(MonsterInRange(monster, target, attack)){
        console.log("already in range, no move needed!")
        this.setState({monsterInRange: true});
      }
      else if(remainingMonsterMove === 0){
        console.log("no monster movement left");
      }
      else {
        console.log("not in range, moving " +direction);

        if(direction === "DOWN"){
          if(monster.position.y<17 && monster.position.y < (target.position.y-1)){ //TODO: get from state
            monster.position.y++;
            remainingMonsterMove--;
          }
        }
        else if(direction === "UP"){
          if(monster.position.y>0 && monster.position.y > target.position.y){
            monster.position.y--;
            remainingMonsterMove--;
          }
        }
        else if(direction === "LEFT"){
          if(monster.position.x>0 && monster.position.x > target.position.x){
            monster.position.x--;
            remainingMonsterMove--;
          }
        }
        else if(direction === "RIGHT"){
          if(monster.position.x<20 && monster.position.x < (target.position.x-1)){ //TODO: get from state
            monster.position.x++;
            remainingMonsterMove--;
          }
        }
        else {
          console.log("not moving, only able to move closer to target");
        }
        this.checkCollisions(monster, survivors);
      }
    }
    monster.facing = direction;

    if(MonsterInRange(monster, target, attack) || remainingMonsterMove === 0){
      this.unMarkMonsterMoves();
      this.checkKnockBack(monster, survivors);
    }
    else {
      this.markDirectionsAgainstSurvivor(monster, target); 
    }
    
    this.updateMonster(monster);
    this.setState({remainingMonsterMove: remainingMonsterMove});
  }
 }

 moveMonsterToValidPosition = (x,y) => {

  let monster = this.state.monster;
  let survivors = this.state.survivors;

  let counter = 0;
  while(monster.position.x !== x || monster.position.y !== y){ //Move one step at a time to check collisions

    if(monster.position.x < x && counter%2 === 0){
      monster.position.x++;
    }
    else if(monster.position.x > x && counter%2 === 0){
      monster.position.x--;
    }
    else if(monster.position.y < y){
      monster.position.y++;
    }
    else if(monster.position.y > y){
      monster.position.y--;
    }

    this.checkCollisions(monster, survivors);
    counter++;
  }

  this.checkKnockBack(monster, survivors);
  this.addGrab(monster);
  this.updateMonster(this.state.monster);

  if(this.state.revealedHL !== 0 && this.state.revealedHL.length > 0){
    let action = this.state.action;
    action.selectHLCard = true;
    this.setState({action: action});
  }
}

markDirectionsAgainstSurvivor = (monster, survivor) => {
  let directions = DirectionsAgainstSurvivor(monster.position, survivor.position);

  let coordinates = [];
  for(let n=0; n<directions.length; n++){
    let newCoord = GetMonsterDirectionMarks(monster.position, directions[n]);
    for(let m=0; m<newCoord.length; m++){
      coordinates.push(newCoord[m]);
    }
  }
  this.setState({monsterMoveHighlights: coordinates});
}

unMarkMonsterMoves = () => {
  let action = this.state.action;
  action.monsterMoveSelected = false;
  this.setState({
    monsterMoveHighlights: [],
    action: action
  });
}

 addGrab = (monster) => {
  if(this.state.action.survivorGrabbed){
    console.log("waiting for grab, placing survivor")
    let action = this.state.action;
    action.survivorGrabbed = false;

    if(this.state.selection.monsterTarget !== -1 && typeof this.state.selection.monsterTarget !== 'undefined'){
      this.grabSurvivor(monster, this.state.selection.monsterTarget);
    }
    else{
      console.log("ERROR: Monster target not set")
    }

    this.setState({
      action: action
    });
  }
 }

 checkCollisions = (monster, survivors) => {
   /*
   All survivors passed over are knocked down
   */
   const collisions = MonsterOnSurvivor(monster, survivors);
   for(let n=0; n<collisions.length; n++)
   {
     let survivor_n = this.getSurvivorById(collisions[n]);
     survivor_n.status = "KNOCKED_DOWN";
     console.log("set knock down for " +survivor_n.name);
     this.addLogMessage(survivor_n.name +" was run over and knocked down by the monster", "MONSTER");

     this.updateSurvivor(survivor_n);
   }
 }

 checkKnockBack = (monster, survivors) => {
    /*
    All survivors under monster gets knockback
    */
    const collisions = MonsterOnSurvivor(monster, survivors);
    for(let n=0; n<collisions.length; n++)
    {
      let survivor_n = this.getSurvivorById(collisions[n]);
      survivor_n.status = "KNOCKED_DOWN";
      console.log("set knock down for " +survivor_n.name);

      survivor_n = this.addKnockback(survivor_n, 6);
      this.updateSurvivor(survivor_n);
    }
 }

 survivorAlive = (id) => {
  return (this.getSurvivorById(id) !== null)
 }

 /*
  * Selects the monster on screen, or deselects of already marked
  */
 selectMonster = () => {
  let selection = this.state.selection;
  let action = this.state.action;

  if(selection.selectedMonsterId !== -1){
    this.deselect();
  }
  else {

    selection.selectedMonsterId = this.props.showdown.monster.id;
    selection.selectedSurvivorId = -1;
    selection.typeSelected = "monster";
    selection.markedX = -1;
    selection.markedY = -1;
    action.moveSelected = false;

    this.setState({
      selection: selection,
      action: action,
      highlights: []
    });
  }
 }

 hoverMonster = (x,y) => {
   let selection = this.state.selection;
   selection.typeHover = "monster";
   selection.hover_x = x;
   selection.hover_y = y;
   this.setState({selection: selection});
 }
 hoverSurvivor = (id, x, y) => {
  //console.log("x: " +x +", y: " +y);
  let selection = this.state.selection;
  selection.typeHover = "survivor";
  selection.hoverSurvivor = this.getSurvivorById(id);
  selection.hoverGear = this.getSelectedGearForSurvivorId(id);
  selection.hover_x = x;
  selection.hover_y = y;
  this.setState({selection: selection});
}
deHoverSurvivor = (id) => {
 this.deHover();
}
deHoverMonster = () => {
  this.deHover();
}
deHover = () => {
  let selection = this.state.selection;
  selection.typeHover = "";
  this.setState({selection: selection});
}

 /*
  * Selects a survivor on screen, or deselects of already marked
  */
 selectSurvivor = (id) => {
  let selection = this.state.selection;
  let action = this.state.action;
  const survivor = this.getSurvivorById(id);
  const monster = this.state.monster;

    if(id === selection.selectedSurvivorId){
      this.deselect();
    }
    else{

      selection.selectedMonsterId = -1;
      if(this.survivorAlive(id)){
        if(this.state.action.selectMonsterTarget){
          console.log("choosing among multiple survivors");
          selection.typeSelected = "monster";
          selection.monsterTarget = survivor;

          let monsterInRange = MonsterInRange(monster, survivor, this.state.revealedAI.attack);

          this.setState({
            targets: [survivor],
            monsterInRange: monsterInRange
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

 moveSurvivor = (x,y) => {
    let survivor = this.state.survivor;
    survivor.position.x = x;
    survivor.position.y = y;
    survivor.movesLeft = 0;
    this.addLogMessage("** Moving " +survivor.name +" to (" +x +"," +y +")", "SURVIVOR");

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

 addKnockback = (survivor, length) => {
   console.log("knockback on " +survivor.name);
   
   let monster = this.state.monster;
   let facing = monster.facing;

   if(facing === "UP" || facing === "DOWN"){
    console.log("facing up/down");
     if(monster.position.x === survivor.position.x){ //survivor on left side
      console.log("survivor on left side");
        if(survivor.position.x >= length){
          console.log("knock back to left");            
          survivor.position.x -= length;            //knockback to left if possible
        }
        else{
          survivor.position.x += length;
        }
     }
     else{ //survivor on right side
        if(survivor.position.x+length <= this.state.board.width){
          survivor.position.x += length;
        }
        else{
          survivor.position.x -= length;
        }
     }
   }
   else if(facing === "LEFT" || facing === "RIGHT"){
    if(monster.position.y === survivor.position.y){ //survivor on top side
      if(survivor.position.y >= length){
        survivor.position.y -= length;
      }
      else{
        survivor.position.y += length;
      }
    }
    else{ //survivor on bottom side
      if(survivor.position.y+length <= this.state.board.height){
        survivor.position.y += length;
      }
      else{
        survivor.position.y -= length;
      }
    }
   }

   return survivor;
 }

 

 printBaseCoordinates = (base) => {
   for(let m=0; m<base.length; m++){
      console.log("BASE (" +base[m].x +","  +base[m].y +")");
    }
 }

  survivorValidMove(x, y) {
    let validMove = false;
    for (let n = 0; n < this.state.highlights.length; n++) {
      if (this.state.highlights[n].x === x && this.state.highlights[n].y === y) {
        validMove = true;
      }
    }
    return validMove;
  }

  monsterValidMove(x, y) {
    let validMove = false;
    for (let n = 0; n < this.state.monsterMoveHighlights.length; n++) {
      if (this.state.monsterMoveHighlights[n].x === x && this.state.monsterMoveHighlights[n].y === y) {
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

  setMonsterMoves = (id) => { //DEPRECATED
    GetMonsterMoves(id).then(data => {
      this.setState({
        monsterMoves: data
      })
    })
  }

  activateSurvivor = (survivor) => {

    let attackProfile = this.getSelectedAttackProfile();
    let gear = this.getSelectedGear();
    let monster = this.state.monster;
    
    //check activation cost
    if(this.activationPossible(monster, survivor, attackProfile)){
      this.payActivationCost(survivor, attackProfile);

      let logMsg = "** " +survivor.name +" activated " +gear.name;
      if(attackProfile.useName !== null){
        logMsg = logMsg + "(" +attackProfile.useName +")";
      }
      this.addLogMessage(logMsg, "SURVIVOR");
      console.log("getting hits with speed=" +this.getSpeed());
  
          //const toHitValueNeeded = this.getToHitValue(); //TODO: debug
          let toHitValueNeeded = 1;
          const speed = this.getSpeed();

          let numHits = 0;
          if(toHitValueNeeded === 1){
            this.addLogMessage(survivor.name +" scored " +speed +" automatic hits", "SURVIVOR");
            numHits = speed;
          }
          else{
            const diceRolls = GetDiceRolls(1,10,speed);
            this.addLogMessage("Rolled " +diceRolls, "GAME_INFO");

            numHits = this.getHits(diceRolls, toHitValueNeeded).length;
            this.addLogMessage(survivor.name +" scored " +numHits +" hits (" +toHitValueNeeded +"+ needed)", "SURVIVOR");
          }
          
          //Reveal HitLocations
          this.revealHL(numHits);
        
    }
    else {
      console.log("unable to activate");
    }
  }

  activationPossible = (monster, survivor, attackProfile) => {

    if(attackProfile.activationCost.activation && survivor.activationsLeft > 0){
      console.log("enough activations to use this gear");
    }
    else if(attackProfile.activationCost.archive){
      console.log("archive to use this gear");
    }
    else {
      console.log("no activations remaining")
      return false;
    }

    let inRange = SurvivorInRange(monster, survivor, attackProfile);
    if(inRange){
      this.addLogMessage(survivor.name +" in range", "SURVIVOR");

      return true;
    }
    else{
      console.log("survivor not in range")
      return false;
    }
  }
  
  payActivationCost = (survivor, attackProfile) => {
    if(attackProfile.activationCost.activation){
      survivor.activationsLeft = survivor.activationsLeft -1;
    }
    if(attackProfile.activationCost.move){
      survivor.movesLeft = survivor.movesLeft -1;
    }
    if(attackProfile.activationCost.archive){
      this.archiveGear("Founding Stone");
    }
    this.updateSurvivor(survivor);
  }

  archiveGear(gearName){
    console.log("archiving gear " +gearName);
    let survivor = this.state.survivor;
    let index = -1;
    for(let n=0; n<survivor.gearGrid.gear.length; n++){
      if(survivor.gearGrid.gear.name === gearName){
        index = n;
        break;
      }
    }
    survivor.gearGrid.gear.splice(index, 1);
    this.updateSurvivorInState(survivor);
  }

  addLogMessage = (newMessage, type) => {
    let log = this.state.log;
    if(log[log.length-1].message !== newMessage){
      log.push({message: newMessage, type: type}); //unshift to add to front of array
      this.setState({log: log});
    }
    else {
      console.log("ignoring writing message to log: " +newMessage);
    }
  }

  successfulWound = (diceRoll, sucessValue) => {

    if(diceRoll >= sucessValue){
      return {dieResult: diceRoll, sucess: true};
    }
    else {
      return {dieResult: diceRoll, sucess: false};;
    }
  }

  isInsane = (survivor) => {
    if(this.getArmourAt(survivor, "BRAIN") >= 3){
      return true;
    }
    else {
      return false;
    }
  }

  woundLocation = (hlCard) => {

    this.stashHlCard(hlCard);

    let action = this.state.action;
    let monster = this.state.monster;
    let survivor = this.state.survivor;
    console.log("wounding with survivor " +survivor.name);
    let attackProfile = this.getSelectedAttackProfile();

    action.selectHLCard = false;
    this.setState({action: action}); //Temporary hide HL card popup to show game
    
    if(hlCard.trap){
      this.resolveTrap(hlCard, survivor, monster);
    }
    else if(!SurvivorInRange(monster, survivor, attackProfile)){
      this.addLogMessage("Survivor out of range, cancelling hit", "GAME_INFO");
      this.discardHLCard(hlCard);
      this.discardRevealedHLCards();
    }
    else if(survivor.status === "KNOCKED_DOWN"){
      this.addLogMessage("Survivor knocked down, unable to attack", "GAME_INFO");
      this.discardHLCard(hlCard);
      this.discardRevealedHLCards();
    }
    else {

      let sucessValue = this.toWoundValue(monster);
      let diceRoll = GetDiceRoll(1,10);
        
      let woundResult = {dieResult: 0, sucess: false, crit: false};
      if(attackProfile.alwaysCrits){ //thrown founding stone
        this.addLogMessage("Automatic crit scored", "SURVIVOR")
        woundResult.crit = true;
      }
      else {
        this.addLogMessage("Attempting to wound " +hlCard.title +" (" +sucessValue +"+ needed)", "SURVIVOR");
        woundResult = this.successfulWound(diceRoll, sucessValue);

        if(woundResult.sucess){
          this.addLogMessage("Rolled " +woundResult.dieResult +", success!", "SURVIVOR");
        }
        else {
          this.addLogMessage("Rolled " +woundResult.dieResult +", failed to wound.", "SURVIVOR");
        }
        
        if(diceRoll >= this.getCritValue(attackProfile, 0)){ //0 = survivor luck
          this.addLogMessage("Crit rolled", "SURVIVOR")
          woundResult.crit = true;
        }
      }
      if(hlCard.critable && woundResult.crit){
        woundResult.sucess = true;
      }
      else if(!hlCard.critable && woundResult.crit){
        this.addLogMessage("No critical hits on this location :/ ", "GAME_INFO")
      }      
      let effectTriggered = false;

      if(woundResult.crit && hlCard.critable){ //critical wound
        //Critical wounds handled after reactions because might affect where HL card is discarded
      }
      else if(woundResult.sucess && !hlCard.impervious){ //normal wound
        monster.lastWoundedBy = survivor.id;

        this.updateMonster(monster);
        this.removeAICard(1);

        if(hlCard.woundEffect && !woundResult.crit){
          this.addLogMessage("Wound action triggered", "MONSTER");
          effectTriggered = true;
        }
      }
      else{ //Failed to wound
        if(hlCard.impervious){
          this.addLogMessage("Hit location is impervious, unable to wound", "GAME_INFO");
        }
        if(hlCard.failureEffect && !woundResult.crit){
          this.addLogMessage("Failed to wound, reaction triggered", "GAME_INFO");
          effectTriggered = true;
        }
        else {
          this.addLogMessage("Failed to wound", "GAME_INFO");
        }
      }

      //Post wound triggers:
      if(hlCard.reflexEffect && !woundResult.crit && monster.status !== "KNOCKED_DOWN"){
        this.addLogMessage("Reflex action triggered", "MONSTER");
        effectTriggered = true;
      }
      if(effectTriggered && woundResult.crit){
        this.addLogMessage("Monster reaction cancelled due to critical hit", "GAME_INFO");
      }
      else if(effectTriggered && monster.status === "KNOCKED_DOWN"){
        this.addLogMessage("Monster is knocked down and unable to react", "GAME_INFO");
      }
      else if(effectTriggered){
        this.addTriggerEffect(survivor, hlCard.effect);
      }

      //Critical
      if(woundResult.crit && hlCard.critable){
        this.setCriticalWound(survivor, hlCard); //HL card discarded if no persistant injury
      }
      else{
        this.discardHLCard(hlCard);
      }
    }
  }

  stashHlCard = (hlCard) => {
    this.setState({hlCard: hlCard});
  }

  getCritValue = (attackProfile, luck) => {
    if(attackProfile.alwaysCrits){
      console.log("attack always crits, returning 1+ as needed value");
      return 1;
    }
    let critValue = 10;
    if(attackProfile.deadly){
      console.log("weapon is deadly, increasing crit chance");
      critValue--;
    }
    return critValue-luck;
  }

  resolveTrap = (trapCard, survivor, monster) => {
    this.addLogMessage("Resolving trap", "GAME_INFO");
    console.log("resolve trap, survivor=" +survivor.name);

    let hlDeck = this.state.hlDeck;

    survivor.doomed = true;
    this.attack(monster, this.state.aiDeck.basicAction, survivor);

    hlDeck = this.shuffleHL(hlDeck);
    let action = this.state.action;
    action.selectHLCard = false;
    this.setState({
      action: action,
      hlDeck: hlDeck,
      revealedHL: 0});
  }

  setCriticalWound = (survivor, hlCard) => {
    console.log("setting critical wound")
    this.addLogMessage(hlCard.criticalWound.description, "SURVIVOR");
    let monster = this.state.monster;

    if(hlCard.criticalWound.cardEffect.monsterNegativeToken){
      console.log("Adding negative token " +hlCard.criticalWound.cardEffect.monsterNegativeToken +" to monster");
      monster.negativeTokens.push(hlCard.criticalWound.cardEffect.monsterNegativeToken);
      this.addLogMessage("The monster gained -1 " +hlCard.criticalWound.cardEffect.monsterNegativeToken);
      this.updateMonster(monster);
    }
    if(hlCard.criticalWound.cardEffect.monsterPositiveToken){
      console.log("Adding positive token " +hlCard.criticalWound.cardEffect.monsterPositiveToken +" to monster");
      monster.positiveTokens.push(hlCard.criticalWound.cardEffect.monsterPositiveToken);
      this.addLogMessage("The monster gained +1 " +hlCard.criticalWound.cardEffect.monsterPositiveToken);
      this.updateMonster(monster);
    }
    if(hlCard.criticalWound.hlCardTableResult !== null){
      console.log("Rolling on critical result table ");
      const diceRoll = GetDiceRoll(1,10);
      console.log("Rolled " +diceRoll);

      const index = hlCard.criticalWound.hlCardTableResult.tableIndexes[diceRoll-1];
      const cardEffect = hlCard.criticalWound.hlCardTableResult.cardEffects[index];

      console.log("Effect from table: " +cardEffect.description +" (NOT IMPLEMENTED?)")
      this.addTriggerEffect(survivor, cardEffect);
    }

    if(hlCard.criticalWound.persistantInjury){
      this.setPersistantInjury(hlCard);
    }
    else {
      this.discardHLCard(hlCard);
    }
  }

  setPersistantInjury = (hlCard) => {
    console.log("setting persistant injury");

    this.removeHLCard(hlCard);
  }

  getSpeed = () => {
    return this.getSelectedAttackProfile().speed;
  }

  getToHitValue = () => {
    const attackProfile = this.getSelectedAttackProfile();
    if(attackProfile.alwaysHits){
      console.log("attack always hits");
      return 1;
    }
    else if(this.state.monster.status === "KNOCKED_DOWN"){
      this.addLogMessage("Monster is knocked down, hitting on 3+", "GAME_INFO");
      return 3;
    }
    else {
      const toHitValue = attackProfile.toHitValue;
      return Math.max(this.inBlindSpot(this.state.survivor) ? toHitValue-1 : toHitValue, 2);
    }
  }

  inBlindSpot = (survivor) => {
    for(let i=0; i<this.state.monster.blindspot.length; i++) {
      if(PositionsEqual(survivor.position, this.state.monster.blindspot[i])){
        return true;
      }
    }
    return false;
  }

  /*
  Returns gear eqiped by current survivor
  */
  getSelectedGear = () => {
    return this.getSelectedGearForSurvivorId(this.state.survivor.id);
  }

  getSelectedGearForSurvivorId = (id) => {
    const selection = this.state.selection;

    for(let n=0; n<selection.equipedGear.length; n++){
      if(selection.equipedGear[n].survivorId === id){
        const gear = selection.equipedGear[n].gear;
        if(gear === -1){
          return this.state.survivor.gearGrid.gear[0]; //fist and tooth
        }
        else {
          return gear;
        }
      }
    }
    console.log("ERROR: survivor id (" +id +")not found in getSelectedGearForSurvivorId()")
    return -1;
  }

  getSelectedSpecialUse = () => {
    const selection = this.state.selection;

    for(let n=0; n<selection.equipedGear.length; n++){
      if(selection.equipedGear[n].survivorId === this.state.survivor.id){
        return selection.equipedGear[n].attackProfileIndex;
      }
    }
    return -1;
  }

  getSelectedAttackProfile = () => {
    let gear = this.getSelectedGear();
    let index = this.getSelectedSpecialUse();
    if(index !== -1){
      return gear.attackProfiles[index];
    }
    else {
      return gear.attackProfiles[0];
    }
  }

  toWoundValue = (monster) => {
    let t = this.state.monster.statline.toughness + this.getTokenBonus(monster, "TOUGHNESS");
    //let s1 = this.state.survivor.strength;
    let s1 = 0;
    let s2 = this.getSelectedAttackProfile().strengthBonus;

    console.log("t: " +t +", s1: " +s1 +", s2: " +s2);
    return Math.max(t - (s1+s2), 2); //1 to wound always fail
  }

  getSurvivor = (id) => {
    let survivor = null;
    for(let n=0; n<this.state.survivors.length; n++){
      if(id === this.state.survivors[n].id){
        survivor = this.state.survivors[n];
      }
    }
    return survivor;
  }



  nextAct = (e) => {
    let showdown = this.props.showdown;
    let survivors = this.state.survivors;
    let monster = this.state.monster;
    monster.activatedThisTurn = false;

    if(showdown.act === "MONSTERS"){
      showdown.act = "SURVIVORS";

      for (let n = 0; n < survivors.length; n++) {
        if(survivors[n].status === "KNOCKED_DOWN"){
          this.addLogMessage(survivors[n].name +" stands up", "GAME_INFO");
          survivors[n].status = "STANDING"; //TODO: actually only applies to survivors knocked down last act
        }
      }
      this.updateSurvivors(survivors);

      if(this.state.monster.status === "DIES_NEXT_TURN"){
        monster.status = "DIES_THIS_TURN";
      }
      else if(this.state.monster.status === "DIES_THIS_TURN"){
        this.gameWon();
      }
    }
    else if (showdown.act === "SURVIVORS"){
      showdown.act = "MONSTERS";
      showdown.turn = showdown.turn + 1;

      for (let n = 0; n < survivors.length; n++) {
        survivors[n].movesLeft = 1;
        survivors[n].activationsLeft = 1;
      }
      this.updateSurvivors(survivors);

      if(this.state.monster.status === "DIES_NEXT_TURN"){
        monster.status = "DIES_THIS_TURN";
      }
      else if(this.state.monster.status === "KNOCKED_DOWN"){
        monster.status = "STANDING";
        this.addLogMessage("The monster stands up", "GAME_INFO");
      }
    }
    else {
      console.log("ERROR: unexpected game act: " +showdown.act);
    }

    this.updateMonster(monster);
    this.addLogMessage("------------------------", "GAME_INFO");
    this.addLogMessage("** Turn " +showdown.turn +", " +showdown.act +" act starting **", "GAME_INFO");
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

  updateMonster = (monster) => {
    UpdateMonster(monster).then(data => {
      data.aiDeck = 0;
      data.hlDeck = 0;
      this.setState({monster: data});
    })
  }

  updateSurvivor = (survivor) => {
    if(typeof survivor !== 'undefined'){
      UpdateSurvivor(survivor).then(survivor => {
        //console.log("survivor updated in backend " +survivor.name)
        //this.updateSurvivorInState(survivor); //TODO: will disabling this lead to any bugs?
      });
      this.updateSurvivorInState(survivor); //used to call in "then"
    }
    else {
      console.log("updateSurvivor: Input not defined");
    }
  }

  updateSurvivorInState = (survivor) => {
    let survivors = this.state.survivors;
    for(let n=0; n<survivors.length; n++){
      if(survivor.id === survivors[n].id){
        survivors[n] = survivor;
      }
    }
    this.setState({survivors: survivors})
  }

  updateSurvivors = (survivors) => {
    for(let n=0; n<survivors.length; n++){
      this.updateSurvivor(survivors[n]);
    }
  }

  findAvailableTargets = () => {

    let monster = this.state.monster;

    console.log("finding target. revealed ai card: " +this.state.revealedAI.title);
    if(!this.state.revealedAI.noMove){
      this.setMonsterMoves(this.props.showdown.monster.id);
    }
    GetTargets(this.state.monster.id, this.state.revealedAI.id).then(data => { //returns array of survivors
      this.setState({targets: data});
      if(data.length === 1){
        console.log("single possible target!");
        this.addLogMessage("Single possible target, " +data[0].name, "GAME_INFO");
        if(data[0].priorityTarget){
          data[0].priorityTarget = false; //GAME RULE: Priority target goes away after being targetted
        }
        let selection = this.state.selection;
        selection.monsterTarget = data[0];

        if(MonsterInRange(monster, data[0], this.state.revealedAI.attack)){
          console.log("findAvailableTargets: monster in range");
          this.setState({monsterInRange: true});
        }
        else {
          this.setState({monsterInRange: false});
        }

        this.setState({
          selection: selection,
        });
      }
      else if(data.length > 0){
        console.log("multiple possible targets, choose 1");
        this.addLogMessage(data.length +" possible monster target, select one (click on survivor to select target)", "MONSTER")
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

  turnMonsterToSurvivor = (survivor) => {
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

  attack = (monster, aiCard, survivor) => { //TODO: should probably take multiple survivors as input

    console.log("monster attacking, aiCard=" +aiCard.title +", survivor " +survivor.name)

    if(MonsterInRange(monster, survivor, aiCard.attack) && typeof aiCard !== 'undefined'){
      this.turnMonsterToSurvivor(survivor);

      const diceRolls = GetDiceRolls(1,10, aiCard.attack.speed);
      this.addLogMessage("Rolled " +diceRolls, "GAME_INFO");
      const hits = this.getHits(diceRolls, this.getMonsterToHitValue(monster, aiCard.attack));

      this.addLogMessage("The monster scored " +hits.length +" hits (hitting on " +this.getMonsterToHitValue(monster, aiCard.attack) +"+)", "MONSTER");

      this.deselect();
      this.damageSurvivor(monster, survivor, hits.length, aiCard.attack);
      this.attackFinished(monster);
    }
    else{
      console.log("monster not in range or no AI card revealed, canceling attack");
      this.attackFinished(monster);
    }
  }

  attackFinished = (monster) => {
    console.log("ATTACK FINISHED");

    let action = this.state.action;
    action.selectMonsterTarget = false;
    monster.activatedThisTurn = true;

    this.moveAI();
    this.setState({
      targets: [],
      action: action,
      monsterInRange: false //recheck when new ai is drawn
    });
    this.updateMonster(monster);
  }

  getHits = (diceRoll, toHitValueNeeded) =>{

    let hits = [];
    for(let n=0; n<diceRoll.length; n++){
      if(diceRoll[n] >= toHitValueNeeded){
        hits.push(diceRoll[n]);
      }
    }

    return hits;
  }

  getMonsterToHitValue = (monster, attack) => {
    const toHit = attack.toHitValue + this.getTokenBonus(monster, "ACCURACY");
    if (toHit < 2){
      return 2;
    }
    else if (toHit > 10){
      return 10;
    }
    else return toHit;
  }

  damageSurvivor = (monster, survivor, numHits, attack) => {

    console.log("damageSurvivor: survivor: " +survivor.name +", numHits: " +numHits);
    if(numHits > 0)
    {
      let damage = attack.damage + this.getTokenBonus(monster, "DAMAGE");
      attack.damage = damage;

      if(attack.trigger && attack.trigger.afterHit){
        console.log("triggered afterHit effect");
        this.addTriggerEffect(survivor, attack.triggerEffect);
      }

      if(attack.targetLocation !== null && typeof attack.targetLocation !== 'undefined'){
        this.addLogMessage(survivor.name +" took AIMED damage (damage=" +damage +") at " +attack.targetLocation, "MONSTER")
        for(let i=0; i<numHits; i++)
        {
          this.removeArmourAt(survivor, attack.targetLocation, damage);
        }
      }
      else 
      {
        GetHitlocations(numHits).then(hitLocations => { //Roll to get hitlocations
          this.addLogMessage(survivor.name +" took hits to " +hitLocations +" (damage=" +damage +")", "MONSTER");
        
          this.addLogMessage(survivor.name +" has " +survivor.survival +" survival", "GAME_INFO");
          if(survivor.survival > 0 && !survivor.doomed){
            this.dodgePopUp(hitLocations, survivor, attack); //may remove 1 hit
          }
          else {
            this.removeArmourWrapper(hitLocations, survivor, attack);
          }
      });
      }
    }
  }

  getNegativeTokens = (monster, tokenType) => {
    let counter = 0;
    for(let n=0; n<monster.negativeTokens.length; n++){
      if(monster.negativeTokens[n] === tokenType){
        console.log("-1 " +tokenType +" from token");
        counter++;
      }
    }
    return counter;
  }
  getPositiveTokens = (monster, tokenType) => {
    let counter = 0;
    for(let n=0; n<monster.positiveTokens.length; n++){
      if(monster.positiveTokens[n] === tokenType){
        console.log("+1 " +tokenType +" from token");
        counter++;
      }
    }
    return counter;
  }

  getTokenBonus = (monster, tokenType) => {
    let bonus = 0;
    bonus -= this.getNegativeTokens(monster, tokenType);
    bonus += this.getPositiveTokens(monster, tokenType);
    
    return bonus;
  }

  /*
  Removes armour or damages survivor. Happens after option to dodge.
  */
  removeArmourWrapper = (hitLocations, survivor, attack) => {
    //console.log("removeArmourWrapper! data=" +data +"survivor=" +survivor +"damage=" +damage)
    let damage = attack.damage;
    if(damage < 0){
      damage = 1;
    }
    for(let i=0; i<hitLocations.length; i++)
    {
        this.removeArmourAt(survivor, hitLocations[i], damage);
    }
    if(hitLocations.length > 0 && attack.trigger && attack.trigger.afterDamage){
        this.addTriggerEffect(survivor, attack.triggerEffect, hitLocations);
    }

    console.log("is attack finished now?");
  }

  addTriggerEffect = (survivor, effect, hitLocations) => {
      console.log("adding triggerEffect");
      let monster = this.state.monster;
      let monsterUpdated = false;

      let triggerCondition = true;
      if(typeof effect.condition !== 'undefined' && effect.condition  !== null){
        console.log("condition on effect (implemented?)")
        if(typeof hitLocations !== 'undefined' && hitLocations.length < effect.condition.minHits){
          triggerCondition = false;
          console.log("to few hits for trigger effect to happen");
        }

        if(effect.condition.diceRolld10 !== 0){
          const diceRoll = GetDiceRoll(1,10);
          if(diceRoll < effect.condition.diceRolld10){
            console.log("rolled " +diceRoll +", condition not triggered");
            triggerCondition = false;
          }
          else {
            console.log("rolled " +diceRoll +", condition triggered");
          }
        }

        if(survivor.understanding < effect.minUnderstanding){
          triggerCondition = false;
          console.log("to low understanding to trigger effect");
        }
        else{
          console.log("survivor understanding: " +survivor.understanding +", needed for effect: " +effect.minUnderstanding);
        }
        if(this.getArmourAt(survivor, "BRAIN") < effect.minInsanity ){
          triggerCondition = false;
          console.log("to low insanity to trigger effect");
        }
      }

      if(triggerCondition){
        if(effect.bleed > 0){
          console.log("triggerEffect: bleed " +effect.bleed)
          survivor.bleed += effect.bleed;
          this.addLogMessage(survivor.name +" gets " +effect.bleed +" bleed tokens from trigger effect", "MONSTER");
        }
        if(effect.brainDamage > 0){
          console.log("triggerEffect: brain damage")
          this.removeArmourAt(survivor, "BRAIN", effect.brainDamage);
          this.addLogMessage(survivor.name +" takes " +effect.brainDamage +" brain damage from trigger effect", "MONSTER");
        }
        if(effect.damage > 0){
          console.log("triggerEffect: damage")
          this.addLogMessage(survivor.name +" takes " +effect.damage +" damage from trigger effect", "MONSTER");
          const normalAttack = {
            damage: effect.damage,
            trigger: {}
          }
          this.damageSurvivor(monster, survivor, 1, normalAttack);
        }
        if(effect.survivorKnockDown){
          console.log("triggerEffect: knock down")
          this.addLogMessage(survivor.name +" is knocked down from trigger effect", "MONSTER");
        
          survivor.status = "KNOCKED_DOWN";
          this.updateSurvivor(survivor);
        }
        if(effect.basicAttack){
          console.log("triggerEffect: basic attack");
          console.log("extra damage: " +effect.attackExtraDamage);
          let aiCardBasic = this.state.aiDeck.basicAction;
          aiCardBasic.attack.damage = aiCardBasic.attack.damage + effect.attackExtraDamage;
          this.attack(monster, aiCardBasic, survivor);
        }
        if(effect.priorityToken){
          this.addLogMessage(survivor.name +" gets priority target token!", "MONSTER");
          survivor.priorityTarget = true;
          this.updateSurvivor(survivor);
        }
        if(effect.permanentPriorityToken){
          this.addLogMessage(survivor.name +" gets a permanent priority target token!", "MONSTER");
          survivor.permanentPriorityTarget = true;
          this.updateSurvivor(survivor);
        }
        if(effect.monsterKnockDown){
          this.addLogMessage("The monster is knocked down", "GAME_INFO");
          monster.status = "KNOCKED_DOWN";
          monsterUpdated = true;
        }
        if(effect.monsterDiesNextTurn){
          this.addLogMessage("The monster will die next turn", "GAME_INFO");
          monster.status = "DIES_NEXT_TURN";
          monsterUpdated = true;
        }
        if(effect.survivorGainSurvival > 0){
          survivor.survival +=effect.survivorGainSurvival;
          this.addLogMessage(survivor.name +" gains " +effect.survivorGainSurvival +" survival from effect", "GAME_INFO");
          this.updateSurvivor(survivor);
        }
        if(effect.survivorGainInsanity > 0){
          survivor = this.addArmourAt(survivor, "BRAIN", effect.survivorGainInsanity);
          this.addLogMessage(survivor.name +" gains " +effect.survivorGainInsanity +" insanity from effect", "GAME_INFO");
        }
        if(effect.survivorPositiveToken !== null && typeof effect.survivorPositiveToken !== 'undefined'){
          survivor.positiveTokens.push(effect.survivorPositiveToken);
          this.addLogMessage(survivor.name +" gained +1 " +effect.survivorPositiveToken +" token", "GAME_INFO");
        }
        if(effect.survivorNegativeToken !== null && typeof effect.survivorPositiveToken !== 'undefined'){
          survivor.negativeTokens.push(effect.survivorNegativeToken);
          this.addLogMessage(survivor.name +" gained -1 " +effect.survivorNegativeToken +" token", "GAME_INFO");
        }
        
        if(typeof effect.move !== 'undefined' && effect.move !== null){
          this.addLogMessage("Monster moves " +effect.move.direction, "GAME_INFO");
          
          GetMonsterSpecialMove(this.state.monster.id, effect.move.direction).then(data => {
  
            let action = this.state.action;
            action.monsterMoveSelected = true;
            action.selectedMonsterId = this.state.monster.id;
            let selection = this.state.selection;
            selection.typeSelected = "monster"; 
  
            this.setState({
              monsterMoveHighlights: data,
              action: action,
              selection: selection
            });
  
            if(effect.grab){ //grab = knock down + damage (monster lv) + place in front
              console.log("triggerEffect: grab");
              action.survivorGrabbed = true;
              this.setState({
                action: action,
              });
            }
          })
        }
        else {
          if(effect.grab){ //grab = knock down + damage (monster lv) + place in front
            console.log("triggerEffect: grab")
            this.grabSurvivor(monster, survivor);
          }
        }
  
        if(effect.drawAI > 0){
          console.log("triggerEffect: draw AI")
          this.clickedRevealAI(); //cant draw more than 1 AI right now
        }

        if(monsterUpdated){
          this.updateMonster(monster);
        }
      }//trigger condition
  }

  grabSurvivor = (monster, survivor) => { //grab = knock down + damage(monster level) +in front of monster

    console.log(survivor.name +" has been grabbed")
    this.addLogMessage(survivor.name +" has been grabbed", "SURVIVOR");
    let pos = EmptySpaceInFrontOfMonster(this.state.monster, this.state.survivors);
    if(pos !== null){
      console.log("empty pos from monster: x=" +pos.x +", y=" +pos.y)
      survivor.position.x = pos.x;
      survivor.position.y = pos.y;
      survivor.status = "KNOCKED_DOWN";

      const attack = {
        damage: this.state.monster.level,
        trigger: {}
      }

      this.updateSurvivor(survivor);
      this.damageSurvivor(monster, survivor, 1, attack);
    }
    else{
      console.log("no empty space in front of monster");
    }
  }

  dodgePopUp = (hits, survivor, attack) => {
    const dodge = {
      hits: hits,
      survivor: survivor,
      attack: attack,
      showDodgePopup: true
    }

    this.setState({
      dodge: dodge
    })
  }

  dodgePopUpClosed = (dodgedHit) => {

    let dodge = this.state.dodge;
    let survivor = dodge.survivor;
    
    dodge.showDodgePopup = false;
    if(dodgedHit !== ""){
      this.addLogMessage("Dodged hit to " +dodgedHit, "SURVIVOR");
      survivor.survival--;
    }

    let hits = this.dodge(dodge.hits, dodgedHit);
    
    this.updateSurvivor(survivor);
    this.removeArmourWrapper(hits, survivor, this.state.dodge.attack);

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
              this.addLogMessage("Removing armour at " +hitlocation, "MONSTER");
              survivor.hitlocations[n].hitpoints--;
            }
            else if(!survivor.hitlocations[n].lightInjury){
              this.addLogMessage("Adding light injury to " +hitlocation, "MONSTER");
              survivor.hitlocations[n].lightInjury = true;
            }
            else if(!survivor.hitlocations[n].heavyInjury){
              this.addLogMessage("Adding heavy injury to " +hitlocation +". Knocked down.", "MONSTER");
              survivor.hitlocations[n].heavyInjury = true;
              survivor.status = "KNOCKED_DOWN";
            }
            else {
              damage = 0; //Single roll on injury table
              console.log("query for injury");
              
              GetInjury(hitlocation).then(data => {
                this.addLogMessage("Took severe injury " +data.title, "MONSTER");
                if(data.dead){
                  survivor.status = "DEAD";
                }
                if(data.bleed > 0){
                  this.addLogMessage(survivor.name +" get bleed " +data.bleed, "MONSTER");
                  survivor.bleed = survivor.bleed+data.bleed;
                  if(survivor.bleed > 5){
                    console.log(survivor.name +" bled to death.")
                    survivor.status = "DEAD";
                  }
                }

                if(survivor.status === "DEAD"){
                  this.addLogMessage(survivor.name +" was killed.", "GAME_INFO");
                  this.survivorKilled(survivor);
                }
                else if(data.knockedDown){
                  this.addLogMessage(survivor.name +" was knocked down.", "SURVIVOR");
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

  addArmourAt = (survivor, hitlocation, armour) => {
    for(let n=0; n<survivor.hitlocations.length; n++){
      if(survivor.hitlocations[n].type === hitlocation){
        survivor.hitlocations[n].hitpoints += armour;
        break; //Matching hit location processed
      }
    }
    return survivor;
  }

  getArmourAt = (survivor, hitlocation) => {
    for(let n=0; n<survivor.hitlocations.length; n++){
      if(survivor.hitlocations[n].type === hitlocation){
        return survivor.hitlocations[n].hitpoints;
      }
    }
    return -1;
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
    for(let i=0; i<this.state.survivors.length; i++){
        if(this.state.survivors[i].id === id){
          return this.state.survivors[i];
        } 
    }
    console.log("no survivor with id=" +id +" found");
    return null;
  }

  /*
   Reveals top AI card. State in backend not updated.
  */
  clickedRevealAI = () => {

    let aiDeck = this.state.aiDeck;

    if (this.state.revealedAI === 0){
      if(this.state.aiDeck.cardsInDeck.length === 0 && this.state.aiDeck.cardsInDiscard.length > 0){
        aiDeck = this.shuffleAI(aiDeck);
      }
      if (aiDeck.cardsInDeck.length > 0) {
        //this.printAI(); //debug
        let firstCardIndex = this.getFirstCardIndex(aiDeck.cardsInDeck);
        let aiCard = "";
        if(firstCardIndex !== -1){
          console.log("revealing index " +firstCardIndex);
          aiCard = aiDeck.cardsInDeck[firstCardIndex];
          aiDeck.cardsInDeck.splice(firstCardIndex, 1)
          console.log("revealed card: " +aiCard.title);
          //this.printAI();
        }
        else{
          console.log("ERROR: no card with card order 0 found in aiDeck.cardsInDeck")
          aiCard = aiDeck.cardsInDeck.shift();
        }
        
        this.addLogMessage("** New AI Card revealed: " +aiCard.title, "GAME_INFO");        
        this.setState({
          revealedAI: aiCard,
          aiDeck: aiDeck
        })
      }
      else{ //No AI cards left
        this.addLogMessage("Attacking with basic action");
        this.setState({revealedAI: this.state.aiDeck.basicAction});
      }
    }
    else {
      console.log("ai card already revealed");
    }
  }

  /*
  Order of cards in deck is set by orderInDeck variable, not order in array
  */
  getFirstCardIndex = (deck) => {
    for(let n=0; n<deck.length; n++){
      if(deck[n].orderInDeck === 0){
        return n;
      }
    }
    return -1;
  }

  /*
   Reveals multiple HL cards. State in backend not updated.
  */
  revealHL = (numCards) => {
    if (this.state.revealedHL === 0){
      console.log("no hl card revealed, revealing " +numCards);
      let revealedHL = [];
      let hlDeck = this.state.hlDeck;

      if(numCards > 0){
        for(let n=0; n<numCards; n++){
          if(hlDeck.cardsInDeck.length>0){
            let hlCard =  hlDeck.cardsInDeck.shift();
            revealedHL.push(hlCard);
            this.addLogMessage("HL card revealed: " +hlCard.title, "GAME_INFO");
          }
        }
        let action = this.state.action;
        action.selectHLCard = true;
        this.setState({
          action: action,
          revealedHL: revealedHL,
          hlDeck: hlDeck
        });
      }
    }
    else {
      console.log("ERROR - HL card already revealed ");
    }
  }

  /*
  Adds cards from discard to deck and shuffles deck
  */
  shuffleAI = (aiDeck) => {
    this.addLogMessage("AI deck empty, shuffling", "GAME_INFO");
    while(aiDeck.cardsInDiscard.length>0){
      let aiCard = aiDeck.cardsInDiscard.shift();
      aiDeck.cardsInDeck.push(aiCard);
    }

    //shuffle
    this.shuffle(aiDeck.cardsInDeck); //TODO: verify that reference is passed
    this.setOrderInDeck(aiDeck.cardsInDeck);

    UpdateMonsterAI(this.state.monster.id, aiDeck);

    return aiDeck;
  }

  setOrderInDeck = (deck) => {
    for(let n=0; n<deck.length; n++){
      deck[n].orderInDeck = n;
    }
    return deck;
  }

  shuffleHL = (hlDeck) => {
    let revealedHL = this.state.revealedHL;

    this.addLogMessage("Trap triggered, shuffling HL deck", "GAME_INFO");
    //move cards from discard to deck
    while(hlDeck.cardsInDiscard.length>0){
      let hlCard = hlDeck.cardsInDiscard.shift();
      hlDeck.cardsInDeck.push(hlCard);
    }
    while(revealedHL.length>0){
      let hlCard = revealedHL.shift();
      hlDeck.cardsInDeck.push(hlCard);
    }

    //shuffle
    hlDeck.cardsInDeck = this.shuffle(hlDeck.cardsInDeck);
    hlDeck.cardsInDeck = this.setOrderInDeck(hlDeck.cardsInDeck);

    UpdateMonsterHL(this.state.monster.id, hlDeck);

    return hlDeck;
  }

  shuffle = (array) => {
    console.log("shuffling array");
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
      [array[i], array[j]] = [array[j], array[i]]; // swap elements
    }
    return array;
  }

  /*
    Moves revealed AI card to discard
  */
  moveAI = () => {
    
    let aiDeck = this.state.aiDeck;
    if(this.state.revealedAI.title !== 'Basic Action' && this.state.revealedAI !== 0){
      aiDeck.cardsInDiscard.push(this.state.revealedAI);
      console.log("moving monster AI, title= " +this.state.revealedAI.title);
      UpdateMonsterAI(this.state.monster.id, aiDeck);
    }
    else{
      console.log("basic action resolved");
    }
    
    this.setState({
      revealedAI: 0,
      aiDeck: aiDeck
    });
  }

  removeAICard = (numWounds) => {
    alert("You scored a wound!");
    this.addLogMessage("Removing " +numWounds +" wounds from monster, " +this.state.monster.aiDeck.cardsInDeck+this.state.monster.aiDeck.cardsInDiscard+1 +" wounds remaining", "GAME_INFO");
    let aiDeck = this.state.aiDeck;
    let updated = false;
    
    while(numWounds > 0){
      updated = true;
      if(aiDeck.cardsInDeck.length > 0){
        aiDeck.cardsRemoved.push(aiDeck.cardsInDeck.shift());
      }
      else if (aiDeck.cardsInDiscard.length > 0){
        aiDeck = this.shuffleAI(aiDeck);
        aiDeck.cardsRemoved.push(aiDeck.cardsInDeck.shift());
      }
      else {
        this.gameWon();
      }
      numWounds--;
    }

    if(updated){
      UpdateMonsterAI(this.state.monster.id, aiDeck);
    }
    this.setState({aiDeck: aiDeck});
  }

  /*
  Discards a HLcard after wound attempt, then shows the HLSelecter if cards remaining
  */
  discardHLCard = (hlCard) => {
    if(!this.state.action.monsterMoveSelected){
      this.moveHLCard(hlCard, "REVEALED", "DISCARD"); 
    }
    else {
      console.log("UNABLE TO DISCARD HL CARD; WAITING FOR PLAYER INPUT");
    }
  }

  discardRevealedHLCards = () => {
    let revealedHL = this.state.revealedHL;
    for(let n=0; n<revealedHL.length; n++){
      this.moveHLCard(revealedHL[n], "REVEALED", "DISCARD");
    }
  }

  /*
  Persistant injuries are placed in 'removed' pile
  */
  removeHLCard = (hlCard) => {
    this.moveHLCard(hlCard, "REVEALED", "REMOVED");
  }

  /*
  Removes hlCard from source, then adds it to destination
  */
  moveHLCard = (hlCard, source, destination) => {

    console.log("moving hl card: " +hlCard.title +" to " +destination +" from " +source);
    
    let hlDeck = this.state.hlDeck;
    let revealedHL = this.state.revealedHL;

    if(source === "REVEALED"){
      for(let n=0; n<revealedHL.length; n++){
        if(revealedHL[n].title === hlCard.title){
          console.log("removing index " +n +", title=" +revealedHL[n].title +" from revealed cards");
          revealedHL.splice(n, 1);
          break;
        }
      }
    }
    else if(source === "DRAW"){
      for(let n=0; n<hlDeck.cardsInDeck.length; n++){
        if(hlDeck.cardsInDeck[n].title === hlCard.title){
          console.log("removing index " +n +", title=" +hlDeck.cardsInDeck[n].title +" from cards in deck");
          hlDeck.cardsInDeck.splice(n, 1);
          break;
        }
      }
    }
    else if(source === "DISCARD"){
      for(let n=0; n<hlDeck.cardsInDiscard.length; n++){
        if(hlDeck.cardsInDiscard[n].title === hlCard.title){
          console.log("removing index " +n +", title=" +hlDeck.cardsInDiscard[n].title +" from cards in discard");
          hlDeck.cardsInDiscard.splice(n, 1);
          break;
        }
      }
    }
    else if(source === "REMOVED"){
      for(let n=0; n<hlDeck.cardsRemoved.length; n++){
        if(hlDeck.cardsRemoved[n].title === hlCard.title){
          console.log("removing index " +n +", title=" +hlDeck.cardsRemoved[n].title +" from removed cards");
          hlDeck.cardsRemoved.splice(n, 1);
          break;
        }
      }
    }
    else {
      console.log("ERROR: unknow source " +source);
    }
    

    if(destination === "DISCARD"){
      console.log("adding " +hlCard.title +" to discard pile");
      hlDeck.cardsInDiscard.unshift(hlCard);
    }
    else if(destination === "REMOVE"){
      console.log("adding " +hlCard.title +" to removed pile");
      hlDeck.cardsRemoved.unshift(hlCard);
    }
    else if(destination === "DRAW"){
      console.log("adding " +hlCard.title +" to draw pile");
      hlDeck.cardsInDeck.unshift(hlCard);
    }
    else if(destination === "REVEALED"){
      console.log("adding " +hlCard.title +" to revealed cards");
      revealedHL.unshift(hlCard);
    }
    else {
      console.log("ERROR: unknow destination " +destination);
    }

    console.log("revealed hl cards length: " +revealedHL.length);
    let action = this.state.action;
    if(revealedHL === 0 || revealedHL.length === 0){
      action.selectHLCard = false;
      revealedHL = 0; 
    }
    else {
      action.selectHLCard = true;
    }

    UpdateMonsterHL(this.state.monster.id, hlDeck);
    this.setState({
      revealedHL: revealedHL,
      hlDeck: hlDeck,
      action: action,
      hlCard: 0
    });
  }

  gameWon = () => {
    console.log("The monster is dead! You win!");

    let showdown = this.props.showdown;
    showdown.gameStatus = "WIN";

    this.addLogMessage("The monster is dead! You win!", "GAME_INFO");
    this.props.updateShowdown(showdown);
  }

  showGearGrid = () => {
    
    let popUp = this.state.popUp;
    popUp.showGearGrid = !popUp.showGearGrid; //toggle on/off
    
    this.setState({popUp: popUp});
  }

  hideGearGrid = () => {
    let popUp = this.state.popUp;
    popUp.showGearGrid = false;
    
    this.setState({popUp: popUp});
  }

  selectGear = (gear, attackProfileIndex) => {
    let selection = this.state.selection;
    let survivor = this.state.survivor;
    let survivorId = survivor.id;

    for(let n=0; n<selection.equipedGear.length; n++){
      if(selection.equipedGear[n].survivorId === survivorId){
        selection.equipedGear[n].gear = gear;
        if(attackProfileIndex !== -1){
          selection.equipedGear[n].attackProfileIndex = attackProfileIndex;
        }
      }
    }

    this.setState({selection: selection});

    if(attackProfileIndex !== -1){
      this.addLogMessage("Using ability " +gear.attackProfiles[attackProfileIndex].useName +" for " +this.state.survivor.name, "GAME_INFO")
      this.activateSurvivor(survivor);
    }
    else {
      this.addLogMessage("Set " +gear.name +" as weapon for " +this.state.survivor.name, "GAME_INFO")
    }
    this.hideGearGrid(); //hide grid
  }

  specialUseGear = (gear, attackProfileIndex) => {
    console.log("special use, gear: " +gear.name +", index= " +attackProfileIndex)
    this.selectGear(gear, attackProfileIndex)
  }

  //DEBUG FUNCTION
  printAI = () => {
    console.log("printing ai deck");
    for(let i=0; i<this.state.aiDeck.cardsInDeck.length; i++){
      console.log("cards in deck: " +this.state.aiDeck.cardsInDeck[i].title);
    }
    for(let i=0; i<this.state.aiDeck.cardsInDiscard.length; i++){
      console.log("cards in discard: " +this.state.aiDeck.cardsInDiscard[i].title);
    }
    for(let i=0; i<this.state.aiDeck.cardsRemoved.length; i++){
      console.log("cards removed: " +this.state.aiDeck.cardsRemoved[i].title);
    }
  }

  //DEBUG FUNCTION
  printHL = () => {
    console.log("printing hl deck, " +this.state.hlDeck.cardsInDeck.length +" in deck, " +this.state.hlDeck.cardsInDiscard.length +" in discard, " +this.state.hlDeck.cardsRemoved.length +" removed, " +this.state.revealedHL.length +" revealed.");
    for(let i=0; i<this.state.hlDeck.cardsInDeck.length; i++){
      console.log("cards in deck: " +this.state.hlDeck.cardsInDeck[i].title);
    }
    for(let i=0; i<this.state.hlDeck.cardsInDiscard.length; i++){
      console.log("cards in discard: " +this.state.hlDeck.cardsInDiscard[i].title);
    }
    for(let i=0; i<this.state.hlDeck.cardsRemoved.length; i++){
      console.log("cards removed: " +this.state.hlDeck.cardsRemoved[i].title);
    }
    for(let i=0; i<this.state.revealedHL.length; i++){
      console.log("cards revealed: " +this.state.revealedHL[i].title);
    }
  }

  toggleHLSelecter = () => {
    let action = this.state.action;
    action.selectHLCard = !action.selectHLCard;
    this.setState({action: action})
  }

  setHLCardFirstInDeck = (card) => {
    console.log("clicked " +card.title); //TODO: change deck order of card to 0

    this.moveHLCard(card, "DRAW", "DRAW");
    
  }

  render() {

    //console.log("rendering GameBoard.js, gear in grid: " +this.state.survivor.gearGrid.gear.length);

    //general
    const size = 40;
    const width_tiles = 22; //22
    const height_tiles = 16; //16
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
    let survivors = this.state.survivors;

    monster = this.state.monster;

    monsterPosX = monster.position.x;
    monsterPosY = monster.position.y;
    monsterWidth = monster.statline.width;
    monsterHeight = monster.statline.height;
    monsterFacing = monster.facing;
    monsterId = monster.id;

    return (
      <div>

        <ReactTooltip />
        <TurnChanger hlCards={this.state.revealedHL} selectHLCard={this.state.action.selectHLCard} activatedThisTurn={this.state.monster.activatedThisTurn} revealAI={this.clickedRevealAI} nextAct={this.nextAct} act={this.props.showdown.act}/>
        
        <div className="gameboard-normal">
          <TileRenderer monsterMoves={this.state.monsterMoves} targets={this.state.targets} tileSizeX={size} tileSizeY={size} topOffset={topOffset} leftOffset={leftOffset} click={this.click} monsterMoveHighlights={this.state.monsterMoveHighlights} highlights={highlights} markedX={this.state.selection.markedX} markedY={this.state.selection.markedY} width_tiles={width_tiles} height_tiles={height_tiles} />
          <MonsterTile deHoverMonster={this.deHoverMonster} hoverMonster={this.hoverMonster} tileSize={size} topOffset={topOffset} leftOffset={leftOffset} click={this.click} facing={monsterFacing} selectedMonster={this.state.selection.selectedMonsterId} positionX={monsterPosX} positionY={monsterPosY} height={monsterHeight} width={monsterWidth} id={monsterId} gameStatus={gameStatus}/>
          <SurvivorTiles deHoverSurvivor={this.deHoverSurvivor} hoverSurvivor={this.hoverSurvivor} tileSize={size} topOffset={topOffset} leftOffset={leftOffset} click={this.click} selectedSurvivorId={this.state.selection.selectedSurvivorId} survivors={survivors} />
        </div>
        
        <InfoBox hover={this.state.selection.typeHover} survivor={this.state.selection.hoverSurvivor} weapon={this.state.selection.hoverGear} monster={monster} hlDeck={this.state.hlDeck} aiDeck={this.state.aiDeck} left={this.state.selection.hover_x} top={this.state.selection.hover_y} />
        
        <ActionBox act={this.props.showdown.act} showGearGrid={this.showGearGrid} moveSelected={this.state.action.moveSelected} survivor={this.state.survivor} aiCard={this.state.revealedAI} selection={this.state.selection.typeSelected} survivorMove={this.clickedSurvivorMove} activate={this.clickedActivate} changeFacing={this.changeFacing} />
        <Gamelog log={this.state.log}/>
        {this.state.popUp.showGearGrid ?  <GearGrid specialUseGear={this.specialUseGear.bind(this)} selectGear={this.selectGear.bind(this)} survivor={this.state.survivor} showGearGrid={this.showGearGrid} act={this.props.showdown.act}/>: null }
        {this.state.revealedAI !== 0 ? <AICard aiCard={this.state.revealedAI} monsterInRange={this.state.monsterInRange} monsterMoveSelected={this.state.action.monsterMoveSelected} target={this.findAvailableTargets} targets={this.state.targets} attack={this.clickedAttack}  monsterMove={this.clickedMonsterMove}/> : null }
        {this.state.dodge.showDodgePopup ? <DodgeSelecter hits={this.state.dodge.hits} dodgeHits={this.dodgePopUpClosed.bind(this)} /> : null}
        {this.state.action.selectHLCard ? <HLSelecter hlCards={this.state.revealedHL} woundLocation={this.woundLocation} /> : null}
        
        {this.props.showHLCards ? <AllHLCards clickedCard={this.setHLCardFirstInDeck.bind(this)} hlCards = {this.state.hlDeck.cardsInDeck}/> : null }
      </div>
    )
  }
}