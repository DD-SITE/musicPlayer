import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { usePlayerStore } from "../store/playerStore";

export default function HomeScreen() {
  const [query, setQuery] = useState("arijit");
  const [songs, setSongs] = useState<any[]>([]);

  const playSong = usePlayerStore((s) => s.playSong);
  const queue = usePlayerStore((s) => s.queue);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const restore = usePlayerStore((s) => s.restore);

  const currentSong = queue[currentIndex];

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    fetchSongs();
    restore();
  }, []);

  const fetchSongs = async (search = query) => {
    try {
      const res = await fetch(
        `https://saavn.sumit.co/api/search/songs?query=${search}`
      );
      const json = await res.json();
      setSongs(json.data.results);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Music</Text>

      <TextInput
        placeholder="Search songs"
        placeholderTextColor="#888"
        style={styles.search}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={() => fetchSongs(query)}
      />

      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isPlaying = currentSong?.id === item.id;

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => playSong(item, songs)}
            >
              <Image source={{ uri: item.image[1].link }} style={styles.image} />

              <View style={{ flex: 1 }}>
                <Text style={styles.song} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.artist} numberOfLines={1}>
                  {item.primaryArtists}
                </Text>
                {isPlaying && (
                  <Text style={styles.playing}>Now Playing</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0B",
    padding: 16,
  },
  header: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
  },
  search: {
    backgroundColor: "#1A1A1A",
    color: "white",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#141414",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 12,
  },
  song: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  artist: {
    color: "#aaa",
    fontSize: 13,
    marginTop: 2,
  },
  playing: {
    color: "#1DB954",
    fontSize: 12,
    marginTop: 4,
  },
});
