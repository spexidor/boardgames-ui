export const UpdateSurvivor = (survivor) => {

    //console.log("updating survivor in back end");
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
          status: survivor.status,
          bleed: survivor.bleed,
          position: survivor.position,
          movesLeft: survivor.movesLeft,
          activationsLeft: survivor.activationsLeft,
          movement: survivor.movement,
          survival: survivor.survival,
          insanity: survivor.insanity,
          hitlocations: survivor.hitlocations,
          gearGrid: survivor.gearGrid,
        }),
      }).then(response => response.json());
  }
  else {
    console.log("Survivor id not defined: " +url);
    return null;
  }
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

  export const GetSurvivorMoves = (id) => {
    const url = "http://localhost:8083/survivor/" + id + "/openMoves";
    return fetch(url).then(response => response.json());
  }