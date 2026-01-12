import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { usePlayerStore } from "../store/playerStore";

export default function QueueScreen() {
  const queue = usePlayerStore((s) => s.queue);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const playSong = usePlayerStore((s) => s.playSong);
  const remove = usePlayerStore((s) => s.removeFromQueue);
  const reorderQueue = usePlayerStore.getState().reorderQueue;

  const renderItem = ({
    item,
    drag,
    isActive,
    getIndex,
  }: RenderItemParams<any>) => {
    const index = getIndex?.() ?? 0;
    const isPlaying = index === currentIndex;

    return (
      <TouchableOpacity
        onLongPress={drag}
        activeOpacity={0.8}
        style={[
          styles.row,
          isActive && { backgroundColor: "#222" },
        ]}
      >
        {/* Song name */}
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => playSong(item, queue)}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.song,
              isPlaying && styles.playing,
            ]}
          >
            {item.name}
          </Text>
        </TouchableOpacity>

        {/* Remove button */}
        <TouchableOpacity onPress={() => remove(index)}>
          <Text style={styles.remove}>✕</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Up Next</Text>

      <DraggableFlatList
        data={queue}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onDragEnd={({ from, to }) => reorderQueue(from, to)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0B",
    paddingTop: 24,
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#222",
  },
  song: {
    color: "white",
    fontSize: 16,
    flexShrink: 1,
  },
  playing: {
    color: "#1DB954",
    fontWeight: "600",
  },
  remove: {
    color: "#FF5555",
    fontSize: 18,
    paddingHorizontal: 12,
  },
});
