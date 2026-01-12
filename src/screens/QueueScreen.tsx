import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { usePlayerStore } from "../store/playerStore";

export default function QueueScreen() {
  const queue = usePlayerStore((s) => s.queue);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const playFromQueue = usePlayerStore((s) => s.playFromQueue);
  const remove = usePlayerStore((s) => s.removeFromQueue);
  const reorder = usePlayerStore((s) => s.reorderQueue);

  const renderItem = (params: RenderItemParams<any>) => {
  const { item, drag, isActive, getIndex } = params;
  const index = getIndex()!;

    return (
      <TouchableOpacity
        style={[
          styles.row,
          isActive && { backgroundColor: "#1a1a1a" },
        ]}
        onLongPress={drag}
        onPress={() => playFromQueue(index)}
      >
        <Text
          style={[
            styles.song,
            index === currentIndex && styles.playing,
          ]}
        >
          {item.name}
        </Text>

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
        onDragEnd={({ from, to }) => reorder(from, to)}
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
    fontSize: 22,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#222",
  },
  song: {
    color: "white",
    fontSize: 16,
    flex: 1,
  },
  playing: {
    color: "#1DB954",
  },
  remove: {
    color: "red",
    fontSize: 18,
    paddingHorizontal: 12,
  },
});
