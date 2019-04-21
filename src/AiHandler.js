
export const GetAiDeck = (monsterId) => {
    const url = 'http://localhost:8083/monster/' +monsterId +'/ai';
    return fetch(url).then(response => response.json());
}

export const UpdateAiDeck = (monsterId, aiDeck) => {

}

export const GetTargets = (monsterId, targetRule) => {
    const url = 'http://localhost:8083/monster/' +monsterId +'/targets';
    return fetch(url, {
        crossDomain:true,
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            targetRule
          )
        }).then(response => response.json());
}

/*
"targetRule": {
    "targetOrder": [
        {
            "id": 14,
            "closest": true,
            "threat": true,
            "facing": true,
            "inRange": true,
            "knockedDown": false,
            "blindSpot": false
        },
        {
            "id": 15,
            "closest": true,
            "threat": true,
            "facing": false,
            "inRange": false,
            "knockedDown": false,
            "blindSpot": false
        }
    ]
}
*/