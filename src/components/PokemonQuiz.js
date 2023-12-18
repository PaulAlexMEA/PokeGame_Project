import React, { useState, useEffect } from 'react';
import { getPokemon } from '../services/pokeApi';
import Question from './Question';
import StartButton from './StartButton';

const PokemonQuiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [resetFlag, setResetFlag] = useState(false);

  useEffect(() => {
    const loadQuestions = async () => {
      let loadedQuestions = [];
      for (let i = 1; i <= 6; i++) {
        const pokemonId = Math.floor(Math.random() * 807) + 1;
        const pokemon = await getPokemon(pokemonId);
        const questionType = Math.floor(Math.random() * 4);
        const question = generateQuestion(pokemon, questionType);
        loadedQuestions.push(question);
      }
      setQuestions(loadedQuestions);
    };

    if (gameStarted) {
      loadQuestions();
    }
  }, [gameStarted]);

  const generateQuestion = (pokemon, questionType) => {
    const typeOptions = ['fire', 'water', 'grass', 'electric', 'psychic', pokemon.types[0].type.name];
    const weightOptions = ['light', 'medium', 'heavy', 'very heavy'];
    const heightOptions = ['short', 'medium', 'tall', 'very tall'];
    const abilityOptions = pokemon.abilities.map(a => a.ability.name);

    switch (questionType) {
      case 0: // Type principal
        return {
          pokemon: pokemon,
          questionText: "Quel est le type principal de ce Pokémon ?",
          correctAnswer: pokemon.types[0].type.name,
          options: shuffleArray(typeOptions)
        };
      case 1: // Poids
        return {
          pokemon: pokemon,
          questionText: "Quel est le poids de ce Pokémon ?",
          correctAnswer: getWeightCategory(pokemon.weight),
          options: shuffleArray(weightOptions)
        };
      case 2: // Taille
        return {
          pokemon: pokemon,
          questionText: "Quelle est la taille de ce Pokémon ?",
          correctAnswer: getHeightCategory(pokemon.height),
          options: shuffleArray(heightOptions)
        };
      case 3: // Capacité spéciale
        const randomAbility = abilityOptions[Math.floor(Math.random() * abilityOptions.length)];
        return {
          pokemon: pokemon,
          questionText: "Quelle est la capacité spéciale de ce Pokémon ?",
          correctAnswer: randomAbility,
          options: shuffleArray(abilityOptions)
        };
      default:
        return {
          pokemon: pokemon,
          questionText: "Quel est le type principal de ce Pokémon ?",
          correctAnswer: pokemon.types[0].type.name,
          options: shuffleArray(typeOptions)
        };
    }
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const getWeightCategory = (weight) => {
    const weightInKg = weight / 10; // Convertir de hg en kg
    if (weightInKg < 10) return 'light';
    if (weightInKg < 50) return 'medium';
    if (weightInKg < 100) return 'heavy';
    return 'very heavy';
  };

  const getHeightCategory = (height) => {
    const heightInM = height / 10; // Convertir de dm en m
    if (heightInM < 1) return 'short';
    if (heightInM < 2) return 'medium';
    return 'tall';
  };

  const handleAnswer = (option) => {
    setSelectedOption(option);
    const currentQuestion = questions[currentQuestionIndex];
    if (option === currentQuestion.correctAnswer) {
      setScore(score + 5);
    } else {
      setScore(score - 3);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setResetFlag(!resetFlag);
      } else {
        setGameOver(true);
      }
      setSelectedOption(null); // Réinitialiser pour la nouvelle question
    }, 1500); // Délai d'une seconde
  };

  const restartGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setCurrentQuestionIndex(0);
    setQuestions([]);
    setSelectedOption(null);
  };

  if (!gameStarted) {
    return <StartButton onStart={() => setGameStarted(true)} />;
  }

  if (gameOver) {
    return (
      <div>
        <h2>Votre score final est : {score}</h2>
        <button onClick={restartGame}>Recommencer le jeu</button>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div>Chargement des questions...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <h2>Votre score : {score}</h2>
      <Question 
        question={currentQuestion.questionText} 
        pokemon={currentQuestion.pokemon} 
        options={currentQuestion.options} 
        onAnswer={handleAnswer} 
        selectedOption={selectedOption}
        correctAnswer={currentQuestion.correctAnswer}
        resetFlag={resetFlag}
      />
    </div>
  );
};

export default PokemonQuiz;
