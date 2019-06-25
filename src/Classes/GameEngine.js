export class GameEngine {
    constructor(initialGameState, updateReference){

        this.gameState = initialGameState;
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

}