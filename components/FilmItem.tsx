import { COLORS } from "@/constants/colors";
import { Film } from "@/types/interfaces";
import { StyleSheet, Text, View } from "react-native";

const FilmItem: React.FC<{ item: Film }> = ({ item }) => {
  return (
    <View style={styles.filmItem}>
      <Text style={styles.filmTitle}>{item.title}</Text>
      <Text style={styles.filmDetails}>Episode: {item.episode_id}</Text>
      <Text style={styles.filmDetails}>Released: {item.release_date}</Text>
    </View>
  );
};

export default FilmItem;

const styles = StyleSheet.create({
  filmItem: {
    backgroundColor: COLORS.background,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  filmTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  filmDetails: {
    fontSize: 14,
    color: "#fff",
  },
});
