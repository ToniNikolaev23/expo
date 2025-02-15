import FilmItem from "@/components/FilmItem";
import { COLORS } from "@/constants/colors";
import { FAVORITES_KEY } from "@/constants/keys";
import { Film } from "@/types/interfaces";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";

const Page = () => {
  const [favorites, setFavorites] = useState<Film[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const checkFavorites = async () => {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      if (favorites) {
        setFavorites(JSON.parse(favorites));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkFavorites();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    checkFavorites();
  };

  const removeFavorite = async (film: Film) => {
    const updatedFavorites = favorites.filter(
      (f) => f.episode_id !== film.episode_id
    );
    setFavorites(updatedFavorites);
    try {
      await AsyncStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(updatedFavorites)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const renderItem = ({ item }: { item: Film }) => {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{item.title}</Text>
        <TouchableOpacity onPress={() => removeFavorite(item)}>
          <Ionicons name="trash-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.episode_id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.text}
          />
        }
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
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.itemBackground,
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  itemText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "bold",
  },
});
