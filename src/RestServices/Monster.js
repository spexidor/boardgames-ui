export const UpdateMonster = (monster) => {

    const id = monster.id;
    const url = 'http://localhost:8083/monster/' +id;
  
    if(typeof id !== 'undefined'){
  
      console.log("updating monster in backend");
      return fetch(url, {
      crossDomain:true,
      method: 'PUT',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          id: monster.id,
          lastWoundedBy: monster.lastWoundedBy,
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

  export const UpdateMonsterAI = (monsterId, aiDeck) => {

    const url = 'http://localhost:8083/monster/' +monsterId +'/ai';
  
    if(typeof monsterId !== 'undefined'){
  
      return fetch(url, {
      crossDomain:true,
      method: 'PUT',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          id: aiDeck.id,
          cardsInDeck: aiDeck.cardsInDeck,
          cardsInDiscard: aiDeck.cardsInDiscard,
          cardsRemoved: aiDeck.cardsRemoved,
          basicAction: aiDeck.basicAction
        }),
      }).then(response => response.json());
    }
    else{
      console.log("Id not defined: " +url);
    }
  }

  export const UpdateMonsterHL = (monsterId, hlDeck) => {

    const url = 'http://localhost:8083/monster/' +monsterId +'/hl';
  
    if(typeof monsterId !== 'undefined'){
  
      return fetch(url, {
      crossDomain:true,
      method: 'PUT',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          id: hlDeck.id,
          cardsInDeck: hlDeck.cardsInDeck,
          cardsInDiscard: hlDeck.cardsInDiscard,
          cardsRemoved: hlDeck.cardsRemoved,
        }),
      }).then(response => response.json());
    }
    else{
      console.log("Id not defined: " +url);
    }
  }


export const GetAiDeck = (monsterId) => {
    const url = 'http://localhost:8083/monster/' +monsterId +'/ai';
    return fetch(url).then(response => response.json());
}

export const UpdateAiDeck = (monsterId, aiDeck) => {

}

/*
 * Returns list of survivors
 */
export const GetTargets = (monsterId, cardId) => {
    const url = 'http://localhost:8083/monster/' +monsterId +'/ai/' +cardId +'/targets';
    return fetch(url).then(response => response.json());
}

export const GetMonsterMoves = (id) => {
    const url = "http://localhost:8083/monster/" + id + "/openMoves";
    return fetch(url).then(response => response.json());
  }

export const GetMonsterSpecialMove = (id, direction) => {
  let length = 5;
  const url = "http://localhost:8083/monster/" + id + "/specificMove?direction=" +direction +"&length=" +length;
  return fetch(url).then(response => response.json());
}