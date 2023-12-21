import React from 'react';
import { useState, useEffect } from 'react';
import { getPokemon } from '../services/pokeApi';
import Question from './Question';
import StartButton from './StartButton';

function PokemonQuiz() {
  // Définition des états avec useState
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [resetFlag, setResetFlag] = useState(false);

  // useEffect pour charger les questions au démarrage du jeu
  useEffect(() => {
    async function loadQuestions() {
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

  // Fonction pour générer une question
  function generateQuestion(pokemon, questionType) {
    const typeOptions = ['fire', 'water', 'grass', 'electric', 'psychic', pokemon.types[0].type.name];
    const weightOptions = ['light', 'medium', 'heavy', 'very heavy'];
    const heightOptions = ['short', 'medium', 'tall', 'very tall'];
    const abilityOptions = pokemon.abilities.map(a => a.ability.name);

    switch (questionType) {
      case 0: // Question sur le type
        return {
          pokemon: pokemon,
          questionText: "Quel est le type principal de ce Pokémon ?",
          correctAnswer: pokemon.types[0].type.name,
          options: shuffleArray(typeOptions)
        };
      case 1: // Question sur le poids
        return {
          pokemon: pokemon,
          questionText: "Quel est le poids de ce Pokémon ?",
          correctAnswer: getWeightCategory(pokemon.weight),
          options: shuffleArray(weightOptions)
        };
      case 2: // Question sur la taille
        return {
          pokemon: pokemon,
          questionText: "Quelle est la taille de ce Pokémon ?",
          correctAnswer: getHeightCategory(pokemon.height),
          options: shuffleArray(heightOptions)
        };
      case 3: // Question sur la capacité
        const randomAbility = abilityOptions[Math.floor(Math.random() * abilityOptions.length)];
        return {
          pokemon: pokemon,
          questionText: "Quelle est la capacité spéciale de ce Pokémon ?",
          correctAnswer: randomAbility,
          options: shuffleArray(abilityOptions)
        };
      default: // Question par défaut
        return {
          pokemon: pokemon,
          questionText: "Quel est le type principal de ce Pokémon ?",
          correctAnswer: pokemon.types[0].type.name,
          options: shuffleArray(typeOptions)
        };
    }
  };

  // Fonction pour mélanger un tableau (Shuffle)
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  };

  // Fonction pour obtenir la catégorie de poids
  function getWeightCategory(weight) {
    const weightInKg = weight / 10;
    if (weightInKg < 10) return 'light';
    if (weightInKg < 50) return 'medium';
    if (weightInKg < 100) return 'heavy';
    return 'very heavy';
  };

  // Fonction pour obtenir la catégorie de taille
  function getHeightCategory(height) {
    const heightInM = height / 10;
    if (heightInM < 1) return 'short';
    if (heightInM < 2) return 'medium';
    return 'tall';
  };

  // Gestion de la réponse sélectionnée
  function handleAnswer(option) {
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
      setSelectedOption(null);
    }, 1500);
  };

  // Réinitialisation du jeu
  function restartGame() {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setCurrentQuestionIndex(0);
    setQuestions([]);
    setSelectedOption(null);
  };

  // Affichage du bouton de démarrage si le jeu n'a pas commencé
  if (!gameStarted) {
    return <StartButton onStart={() => setGameStarted(true)} />;
  }

  // Affichage des résultats si le jeu est terminé
  if (gameOver) {
    return (
      <div>
        <h2>Votre score final est : {score}</h2>
        <button className="start-button" onClick={restartGame}>Recommencer le jeu</button>
      </div>
    );
  }

  // Message de chargement pendant le chargement des questions
  if (questions.length === 0) {
    return <div>Chargement des questions...</div>;
  }

  // Récupération de la question actuelle
  const currentQuestion = questions[currentQuestionIndex];

  // Affichage de la question actuelle
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
