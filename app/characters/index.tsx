import { COLORS } from "@/constants/colors";
import { Character, People } from "@/types/interfaces";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";

const Page = () => {
  const [peopleData, setPeopleData] = useState<People>();
  const [people, setPeople] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPeople = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://swapi.dev/api/people/");
      const data = await response.json();
      setPeopleData(data);
      setPeople(data.results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  const renderItem = ({ item }: { item: Character }) => {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{item.name}</Text>
      </View>
    );
  };

  const fetchMorePeople = async () => {
    if (peopleData?.next) {
      const response = await fetch(peopleData.next);
      const data = await response.json();
      setPeopleData(data);
      setPeople((prev) => [...prev, ...data.results]);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color={COLORS.text} />;
  }

  return (
    <View style={styles.container}>
      {peopleData && (
        <FlatList
          data={people}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
          onEndReached={fetchMorePeople}
        />
      )}
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
    backgroundColor: COLORS.background,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  itemText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "bold",
  },
});
