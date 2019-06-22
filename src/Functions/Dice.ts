export const GetDiceRoll = (min: number, max: number) => {
    let myDiceRoll =  Math.floor(Math.random() * (max-min +1) +min); 
    console.log("myDiceRoll: " +myDiceRoll)
    return myDiceRoll;
  }

export const GetDiceRolls = (min: number, max: number, dice: number) => {
    let result = [];
    for(let n=0; n<dice; n++){
      result.push(Math.floor(Math.random() * (max-min +1) +min)); 
    }
    console.log("myDiceRoll: " +result)
    return result;
}

export const GetHitlocations = (numDice: number) => {

    let hits = []
    for (let i = 0; i < numDice; i++) {
        let roll = GetDiceRoll(1,6);
        switch(roll){
            case 1: hits.push("HEAD");
                break;
            case 2: hits.push("ARMS");
                break;
            case 3: hits.push("LEGS");
                break;
            case 4: hits.push("BODY");
                break;
            case 5: hits.push("BODY");
                break;
            case 6: hits.push("WAIST");
                break;
        }
    }
    return hits;
}