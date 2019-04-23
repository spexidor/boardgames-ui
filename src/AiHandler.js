
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