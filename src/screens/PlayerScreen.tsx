import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MiniPlayer from "../components/MiniPlayer";
import { usePlayerStore } from "../store/playerStore";

export default function PlayerScreen() {
  const song = usePlayerStore((s) => s.currentSong);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const position = usePlayerStore((s) => s.position);
  const duration = usePlayerStore((s) => s.duration);
  const sound = usePlayerStore((s) => s.sound);
  const navigation = useNavigation<any>();

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
    <>
      <View style={styles.container}>
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

        <TouchableOpacity onPress={togglePlay} style={styles.button}>
          <Text style={styles.control}>⏸ Pause</Text>
        </TouchableOpacity>
      </View>

      <MiniPlayer navigation={navigation} />
    </>
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
  button: {
    backgroundColor: "#1DB954",
    padding: 16,
    borderRadius: 30,
    marginTop: 24,
  },
  control: {
    color: "black",
    fontSize: 18,
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
});
