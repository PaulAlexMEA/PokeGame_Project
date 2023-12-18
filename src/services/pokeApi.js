import axios from 'axios';

const pokeApi = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/'
});

export const getPokemon = async (pokemonId) => {
  try {
    const response = await pokeApi.get(`pokemon/${pokemonId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data from PokeAPI', error);
    return null;
  }
};
