import React, { Component } from 'react';
import './App.css';
import TileRenderer from './TileRenderer';
import MonsterTile from './MonsterTile';
import SurvivorTiles from './SurvivorTiles';
import InfoBox from './InfoBox';
import ActionBox from './ActionBox';
import DodgeSelecter from './DodgeSelecter'
import HLSelecter from './HLSelecter'
import Gamelog from './Gamelog';
import AICard from './AICard';

import { UpdateSurvivor, DeleteSurvivor, GetHitlocations, GetSurvivorMoves, GetInjury} from './RestServices/Survivor';
import { UpdateMonster , UpdateMonsterAI, UpdateMonsterHL, GetTargets, GetMonsterMoves, GetMonsterSpecialMove } from './RestServices/Monster';
import { GetHits , GetDiceRoll} from './RestServices/Dice'
import { PositionsEqual, EmptySpaceInFrontOfMonster } from './Functions/HelperFunctions'


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
        typeSelected: "",
        typeHover: "",
        monsterTarget: -1
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
      survivor: {},
      survivors: this.props.showdown.survivors,
      monster: this.props.showdown.monster,
      aiDeck: this.props.showdown.monster.aiDeck,
      hlDeck: this.props.showdown.monster.hlDeck,
      highlights: [],
      
      selectedWeapon: 2, //index in gear grid
      targets: [],
      revealedAI: 0,
      revealedHL: 0,
      log: [{message: "New game started (id=" +this.props.showdown.id +")"}]
    }
  }

  componentDidMount(){
    document.addEventListener("keydown", this.keyFunction, false);
    document.addEventListener("keyup", this.keyUpFunction, false);
  }
  componentWillUnmount(){
    document.removeEventListener("keydown", this.keyFunction, false);
    document.removeEventListener("keyup", this.keyUpFunction, false);
  }

  componentWillReceiveProps(){
    console.log("receiving new props!");
    console.log("showdown id: " +this.props.showdown.id);
  }

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
   else if(event.keyCode===37){ //left
    if(this.state.action.monsterMoveSelected){
        let monster = this.state.monster;
        if(!this.state.keyDown.shift){
          monster.position.x--;
        }
        monster.facing = "LEFT";
        this.setState({monster: monster});
    }
   }
   else if(event.keyCode===38){ //up
    if(this.state.action.monsterMoveSelected){
      let monster = this.state.monster;
      if(!this.state.keyDown.shift){
        monster.position.y--;
      }
      monster.facing = "UP";
      this.setState({monster: monster});
    }
   }
   else if(event.keyCode===39){ //right
    if(this.state.action.monsterMoveSelected){
      let monster = this.state.monster;
      monster.facing = "RIGHT";
      if(!this.state.keyDown.shift){
        monster.position.x++;
      }
      this.setState({monster: monster});
    }
   }
   else if(event.keyCode===40){ //down
    if(this.state.action.monsterMoveSelected){
      let monster = this.state.monster;
      if(!this.state.keyDown.shift){
        monster.position.y++;
      }
      monster.facing = "DOWN";
      this.setState({monster: monster});
    }
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

 hoverMonster = () => {
   let selection = this.state.selection;
   selection.typeHover = "monster";
   this.setState({selection: selection});
 }
 hoverSurvivor = (id) => {
  let selection = this.state.selection;
  selection.typeHover = "survivor";
  selection.hoverSurvivor = this.getSurvivorById(id);
  this.setState({selection: selection});
}
deHoverSurvivor = (id) => {
 let selection = this.state.selection;
 selection.typeHover = "";
 this.setState({selection: selection});
}
deHoverMonster = () => {
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
          selection.monsterTarget = this.getSurvivorById(id);
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

 selectBoard = (x,y) => {
  if (x === this.state.selection.markedX && y === this.state.selection.markedY) { //deselect if click same tile twice
    this.deselect();
  }
  else {
    if (this.state.action.moveSelected === true) {         //MOVEMENT
      if (this.validMove(x, y)) {
        if (this.state.selection.typeSelected === "survivor") {  //MOVE SURVIVOR
          let survivor = this.state.survivor;
          survivor.position.x = x;
          survivor.position.y = y;
          survivor.movesLeft = 0;
          this.addLogMessage("** Moving " +survivor.name +" to (" +x +"," +y +")");

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
          console.log("moving monster!");
          let monster = this.state.monster;
          let survivors = this.state.survivors;

          let counter = 0;
          while(monster.position.x !== x || monster.position.y !== y){

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

            /*
            All survivors passed over are knocked down
            */
            const collisions = this.monsterOnSurvivor(monster, survivors);
            for(let n=0; n<collisions.length; n++)
            {
              let survivor_n = this.getSurvivorById(collisions[n]);
              survivor_n.status = "KNOCKED_DOWN";
              console.log("set knock down for " +survivor_n.name);

              this.updateSurvivor(survivor_n);
            }

            counter++;
          }

          /*
          All survivors under monster gets knockback
          */
           const collisions = this.monsterOnSurvivor(monster, survivors);
           for(let n=0; n<collisions.length; n++)
           {
             let survivor_n = this.getSurvivorById(collisions[n]);
             survivor_n.status = "KNOCKED_DOWN";
             console.log("set knock down for " +survivor_n.name);

             survivor_n = this.addKnockback(survivor_n, 6);
             this.updateSurvivor(survivor_n);
           }


          //monster.position.x = x;
          //monster.position.y = y;
          monster.activatedThisTurn = true;
          
          let selection = this.state.selection;
          selection.selectedMonsterId = -1;

          this.setState({
            monster: monster,
            selection: selection,
            highlights: []
          })
          this.updateMonster(this.state.monster);

          if(this.state.action.survivorGrabbed){
              console.log("waiting for grab, placing survivor")
              let action = this.state.action;
              action.survivorGrabbed = false;

              if(this.state.selection.monsterTarget !== -1 && typeof this.state.selection.monsterTarget !== 'undefined'){
                this.grabSurvivor(this.state.selection.monsterTarget);
              }
              else{
                console.log("ERROR: Monster target not set")
              }

              this.setState({
                action: action
              })
          }
        }
        let action = this.state.action;
        action.moveSelected = false;
        this.setState({ action: action })
      }
      else {
        console.log("Invalid move selected");
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

    //let action = this.state.action;
    //action.moveSelected = false;
    //this.setState({ action: action })
  }

  if(this.state.revealedHL !== 0 && this.state.revealedHL.length > 0){
    let action = this.state.action;
    action.selectHLCard = true;
    this.setState({action: action});
  }
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

 /*
 Returns array with id of survivors collided with
 */
 monsterOnSurvivor = (monster, survivors) => {

  let collisions = []
  let baseCoordinates = this.getBaseCoordinates(monster.position);
  //this.printBaseCoordinates(baseCoordinates);

  for(let n=0; n<baseCoordinates.length; n++){
    for(let m=0; m<survivors.length; m++){
      if(survivors[m].position.x === baseCoordinates[n].x && survivors[m].position.y === baseCoordinates[n].y){
          console.log("collision in (" +survivors[m].position.x +"," +survivors[m].position.y+")")
          collisions.push(survivors[m].id);
        }
    }
  }
  return collisions; 
 }

 printBaseCoordinates = (base) => {
   for(let m=0; m<base.length; m++){
      console.log("BASE (" +base[m].x +","  +base[m].y +")");
    }
 }

 getBaseCoordinates(position){
  let baseCoordinates = [];
  let x = position.x;
  let y = position.y;

  for(let i=0;i<this.state.monster.statline.width; i++){
      for(let j=0;j<this.state.monster.statline.height; j++){
          baseCoordinates.push({x: x+i, y: y+j});
      }
  }
  return baseCoordinates;
}

 /*
  * Handles a click on the board
  */
  click = (props) => {

    if (typeof this.state.monster.id === 'undefined') {
      console.log("DEPRECATED: setting monster in props, remove!")
      this.setState({ monster: this.props.showdown.monster })
    }

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
      this.selectBoard(x, y);
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
    console.log("monster move: " +action.monsterMoveSelected);
    this.setState({
      action: action
    })
  }

  clickedActivate = () => {
    this.activateSurvivor(this.state.survivor);
  }

  activateSurvivor = (survivor) => {
    let inRange = this.survivorInRange(survivor);
    this.addLogMessage("** " +survivor.name +" activated", "SURVIVOR");

    if(inRange){
      survivor.activationsLeft = survivor.activationsLeft -1;
      this.updateSurvivor(survivor);

      GetHits(this.getSpeed(), this.getToHitValue()).then(data => {
        //const numHits = data.length;
        const numHits = 2; //TODO - for testing, remove
        this.addLogMessage(survivor.name +" scored " +numHits +" hits", "SURVIVOR");

        //Reveal HitLocations
        this.revealHL(numHits);
      })
    }
    else{
      console.log("survivor not in range")
    }
  }

  addLogMessage = (newMessage, type) => {
    let log = this.state.log;
    log.push({message: newMessage, type: type}); //unshift to add to front of array
    this.setState({log: log});
  }

  successfulWound = (diceRoll) => {
    const sucessValue = this.toWoundValue();
    //console.log("roll: " +diceRoll[0].result);

    if(diceRoll[0].result >= sucessValue){
      this.addLogMessage("Rolled " +diceRoll[0].result +", success", "SURVIVOR");
      return true;
    }
    else {
      this.addLogMessage("Rolled " +diceRoll[0].result +", no wound scored", "SURVIVOR");
      return false;
    }
  }

  woundLocation = (hlCard) => {

    let action = this.state.action;
    action.selectHLCard = false;
    this.setState({action: action}); //Temporary hide HL card popup to show game
    
    this.addLogMessage("Attempting to wound " +hlCard.title, "SURVIVOR");
    let survivor = this.state.survivor;

    if(hlCard.trap){
      this.resolveTrap(hlCard);
    }
    else if(!this.survivorInRange(survivor)){
      this.addLogMessage("Survivor out of range, cancelling hit", "GAME_INFO");
      this.discardHLCard(hlCard);
    }
    else {
      GetDiceRoll(1).then(data => {
        
        let scoredWound = this.successfulWound(data);

        let critScored = false;
        if(data.result === 10){
          this.addLogMessage("Crit rolled", "SURVIVOR")
          critScored = true;
        }
        
        let effectTriggered = false;
        this.addLogMessage("Impervious: " +hlCard.impervious, "DEBUG");

        if(scoredWound && !hlCard.impervious){
          let monster = this.state.monster;
          monster.lastWoundedBy = survivor.id;
  
          this.updateMonster(monster);
          this.removeAICard(1);
  
          if(hlCard.woundEffect){
            effectTriggered = true;
          }
        }
        else{
          if(hlCard.impervious){
            this.addLogMessage("Hit location is impervious, unable to wound", "GAME_INFO");
          }
          if(hlCard.failureEffect){
            effectTriggered = true;
          }
        }
        if(hlCard.reflexEffect || effectTriggered){
          //this.performEffect(hlCard.effect);
          this.addTriggerEffect(survivor, hlCard.effect)
        }
  
        if(critScored && hlCard.crit){
          this.setPersistantInjury(hlCard);
        }
        else{
          this.discardHLCard(hlCard);
        }
      })
    }
  }

  resolveTrap = (trapCard) => {
    this.addLogMessage("Resolving trap", "GAME_INFO");

    let survivor = this.state.survivor;
    let hlDeck = this.state.hlDeck;

    survivor.doomed = true;
    this.attack(this.state.aiDeck.basicAction, survivor);

    hlDeck = this.shuffleHL(hlDeck);
    let action = this.state.action;
    action.selectHLCard = false;
    this.setState({
      action: action,
      hlDeck: hlDeck,
      revealedHL: 0});
  }

  setPersistantInjury = (hlCard) => {
    console.log("setting persistant injury (no implementation yet)")
  }

  /*
  performEffect = (efffect) => {
    console.log("effect triggered! (no implementation yet)")
  }
  */

  getSpeed = () => {
    return this.getSelectedWeapon().speed;
  }

  getToHitValue = () => {
    const toHitValue = this.getSelectedWeapon().toHitValue;
    return Math.max(this.inBlindSpot(this.state.survivor) ? toHitValue-1 : toHitValue, 2);
  }

  inBlindSpot = (survivor) => {
    for(let i=0; i<this.state.monster.blindspot.length; i++) {
      if(PositionsEqual(survivor.position, this.state.monster.blindspot[i])){
        return true;
      }
    }
    return false;
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

  survivorInRange = (survivor) => {
    let inRange = false;
    for(let i=0; i<this.state.monster.baseCoordinates.length; i++){
      if (this.adjacent(survivor.position, this.state.monster.baseCoordinates[i])) {
        inRange = true;
        break;
      }
    }
    return inRange;
  }

  monsterInRange = (survivor, attack) => {
    let inRange = false;
    for(let i=0; i<this.state.monster.baseCoordinates.length; i++){
      if (this.adjacent(survivor.position, this.state.monster.baseCoordinates[i])) {
        inRange = true;
        break;
      }
    }
    if(attack.reach === -1){
      inRange = true;
    }
    return inRange;
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

  nextAct = (e) => {
    let showdown = this.props.showdown;
    let survivors = this.state.survivors;

    if(showdown.act === "MONSTERS"){
      showdown.act = "SURVIVORS";

      for (let n = 0; n < survivors.length; n++) {
        if(survivors[n].status === "KNOCKED_DOWN"){
          this.addLogMessage(survivors[n].name +" stands up", "GAME_INFO");
          survivors[n].status = "STANDING"; //TODO: actually only applies to survivors knocked down last act
        }
      }
      this.updateSurvivors(survivors);
    }
    else{
      showdown.act = "MONSTERS";
      showdown.turn = showdown.turn + 1;

      for (let n = 0; n < survivors.length; n++) {
        survivors[n].movesLeft = 1;
        survivors[n].activationsLeft = 1;
      }
      this.updateSurvivors(survivors);
    }
    this.addLogMessage("------------------------", "GAME_INFO");
    this.addLogMessage("** Proceeding to " +showdown.act +" act **", "GAME_INFO");
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
        this.updateSurvivorInState(survivor);
      });
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

  target = () => {
    console.log("finding target. revealed ai card: " +this.state.revealedAI.title);
    if(!this.state.revealedAI.noMove){
      this.setMonsterMoves(this.props.showdown.monster.id);
    }
    GetTargets(this.state.monster.id, this.state.revealedAI.id).then(data => {
      this.setState({targets: data});
      if(data.length === 1){
        console.log("single possible target!");
        let selection = this.state.selection;
        selection.monsterTarget = data[0];
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

  attack = (aiCard, survivor) => {

    console.log("monster attacking, aiCard=" +aiCard.title +", survivor " +survivor.name)

    if(this.monsterInRange(survivor, aiCard.attack) && typeof aiCard !== 'undefined'){
      this.turnMonsterToSurvivor(survivor);

      GetHits(aiCard.attack.speed, aiCard.attack.toHitValue).then(data => {
        console.log("hits: " +data.length);
        this.addLogMessage("The monster scored " +data.length +" hits", "MONSTER");
        const numHits = data.length;

        let action = this.state.action;
        action.selectMonsterTarget = false;
        this.deselect();
        this.damageSurvivor(survivor, numHits, aiCard.attack);

        this.moveAI();
        this.setState({
          targets: [],
          action: action
        });
      });
    }
    else{
      console.log("monster not in range or no AI card revealed, canceling attack");
      this.moveAI();
      this.setState({
        targets: [],
      });
    }

  }

  clickedAttack = () => {
    let aiCard = this.state.revealedAI;
    let survivor = this.state.selection.monsterTarget;
    console.log("monster attacking, fetching aiCard=" +aiCard.title +" from state");
    this.attack(aiCard, survivor);
  }

  damageSurvivor = (survivor, numHits, attack) => {

    if(numHits > 0)
    {
      let damage = attack.damage;

      if(attack.trigger && attack.trigger.afterHit){
        console.log("triggered afterHit effect");
        this.addTriggerEffect(survivor, attack.cardEffect);
      }

      if(attack.targetLocation !== null && typeof attack.targetLocation !== 'undefined'){
        this.addLogMessage(survivor.name +" took AIMED damage (damage=" +damage +") at " +attack.targetLocation, "SURVIVOR")
        for(let i=0; i<numHits; i++)
        {
          this.removeArmourAt(survivor, attack.targetLocation, damage);
        }
      }
      else 
      {
        GetHitlocations(numHits).then(hitLocations => {
          this.addLogMessage(survivor.name +" took hits to " +hitLocations +" (damage=" +damage +")", "SURVIVOR");
        
          this.addLogMessage(survivor.name +" has " +survivor.survival +" survival", "DEBUG");
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

  /*
  Removes armour or damages survivor. Happens after option to dodge.
  */
  removeArmourWrapper = (hitLocations, survivor, attack) => {
    //console.log("removeArmourWrapper! data=" +data +"survivor=" +survivor +"damage=" +damage)
    const damage = attack.damage;
    for(let i=0; i<hitLocations.length; i++)
    {
        this.removeArmourAt(survivor, hitLocations[i], damage);
    }
    if(hitLocations.length > 0 && attack.trigger && attack.trigger.afterDamage){
        this.addTriggerEffect(survivor, attack.triggerEffect, hitLocations);
    }
  }

  addTriggerEffect = (survivor, effect, hitLocations) => {
      console.log("adding triggerEffect")

      let triggerCondition = true;
      if(effect.condition  !== null){
        console.log("condition on effect (implemented?)")
        if(effect.condition.minHits < hitLocations.length){
          triggerCondition = false;
          console.log("to few hits for trigger effect to happen");
        }
      }

      if(triggerCondition){
        if(effect.bleed > 0){
          console.log("triggerEffect: bleed " +effect.bleed)
          survivor.bleed += effect.bleed;
        }
        if(effect.brainDamage > 0){
          console.log("triggerEffect: brain damage")
          this.removeArmourAt(survivor, "BRAIN", effect.brainDamage);
        }
        if(effect.damage > 0){
          console.log("triggerEffect: damage")
          const normalAttack = {
            damage: effect.damage,
            trigger: {}
          }
          this.damageSurvivor(survivor, 1, normalAttack);
        }
        if(effect.knockDown){
          console.log("triggerEffect: knock down")
          survivor.status = "KNOCKED_DOWN";
          this.updateSurvivor(survivor);
        }
        
        if(typeof effect.move !== 'undefined' && effect.move !== null){
          console.log("triggerEffect: move")
          console.log("triggerEffect: move direction=" +effect.move.direction)
  
          this.addLogMessage("Monster moves " +effect.move.direction);
          
          GetMonsterSpecialMove(this.state.monster.id, effect.move.direction).then(data => {
  
            let action = this.state.action;
            action.moveSelected = true;
            action.selectedMonsterId = this.state.monster.id;
            let selection = this.state.selection;
            selection.typeSelected = "monster"; 
  
            this.setState({
              highlights: data,
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
            this.grabSurvivor(survivor);
          }
        }
  
        if(effect.drawAI > 0){
          this.clickedRevealAI(); //cant draw more than 1 AI right now
        }
      }
  }

  grabSurvivor = (survivor) => { //grab = knock down + damage(monster level) +in front of monster

    console.log(survivor.name +" has been grabbed")
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
      this.damageSurvivor(survivor, 1, attack);
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
    dodge.showDodgePopup = false;
    if(dodgedHit !== ""){
      this.addLogMessage("Dodged hit to " +dodgedHit, "SURVIVOR");
    }

    let hits = this.dodge(dodge.hits, dodgedHit);
   
    let survivor = dodge.survivor;
    survivor.survival--;
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
              this.addLogMessage("Removing armour at " +hitlocation, "SURVIVOR");
              survivor.hitlocations[n].hitpoints--;
            }
            else if(!survivor.hitlocations[n].lightInjury){
              this.addLogMessage("Adding light injury to " +hitlocation, "SURVIVOR");
              survivor.hitlocations[n].lightInjury = true;
            }
            else if(!survivor.hitlocations[n].heavyInjury){
              this.addLogMessage("Adding heavy injury to " +hitlocation +". Knocked down.", "SURVIVOR");
              survivor.hitlocations[n].heavyInjury = true;
              survivor.status = "KNOCKED_DOWN";
            }
            else {
              damage = 0; //Single roll on injury table
              console.log("query for injury");
              
              GetInjury(hitlocation).then(data => {
                this.addLogMessage("Took severe injury " +data.title, "SURVIVOR");
                if(data.dead){
                  survivor.status = "DEAD";
                }
                if(data.bleed > 0){
                  this.addLogMessage(survivor.name +" get bleed " +data.bleed, "SURVIVOR");
                  survivor.bleed = survivor.bleed+data.bleed;
                  if(survivor.bleed > 5){
                    console.log(survivor.name +" bled to death.")
                    survivor.status = "DEAD";
                  }
                }

                if(survivor.status === "DEAD"){
                  this.addLogMessage(survivor.name +" was killed.", "SURVIVOR");
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
        let aiCard = aiDeck.cardsInDeck.shift(); 

        this.addLogMessage("** New AI Card revealed: " +aiCard.title, "GAME_INFO");
        this.setState({
          revealedAI: aiCard,
          aiDeck: aiDeck
        })
      }
      else{
        this.addLogMessage("Attacking with basic action");
        this.setState({revealedAI: this.state.aiDeck.basicAction});
      }
    }
    else {
      console.log("ai card already revealed");
    }
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

    if(hlDeck.cardsInDeck.length !== 8){
      console.log("ERROR - UNEXPEXTED HL DECK LENGTH")
    }
    else {
      UpdateMonsterHL(this.state.monster.id, hlDeck);
    }

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
    this.addLogMessage("Removing " +numWounds +" wounds from monster", "GAME_INFO");
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

  discardHLCard = (hlCard) => {
    console.log("discard hl card: " +hlCard.title);
    
    let hlDeck = this.state.hlDeck;
    let revealedHL = this.state.revealedHL;

    //console.log("cards in revealed hl: " +revealedHL.length);
    for(let n=0; n<revealedHL.length; n++){
      if(revealedHL[n].title === hlCard.title){
        console.log("removing index " +n +", title=" +revealedHL[n].title);
        revealedHL.splice(n, 1);
        break;
      }
    }
    //console.log("cards in revealed hl : " +revealedHL.length);

    hlDeck.cardsInDiscard.push(hlCard);

    let action = this.state.action;
    if(revealedHL.length === 0){
      action.selectHLCard = false;
      revealedHL = 0; 
    }
    UpdateMonsterHL(this.state.monster.id, hlDeck);
    this.setState({
      revealedHL: revealedHL,
      hlDeck: hlDeck,
      action: action
    });
  }

  gameWon = () => {
    console.log("The monster is dead! You win!");

    let showdown = this.props.showdown;
    showdown.gameStatus = "WIN";

    this.props.updateShowdown(showdown);
  }

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

  render() {

    //console.log("rendering GameBoard.js");

    //general
    const size = 40;
    const width_tiles = 22; //22
    const height_tiles = 18; //18
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
      if(this.state.survivors.length === 0){
        survivors = this.props.showdown.survivors;
      }
      else{
        survivors = this.state.survivors;
      }

      monsterPosX = monster.position.x;
      monsterPosY = monster.position.y;
      monsterWidth = monster.statline.width;
      monsterHeight = monster.statline.height;
      monsterFacing = monster.facing;
      monsterId = monster.id;
    }

    //let log = [{message: "first line"},{message: "first line"},{message: "first line"},{message: "first line"},{message: "first line"},{message: "first line"},{message: "first line"}, {message: "second line"}, {message: "third line"}];

    return (
      <div>
        <TileRenderer targets={this.state.targets} tileSizeX={size} tileSizeY={size} topOffset={topOffset} leftOffset={leftOffset} click={this.click} highlights={highlights} markedX={this.state.selection.markedX} markedY={this.state.selection.markedY} width_tiles={width_tiles} height_tiles={height_tiles} />
        <div align="left" style={{ borderRadius: "5px", background: "#282c34", fontSize: "8px", color: "white", position: "absolute", height: 40, width: 300, top: 5, left: 375 }}>Game turn: {this.props.showdown.turn}, move selected: {this.state.action.moveSelected.toString()}, game status: {this.props.showdown.gameStatus}, showdown id: {this.props.showdown.id}, survivorId: {this.state.survivor.id}, monsterId: {monsterId}
        , revealed ai: {this.state.revealedAI.title}, game name: {this.props.showdown.description}</div>
        <MonsterTile deHoverMonster={this.deHoverMonster} hoverMonster={this.hoverMonster} tileSize={size} topOffset={topOffset} leftOffset={leftOffset} click={this.click} facing={monsterFacing} selectedMonster={this.state.selection.selectedMonsterId} positionX={monsterPosX} positionY={monsterPosY} height={monsterHeight} width={monsterWidth} id={monsterId} gameStatus={gameStatus}/>
        <SurvivorTiles deHoverSurvivor={this.deHoverSurvivor} hoverSurvivor={this.hoverSurvivor} tileSize={size} topOffset={topOffset} leftOffset={leftOffset} click={this.click} selectedSurvivorId={this.state.selection.selectedSurvivorId} survivors={survivors} />
        <SurvivorTiles deHoverSurvivor={this.deHoverSurvivor} hoverSurvivor={this.hoverSurvivor} tileSize={size} topOffset={topOffset} leftOffset={leftOffset} click={this.click} selectedSurvivorId={this.state.selection.selectedSurvivorId} survivors={survivors} />
        <InfoBox hover={this.state.selection.typeHover} survivor={this.state.selection.hoverSurvivor} monster={monster} aiDeck={this.state.aiDeck}/>
        <ActionBox act={this.props.showdown.act} moveSelected={this.state.action.moveSelected} survivor={this.state.survivor} aiCard={this.state.revealedAI} targets={this.state.targets} selection={this.state.selection.typeSelected} attack={this.clickedAttack} target={this.target} revealAI={this.clickedRevealAI} nextAct={this.nextAct} monsterMove={this.clickedMonsterMove} survivorMove={this.clickedSurvivorMove} activate={this.clickedActivate} changeFacing={this.changeFacing} />
        <Gamelog log={this.state.log}/>
        {this.state.revealedAI !== 0 ? <AICard aiCard={this.state.revealedAI}/> : null }
        {this.state.dodge.showDodgePopup ? <DodgeSelecter hits={this.state.dodge.hits} dodgeHits={this.dodgePopUpClosed.bind(this)} /> : null}
        {this.state.action.selectHLCard ? <HLSelecter hlCards={this.state.revealedHL} woundLocation={this.woundLocation.bind(this)} /> : null}
      </div>
    )
  }
}

//<InfoBox hover={this.state.selection.typeHover} selection={this.state.selection.typeSelected} survivors={this.state.survivors} survivor={this.state.survivor} monster={monster} aiDeck={this.state.aiDeck}/>
        