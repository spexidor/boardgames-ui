import { DeckManager } from '../Classes/DeckManager'; 

export class GameEngine {
    constructor(initialGameState, updateReference){

        this.gameState = initialGameState;
        this.deckManager = new DeckManager(initialGameState.monster.aiDeck);
        this.updateRef = updateReference;

        console.log("creating new game engine");
    }

    updateGameState = () => {
        console.log("updating state through gameEngine");
        this.updateRef(this.gameState);
    }

    click = () => {
        console.log("gameEngine: click");
    }

    getDeckManager = () => {
        return this.deckManager;
    }

}