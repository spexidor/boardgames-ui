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

  function SurvivorInPosition (position, survivors) {
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