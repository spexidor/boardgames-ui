import React  from 'react';

export const NewGameScreen = (createGame) => {
    return(
        <div>
        <div className="new-game">
        <button onClick={createGame}>New Game</button>
        </div>
        <div className="bug-list">
        Known bugs:
        <p>
          <li>Grab on multiple run over survivors not implemented</li>
          <li>Sniff not implemented</li>
          <li>Not able to choose move path when monster moves as a reaction</li>
        </p>
        </div>
      </div>
    );
}