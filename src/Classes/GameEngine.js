export class GameEngine {
    constructor(initialGameState, updateReference){

        this.gameState = initialGameState;
        this.updateRef = updateReference;
    }

    updateGameState = () => {
        console.log("updating state through gameEngine");
        this.updateRef(this.gameState);
    }


}