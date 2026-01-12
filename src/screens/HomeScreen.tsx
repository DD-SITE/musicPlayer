import { useNavigation } from "@react-navigation/native";
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
  const navigation = useNavigation<any>();

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
      <Text style={styles.title}>Music</Text>

      <TextInput
        placeholder="Search songs..."
        placeholderTextColor="#aaa"
        style={styles.search}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={() => fetchSongs(query)}
      />

      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isPlaying = currentSong?.id === item.id;

          return (
            <TouchableOpacity
              style={styles.row}
              onPress={() => playSong(item, songs)}
            >
              <Image source={{ uri: item.image[1].link }} style={styles.image} />
              <View>
                <Text style={styles.song}>{item.name}</Text>
                <Text style={styles.artist}>{item.primaryArtists}</Text>
                {isPlaying && <Text style={styles.playing}>Playing…</Text>}
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
    backgroundColor: "#0F0F0F",
    padding: 16,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  search: {
    backgroundColor: "#1E1E1E",
    color: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 12,
  },
  song: {
    color: "white",
    fontSize: 16,
  },
  artist: {
    color: "#aaa",
    fontSize: 12,
  },
  playing: {
    color: "#1DB954",
    fontSize: 12,
  },
});
