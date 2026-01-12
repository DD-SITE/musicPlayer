import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { usePlayerStore } from "../store/playerStore";

export default function PlayerScreen() {
  const queue = usePlayerStore((s) => s.queue);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const next = usePlayerStore((s) => s.next);
  const previous = usePlayerStore((s) => s.previous);
  const position = usePlayerStore((s) => s.position);
  const duration = usePlayerStore((s) => s.duration);
  const sound = usePlayerStore((s) => s.sound);

  const navigation = useNavigation<any>();

  const song = queue[currentIndex];
  if (!song) return null;

  const seek = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  const format = (ms: number) => {
    const sec = Math.floor(ms / 1000);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.queueButton}
        onPress={() => navigation.navigate("Queue")}
      >
        <Text style={styles.queueText}>Queue</Text>
      </TouchableOpacity>

      <Image source={{ uri: song.image[2].link }} style={styles.image} />

      <Text style={styles.title}>{song.name}</Text>
      <Text style={styles.artist}>{song.primaryArtists}</Text>

      <Slider
        style={{ width: "100%", marginVertical: 20 }}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        onSlidingComplete={seek}
        minimumTrackTintColor="#1DB954"
        maximumTrackTintColor="#555"
      />

      <View style={styles.timeRow}>
        <Text style={styles.time}>{format(position)}</Text>
        <Text style={styles.time}>{format(duration)}</Text>
      </View>

      <View style={styles.controlsRow}>
        <TouchableOpacity onPress={previous}>
          <Text style={styles.skip}>⏮</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={togglePlay} style={styles.playButton}>
          <Text style={styles.play}>⏯</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={next}>
          <Text style={styles.skip}>⏭</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F0F",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 12,
    marginBottom: 24,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 12,
  },
  artist: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 24,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
  },
  skip: {
    color: "white",
    fontSize: 32,
    marginHorizontal: 24,
  },
  playButton: {
    backgroundColor: "#1DB954",
    padding: 18,
    borderRadius: 40,
  },
  play: {
    color: "black",
    fontSize: 22,
    fontWeight: "bold",
  },
  timeRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  time: {
    color: "#aaa",
    fontSize: 12,
  },
  queueButton: {
    position: "absolute",
    top: 50,
    right: 24,
    zIndex: 10,
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  queueText: {
    color: "#1DB954",
    fontSize: 14,
    fontWeight: "600",
  },
});
