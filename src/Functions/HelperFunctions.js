export const PositionsEqual = (p1, p2) => {
    return (p1.x===p2.x && p1.y===p2.y)
}

export const EmptySpaceInFrontOfMonster = (monster, survivors) => {

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

  export const SurvivorInPosition = (position, survivors) => {
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

  export const Adjacent = (p1, p2) => {
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

  export const GetDiceRoll = (min, max) => {
    let myDiceRoll =  Math.floor(Math.random() * (max-min +1) +min); 
    console.log("myDiceRoll: " +myDiceRoll)
    return myDiceRoll;
  }