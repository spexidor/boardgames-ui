import {Position, Monster, Survivor, AttackProfile} from './Interfaces'

export const PositionsEqual = (p1: Position, p2: Position) => {
    return (p1.x===p2.x && p1.y===p2.y)
}

export const EmptySpaceInFrontOfMonster = (monster: Monster, survivors: Survivor[]) => {

    if(monster.facing === "UP"){
      const pos1 = {
        x: monster.position.x,
        y: monster.position.y-1
      }
      if(!SurvivorInPosition(pos1, survivors))
      {
        return pos1;
      }
      const pos2 = {
        x: monster.position.x+1,
        y: monster.position.y-1
      }
      if(!SurvivorInPosition(pos2, survivors))
      {
        return pos2;
      }
    }
    else if(monster.facing === "DOWN"){
      const pos1 = {
        x: monster.position.x,
        y: monster.position.y+2
      }
      if(!SurvivorInPosition(pos1, survivors))
      {
        return pos1;
      }
      const pos2 = {
        x: monster.position.x+1,
        y: monster.position.y+2
      }
      if(!SurvivorInPosition(pos2, survivors))
      {
        return pos2;
      }
    }
    else if(monster.facing === "LEFT"){
      const pos1 = {
        x: monster.position.x-1,
        y: monster.position.y
      }
      if(!SurvivorInPosition(pos1, survivors))
      {
        return pos1;
      }
      const pos2 = {
        x: monster.position.x-1,
        y: monster.position.y+1
      }
      if(!SurvivorInPosition(pos2, survivors))
      {
        return pos2;
      }
    }
    else if(monster.facing === "RIGHT"){
      const pos1 = {
        x: monster.position.x+2,
        y: monster.position.y
      }
      if(!SurvivorInPosition(pos1, survivors))
      {
        return pos1;
      }
      const pos2 = {
        x: monster.position.x+2,
        y: monster.position.y+1
      }
      if(!SurvivorInPosition(pos2, survivors))
      {
        return pos2;
      }
    }
    return null;
  }

  export const SurvivorInPosition = (position: Position, survivors: Survivor[]) => {
    //console.log("checking if survivor in " +position.x +"," +position.y);
    //console.log(survivors.length +" survivors to check");
    for(let n=0; n<survivors.length; n++){
      if(survivors[n].position.x === position.x && survivors[n].position.y === position.y){
        //console.log("survivor in position " +position.x +","+position.y)
        return true;
      }
    }
    return false;
  }

  export const SurvivorInRange = (monster: Monster, survivor: Survivor, attackProfile: AttackProfile) => {

    if(attackProfile.infiniteReach){
      return true;
    }
    else {
      let inRange = false;

      //TODO: use "reach" value in attackProfile
      for(let i=0; i<monster.baseCoordinates.length; i++){
        if (Adjacent(survivor.position, monster.baseCoordinates[i])) {
          inRange = true;
          break;
        }
      }
      return inRange;
    }
  }

  export const MonsterInRange = (monster: Monster, survivor: Survivor, attack: AttackProfile) => {
    let inRange = false;
    console.log("checking if monster is in range. monster pos: " +monster.position.x +"," +monster.position.y);
    const baseCoordinates = GetBaseCoordinates(monster);;
    for(let i=0; i<baseCoordinates.length; i++){
      if (Adjacent(survivor.position, baseCoordinates[i])) {
        inRange = true;
        break;
      }
    }
    if(attack.reach === -1){
      inRange = true;
    }
    console.log("monster in range: " +inRange.toString());
    return inRange;
  }

  export const GetBaseCoordinates = (monster: Monster) => {
    let baseCoordinates = [];
    let x = monster.position.x;
    let y = monster.position.y;
  
    for(let i=0;i<monster.statline.width; i++){
        for(let j=0;j<monster.statline.height; j++){
            baseCoordinates.push({x: x+i, y: y+j});
        }
    }
    return baseCoordinates;
  }

  export const Adjacent = (p1: Position, p2: Position) => {
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

  export const GetDiceRoll = (min: number, max: number) => {
    let myDiceRoll =  Math.floor(Math.random() * (max-min +1) +min); 
    console.log("myDiceRoll: " +myDiceRoll)
    return myDiceRoll;
  }

  export const GetMonsterDirectionMarks = (monsterPosition: Position, direction: string) => {

    let monsterMoveHighlights: never[] | { x: number; y: number; }[] | { x: number; y: number; }[] | { x: number; y: number; }[] | { x: number; y: number; }[] = [];
    
    if(direction === "DOWN"){
      monsterMoveHighlights = 
      [{x: monsterPosition.x,
        y: monsterPosition.y+2},
       {x: monsterPosition.x+1,
        y: monsterPosition.y+2}]
    }
    else if(direction === "UP"){
      monsterMoveHighlights = 
      [{x: monsterPosition.x,
        y: monsterPosition.y-1},
       {x: monsterPosition.x+1,
        y: monsterPosition.y-1}]
    }
    else if(direction === "LEFT"){
      monsterMoveHighlights = 
      [{x: monsterPosition.x-1,
        y: monsterPosition.y},
       {x: monsterPosition.x-1,
        y: monsterPosition.y+1}]
    }
    else if(direction === "RIGHT"){
      monsterMoveHighlights = 
      [{x: monsterPosition.x+2,
        y: monsterPosition.y},
       {x: monsterPosition.x+2,
        y: monsterPosition.y+1}]
    }
    return monsterMoveHighlights;
   }

   export const DirectionsAgainstSurvivor = (monsterPosition: Position, survivorPosition: Position) => {

    let directions = [];
    if(monsterPosition.y > (survivorPosition.y)){ //UP
      directions.push("UP");
    }
    if((monsterPosition.y+1) < survivorPosition.y){ //DOWN
      directions.push("DOWN");
    }
    if(monsterPosition.x > survivorPosition.x){ //LEFT
      directions.push("LEFT");
    }
    if((monsterPosition.x+1) < survivorPosition.x){ //RIGHT
      directions.push("RIGHT");
    }
    return directions;
   }