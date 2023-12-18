import React, { useState, useEffect } from 'react';
import { getPokemon } from '../services/pokeApi';

const PokemonViewer = () => {
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      const data = await getPokemon(1); // 1 est l'ID pour Bulbasaur
      setPokemon(data);
    };

    fetchPokemon();
  }, []);

  if (!pokemon) return <div>Loading...</div>;

  return (
    <div>
      <h1>{pokemon.name}</h1>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
    </div>
  );
};

export default PokemonViewer;
