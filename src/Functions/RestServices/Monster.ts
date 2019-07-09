import {Monster, HlDeck, AiDeck} from './../Interfaces'
import {EnvHost} from './BackendHost'

export const UpdateMonster = (monster: Monster) => {
//export function UpdateMonster<T>(monster: Monster): Promise<T> {

    const id = monster.id;
    const url = EnvHost + '/monster/' +id;
  
    if(typeof id !== 'undefined'){
  
      console.log("updating monster in backend");
      return fetch(url, {
      //crossDomain: true,
      method: 'PUT',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          id: monster.id,
          lastWoundedBy: monster.lastWoundedBy,
          status: monster.status,
          position: {
            x: monster.position.x,
            y: monster.position.y
          },
          facing: monster.facing,
          negativeTokens: monster.negativeTokens,
          positiveTokens: monster.positiveTokens,
          activatedThisTurn: monster.activatedThisTurn
        }),
      }).then((response: { json: () => void; }) => response.json());
    }
    else{
      console.log("Monster id not defined: " +url);
      return null;
    }
  }

  export const UpdateMonsterAI = (monsterId: number, aiDeck: AiDeck) => {

    const url = EnvHost + '/monster/' +monsterId +'/ai';
  
    if(typeof monsterId !== 'undefined'){
  
      return fetch(url, {
      //crossDomain: true,
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
      }).then((response: { json: () => void; }) => response.json());
    }
    else{
      console.log("Id not defined: " +url);
    }
  }

  export const UpdateMonsterHL = (monsterId:number, hlDeck: HlDeck) => {

    const url = EnvHost + '/monster/' +monsterId +'/hl';
  
    if(typeof monsterId !== 'undefined'){
  
      return fetch(url, {
      //crossDomain:true,
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
      }).then((response: { json: () => void; }) => response.json());
    }
    else{
      console.log("Id not defined: " +url);
    }
  }


export const GetAiDeck = (monsterId: number) => {
    const url = EnvHost + '/monster/' +monsterId +'/ai';
    return fetch(url).then(response => response.json());
}

export const UpdateAiDeck = (monsterId: number, aiDeck: AiDeck) => {

}

/*
 * Returns list of survivors
 */
export const GetTargets = (monsterId: number, cardId: number) => {
    const url = EnvHost + '/monster/' +monsterId +'/ai/' +cardId +'/targets';
    return fetch(url).then(response => response.json());
}

export const GetMonsterMoves = (id: number) => {
    const url = EnvHost + "/monster/" + id + "/openMoves";
    return fetch(url).then(response => response.json());
  }

export const GetMonsterSpecialMove = (id: number, direction: string) => {
  let length = 5;
  const url = EnvHost + "/monster/" + id + "/specificMove?direction=" +direction +"&length=" +length;
  return fetch(url).then(response => response.json());
}