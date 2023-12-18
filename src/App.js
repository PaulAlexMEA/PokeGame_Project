import React from 'react';
import './App.css';
import PokemonQuiz from './components/PokemonQuiz'; // Assurez-vous que le chemin d'accès est correct

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>PokeGame</h1>
        <PokemonQuiz />
      </header>
    </div>
  );
}

export default App;

