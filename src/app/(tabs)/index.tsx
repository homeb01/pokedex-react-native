import PokemonCard from "@/components/PokemonCard";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Pokemon = {
  name: string;
  id: number;
};

function Index() {
  const [pokemon, setPokemon] = React.useState<Pokemon[]>([]);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=151",
      );
      const data = await response.json();
      const list = data.results.map((p: { name: string; url: string }) => ({
        name: p.name,
        id: Number(p.url.split("/").filter(Boolean).pop()),
      }));
      setPokemon(list);
      await new Promise((res) => setTimeout(res, 10000)); // Esperar 10 segundos para ver el indicador de carga
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="tomato" />;

  const handlePress = () => {
    console.log("Pikachu");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokedex</Text>
      <FlatList
        data={pokemon}
        renderItem={({ item }) => (
          <PokemonCard key={item.id} name={item.name} id={item.id} />
        )}
        keyExtractor={(p) => p.name}
        style={{ width: "100%", gap: 0 }}
      />
      <TouchableOpacity onPress={handlePress} style={styles.button}>
        <Text>Print "Pikachu"</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    borderColor: "black",
    borderWidth: 1.5,
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
    backgroundColor: "lightgray",
  },
});
