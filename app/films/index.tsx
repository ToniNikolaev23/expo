import FilmItem from "@/components/FilmItem";
import ListEmptyComponent from "@/components/ListEmptyComponent";
import { COLORS } from "@/constants/colors";
import { Film } from "@/types/interfaces";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, RefreshControl } from "react-native";

const Page = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchFilms = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://swapi.dev/api/films/");
      const data = await response.json();
      console.log("🚀 ~ fetchFilms ~ data:", data);
      setFilms(data.results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFilms();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFilms();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={films}
        keyExtractor={(item) => item.episode_id.toString()}
        renderItem={({ item }) => <FilmItem item={item} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.text}
          />
        }
        ListEmptyComponent={() => (
          <ListEmptyComponent loading={loading} message="No films found" />
        )}
      />
    </View>
  );
};

export default Page;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.containerBackground,
  },
});
