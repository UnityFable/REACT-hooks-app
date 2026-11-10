import { useEffect, useState } from 'react';

interface Props {
  id: number;
}

interface Pokemon {
  id: number;
  name: string;
  imgUrl: string;
}

export const usePokemon = ({ id }: Props) => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getPokemonByid = async (id: number) => {
    setIsLoading(true);
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();

    setPokemon({
      id,
      name: data.name,
      imgUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    getPokemonByid(id);
  }, [id]);

  return {
    pokemon,
    isLoading,

    formattedId: id.toString().padStart(3, '0'),
  };
}
