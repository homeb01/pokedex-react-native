import { Image, StyleSheet, Text, View } from "react-native";

type Props = {
  name: string;
  id: number;
};

const PokemonCard = ({ name, id }: Props) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>
          {name} (#{id})
        </Text>
      </View>
      <Image
        source={{
          uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
        }}
        style={{
          flex: 1,
          width: 100,
          height: 100,
          resizeMode: "contain",
          backgroundColor: "lightgray",
        }}
      />
    </View>
  );
};

export default PokemonCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 5,
    borderColor: "black",
    borderWidth: 1.5,
    borderRadius: 5,
    padding: 10,
    gap: 10,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
});
