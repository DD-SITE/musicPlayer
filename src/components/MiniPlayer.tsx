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

        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {song.name}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {song.primaryArtists}
          </Text>
        </View>

        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          style={styles.playButton}
        >
          <Text style={styles.playIcon}>{isPlaying ? "⏸" : "▶"}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#121212",
    borderTopWidth: 1,
    borderColor: "#222",
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  artist: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 2,
  },
  playButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FF8C00",
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
});
