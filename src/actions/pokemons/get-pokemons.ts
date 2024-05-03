import { pokemonApi } from '../../config/api/PokemonApi';
import { Pokemon } from '../../domain/entities/Pokemon';
import {
  PokemonAPIPokemon,
  PokemonApiPaginatedResponse,
} from '../../infraestructure/interfaces/pokemonApi.interfaces';
import { PokemonMapper } from '../../infraestructure/mappers/pokemon.mappers';

export const getPokemons = async (
  page: number,
  limit: number = 20,
): Promise<Pokemon[]> => {
  try {
    const url = `/pokemon?offset=${page * 10}&limit=${limit}`;
    const {data} = await pokemonApi.get<PokemonApiPaginatedResponse>(url);
    const pokemonPromises = data.results.map(result => {
      return pokemonApi.get<PokemonAPIPokemon>(result.url);
    });
    const pokemonApiPokemons = await Promise.all(pokemonPromises);
    const pokemonsPromises = pokemonApiPokemons.map(item =>
      PokemonMapper.pokemonApiPokemonToEntity(item.data),
    );

    return await Promise.all(pokemonsPromises);
  } catch (error) {
    throw new Error('Error getting pokemons');
  }
};
