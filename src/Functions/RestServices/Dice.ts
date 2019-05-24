export const GetHits = (numDice: number, toHitValue: number) => {
  const url = 'http://localhost:8083/dice?numDice=' +numDice + '&diceSides=10&toHitValue=' +toHitValue;
  console.log(numDice +" dice, hitting on " +toHitValue +"+");
  if(typeof numDice !== 'undefined'){
    return fetch(url).then(response => response.json());
  }
  else {
    console.log("numDice not defined");
    return null;
  }
}

/*
export const GetDiceRoll = (numDice) => {
  const url = 'http://localhost:8083/dice?numDice=' +numDice + '&diceSides=10';
 
  return fetch(url).then(response => response.json());
}
*/