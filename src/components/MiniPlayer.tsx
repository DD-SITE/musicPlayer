import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { navigate } from "../navigation/RootNavigation";
import { usePlayerStore } from "../store/playerStore";

export default function MiniPlayer() {
  const queue = usePlayerStore((s) => s.queue);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const togglePlay = usePlayerStore((s) => s.togglePlay);

  const song = queue[currentIndex];
  if (!song) return null;

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={() => navigate("Player")}>
      <View style={styles.container}>
        <Image source={{ uri: song.image[1].link }} style={styles.image} />

        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>
            {song.name}
          </Text>
          <Text style={styles.artist}>{song.primaryArtists}</Text>
        </View>

        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
        >
          <Text style={styles.control}>{isPlaying ? "⏸" : "▶️"}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E1E1E",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#333",
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 6,
    marginRight: 12,
  },
  title: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  artist: {
    color: "#aaa",
    fontSize: 12,
  },
  control: {
    color: "white",
    fontSize: 22,
    paddingHorizontal: 12,
  },
});
