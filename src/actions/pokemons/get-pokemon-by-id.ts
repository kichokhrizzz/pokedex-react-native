import { pokemonApi } from '../../config/api/PokemonApi';
import { Pokemon } from '../../domain/entities/Pokemon';
import { PokemonAPIPokemon } from '../../infraestructure/interfaces/pokemonApi.interfaces';
import { PokemonMapper } from '../../infraestructure/mappers/pokemon.mappers';

export const getPokemonById = async (id: number): Promise<Pokemon> => {
  try {
    const {data} = await pokemonApi.get<PokemonAPIPokemon>(`/pokemon/${id}`);
    const pokemon = await PokemonMapper.pokemonApiPokemonToEntity(data);
    return pokemon;
  } catch (error) {
    throw new Error('Error getting pokemon');
  }
};
