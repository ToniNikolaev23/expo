import { COLORS } from "@/constants/colors";
import { Film } from "@/types/interfaces";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { FAVORITES_KEY } from "@/constants/keys";

const Page = () => {
  const { id } = useLocalSearchParams();
  const [film, setFilm] = useState<Film | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  useEffect(() => {
    const fetchFilm = async () => {
      try {
        const response = await fetch(`https://swapi.dev/api/films/${id}`);
        const data = await response.json();
        checkFavoriteStatus(data);
        setFilm(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilm();
  }, [id]);

  const checkFavoriteStatus = async (film: Film) => {
    try {
      const favorites = await AsyncStorage.getItem("favorites");
      if (favorites) {
        const favoriteFilms = JSON.parse(favorites) as Film[];
        setIsFavorite(
          favoriteFilms.some((f) => f.episode_id === film.episode_id)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      let favoriteFilms = favorites ? JSON.parse(favorites) : [];

      if (isFavorite) {
        favoriteFilms = favoriteFilms.filter(
          (f: Film) => f.episode_id !== film?.episode_id
        );
      } else {
        favoriteFilms.push(film);
      }

      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteFilms));
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color={COLORS.text} />
      </View>
    );
  }

  if (!film) {
    return (
      <View>
        <Text style={{ color: "#fff" }}>Film not found!</Text>
      </View>
    );
  }

  return (
    <ScrollView bounces={false} style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => {
            return (
              <TouchableOpacity onPress={toggleFavorite}>
                <Ionicons
                  name={isFavorite ? "star" : "star-outline"}
                  size={24}
                  color={COLORS.text}
                />
              </TouchableOpacity>
            );
          },
        }}
      />
      <Text style={styles.title}>{film.title}</Text>
      <Text style={styles.detail}>Episode: {film.episode_id}</Text>
      <Text style={styles.detail}>Released: {film.release_date}</Text>
      <Text style={styles.detail}>Director: {film.director}</Text>
      <Text style={styles.detail}>Producer: {film.producer}</Text>
      <Text style={styles.crawl}>Opening Crawl: {film.opening_crawl}</Text>
    </ScrollView>
  );
};

export default Page;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.containerBackground,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 16,
  },
  detail: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 8,
  },
  crawl: {
    fontSize: 16,
    color: COLORS.text,
    marginTop: 16,
    fontStyle: "italic",
  },
});
