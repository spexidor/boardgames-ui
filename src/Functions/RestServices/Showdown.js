import {EnvHost} from './BackendHost'

export const GetShowdown = (id) => {
    const url = EnvHost + '/showdown/' +id;
    return fetch(url).then(response => response.json());
 }

 export const GetLatestShowdown = () => {
  const url = EnvHost + '/showdown/latest';
  return fetch(url).then(response => response.json());
}
 
 export const CreateShowdown = (name) => {
 
   const url = EnvHost + '/showdown/'
   console.log("creating new showdown in backend (POST to " +url +")");
   
   if(typeof name !== 'undefined'){ 
     return fetch(url, {
     crossDomain:true,
     method: 'POST',
     headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
     },
     body: name
     }).then(response => response.json());
   }
   else {
     console.log("Showdown name not defined");
     return null;
   }
 }

 export const UpdateShowdown = (showdown) => {

    const id = showdown.id;
    const url = EnvHost + '/showdown/' +id;
    
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
        name: showdown.name,
        gameStatus: showdown.gameStatus,
        act: showdown.act
      }),
    })
  }