import React, { useState, useEffect } from 'react';

const Question = ({ question, pokemon, options, onAnswer, correctAnswer, resetFlag }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  // Réinitialiser selectedOption chaque fois que la question change
  useEffect(() => {
    setSelectedOption(null);
  }, [question, resetFlag]);

  const handleClick = (option) => {
    setSelectedOption(option);
    onAnswer(option);
  };

  const getButtonClassName = (option) => {
    if (selectedOption === null) return "button";
    if (selectedOption === option) {
      return option === correctAnswer ? "button button-correct" : "button button-incorrect";
    }
    return "button";
  };

  return (
    <div>
      <h3 className="question-container">{question}</h3>
      <div className="pokemon-image-container">
      <img src={pokemon.sprites.front_default} alt={pokemon.name} className="pokemon-image"/>
      </div>
      <div className="buttons-container">
        {options.map((option, index) => (
          <button
            key={index}
            className={getButtonClassName(option)}
            onClick={() => handleClick(option)}
            disabled={selectedOption !== null}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Question;
