import React from 'react';

const StartButton = ({ onStart }) => {
  return (<div>
    <button className="start-button" onClick={onStart}>
      Commencer le jeu
    </button>
    <p>Rémarque : Bonne réponse = 5
      <br/>Mauvaise réponse = -3</p>
  </div>);
};

export default StartButton;
