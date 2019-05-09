export const GetHits = (numDice, toHitValue) => {
  const url = 'http://localhost:8083/dice?numDice=' +numDice + '&diceSides=10&toHitValue=' +toHitValue +'&hitsOnly=true';
  console.log(numDice +" dice, hitting on " +toHitValue +"+");
  if(typeof numDice !== 'undefined'){
    return fetch(url).then(response => response.json());
  }
  else {
    console.log("numDice not defined");
    return null;
  }
}

export const GetWound = (toWoundValue) => {
  const numDice = 1;
  const url = 'http://localhost:8083/dice?numDice=' +numDice + '&diceSides=10';
  console.log(numDice +" dice, wounding on " +toWoundValue +"+");
 
  return fetch(url).then(response => response.json());
}

export const GetDiceRoll = (numDice) => {
  const url = 'http://localhost:8083/dice?numDice=' +numDice + '&diceSides=10';
 
  return fetch(url).then(response => response.json());
}