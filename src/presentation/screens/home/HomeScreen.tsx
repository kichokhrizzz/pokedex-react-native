import {useInfiniteQuery, useQueryClient} from '@tanstack/react-query';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Text} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getPokemons} from '../../../actions';
import {globalTheme} from '../../../config/theme/global-theme';
import {Pokemon} from '../../../domain/entities/Pokemon';
import PokemonCard from '../../components/pokemon/PokemonCard';
import PokeballBg from '../../components/ui/PokeballBg';

const HomeScreen = () => {
  const {top} = useSafeAreaInsets();
  const queryCliente = useQueryClient();

  /* Forma tracional de una petición HTTP
  const {isLoading, data: pokemons = []} = useQuery({
    queryKey: ['pokemons'],>
    queryFn: () => getPokemons(0),
    staleTime: 1000 * 60 * 60,
  });*/

  const {isLoading, data, fetchNextPage} = useInfiniteQuery({
    queryFn: async params => {
      const pokemons = await getPokemons(params.pageParam);
      pokemons.forEach(it => {
        queryCliente.setQueryData(['pokemon', it.id], it);
      });
      return pokemons;
    },
    queryKey: ['pokemons', 'infinitie'],
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => pages.length,
    staleTime: 1000 * 60 * 60, // 60 minutos
  });

  return (
    <View style={globalTheme.globalMargin}>
      <PokeballBg style={styles.imgPosition} />
      <FlatList
        style={{paddingTop: top + 20}}
        data={data?.pages.flat() ?? []}
        keyExtractor={(pokemon: Pokemon, index) => `${pokemon.id}-${index}`}
        numColumns={2}
        ListHeaderComponent={() => (
          <Text variant="displayMedium" style={{marginBottom: 24}}>
            Pokédex
          </Text>
        )}
        renderItem={({item}) => <PokemonCard pokemon={item} />}
        onEndReachedThreshold={0.6}
        onEndReached={() => fetchNextPage()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imgPosition: {
    position: 'absolute',
    top: -100,
    right: -100,
  },
});

export default HomeScreen;
