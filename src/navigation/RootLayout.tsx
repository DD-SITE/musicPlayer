import { StyleSheet, View } from "react-native";
import MiniPlayer from "../components/MiniPlayer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>{children}</View>
      <MiniPlayer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
