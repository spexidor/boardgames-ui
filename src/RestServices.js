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

export const GetHitlocations = (numDice) => {
  const url = 'http://localhost:8083/survivor/hitlocation?numDice=' +numDice;
  return fetch(url).then(response => response.json());
}

export const GetInjury = (hitlocation) => {
  console.log("fetching injury from table " +hitlocation)
  //const url = 'http://localhost:8083/survivor/injury?table=' +hitlocation;
  const url = 'http://localhost:8083/survivor/injury?table=head';
  
  return fetch(url).then(response => response.json());
}

export const DeleteSurvivor = (survivor) => {

  const id = survivor.id;
  const url = 'http://localhost:8083/survivor/' +id;
  console.log("REST: deleting survivor " +survivor.name +" from back end");

  if(typeof id !== 'undefined'){ 
    fetch(url, {
      crossDomain:true,
      method: 'DELETE',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      }})
  }
  else{
    console.log("Survivor id not defined: " +url);
  }
}

export const GetShowdown = () => {
   return fetch('http://localhost:8083/showdown/68').then(response => response.json());
}

export const UpdateMonsterAI = (monster) => {

  const id = monster.id;
  const url = 'http://localhost:8083/monster/' +id +'/ai';

  if(typeof id !== 'undefined'){

    return fetch(url, {
    crossDomain:true,
    method: 'PUT',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        id: monster.aiDeck.id,
        cardsInDeck: monster.aiDeck.cardsInDeck,
        cardsInDiscard: monster.aiDeck.cardsInDiscard,
        cardsRemoved: monster.aiDeck.cardsRemoved,
        basicAction: monster.aiDeck.basicAction
      }),
    }).then(response => response.json());
  }
  else{
    console.log("Id not defined: " +url);
  }
}

export const UpdateSurvivor = (survivor) => {

    console.log("updating survivor in back end");
    const id = survivor.id;
    const url = 'http://localhost:8083/survivor/' +id;

    if(typeof id !== 'undefined'){ 
      return fetch(url, {
      crossDomain:true,
      method: 'PUT',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          id: survivor.id,
          name: survivor.name,
          isAlive: survivor.isAlive,
          status: survivor.status,
          bleed: survivor.bleed,
          hitlocations: survivor.hitlocations,
          position: survivor.position,
          movesLeft: survivor.movesLeft,
          activationsLeft: survivor.activationsLeft,
          movement: survivor.movement,
          survival: survivor.survival,
          insanity: survivor.insanity,
          gearGrid: survivor.gearGrid,
          alive: survivor.alive
        }),
      });
  }
  else {
    console.log("Survivor id not defined: " +url);
    return null;
  }
}

export const UpdateMonster = (monster) => {

  const id = monster.id;
  const url = 'http://localhost:8083/monster/' +id;

  if(typeof id !== 'undefined'){

    //console.log("new facing to rest " +monster.facing)
    return fetch(url, {
    crossDomain:true,
    method: 'PUT',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        id: monster.id,
        position: {
          x: parseInt(monster.position.x),
          y: parseInt(monster.position.y)
        },
        facing: monster.facing
      }),
    }).then(response => response.json());
  }
  else{
    console.log("Monster id not defined: " +url);
    return null;
  }
}

export const UpdateShowdown = (showdown) => {

    const id = showdown.id;
    const url = 'http://localhost:8083/showdown/' +id;
    
    fetch(url, {
    crossDomain:true,
    method: 'PUT',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        id: showdown.id,
        turn: showdown.turn,
        name: showdown.name
      }),
    })
  }