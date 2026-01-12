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
  const isPlaying = usePlayerStore((s) => s.isPlaying);

  const shuffle = usePlayerStore((s) => s.shuffle);
  const repeat = usePlayerStore((s) => s.repeat);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
  const cycleRepeat = usePlayerStore((s) => s.cycleRepeat);

  const song = queue[currentIndex];
  const navigation = useNavigation<any>();

  if (!song) return null;

  const seek = async (value: number) => {
    if (sound) await sound.setPositionAsync(value);
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
        <Text style={{ color: "#FF8C00" }}>Queue</Text>
      </TouchableOpacity>

      <Image source={{ uri: song.image[2].link }} style={styles.image} />

      <Text style={styles.title}>{song.name}</Text>
      <Text style={styles.artist}>{song.primaryArtists}</Text>

      <Slider
        style={{ width: "100%", marginTop: 24 }}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        onSlidingComplete={seek}
        minimumTrackTintColor="#FF8C00"
        maximumTrackTintColor="#333"
        thumbTintColor="#FF8C00"
      />

      <View style={styles.timeRow}>
        <Text style={styles.time}>{format(position)}</Text>
        <Text style={styles.time}>{format(duration)}</Text>
      </View>

      {/* Shuffle / Repeat */}
      <View style={styles.modes}>
        <TouchableOpacity onPress={toggleShuffle}>
          <Text style={[styles.mode, shuffle && styles.active]}>🔀</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={cycleRepeat}>
          <Text style={[styles.mode, repeat !== "off" && styles.active]}>
            {repeat === "one" ? "🔂" : "🔁"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.controlsRow}>
        <TouchableOpacity onPress={previous}>
          <Text style={styles.skip}>⏮</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={togglePlay} style={styles.playButton}>
          <Text style={styles.playIcon}>{isPlaying ? "⏸" : "▶"}</Text>
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
    backgroundColor: "#0B0B0B",
    alignItems: "center",
    padding: 24,
  },
  image: {
    width: 280,
    height: 280,
    borderRadius: 16,
    marginTop: 40,
    marginBottom: 24,
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
  },
  artist: {
    color: "#aaa",
    marginTop: 4,
    marginBottom: 24,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 32,
  },
  skip: {
    color: "white",
    fontSize: 28,
    marginHorizontal: 32,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FF8C00",
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: {
    color: "#000",
    fontSize: 28,
    fontWeight: "bold",
  },
  timeRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  time: {
    color: "#888",
    fontSize: 12,
  },
  queueButton: {
    position: "absolute",
    top: 50,
    right: 24,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  modes: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%",
    marginTop: 24,
  },
  mode: {
    fontSize: 22,
    color: "#777",
  },
  active: {
    color: "#FF8C00",
  },
});

