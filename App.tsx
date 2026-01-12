import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RootLayout from "./src/navigation/RootLayout";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootLayout />
    </GestureHandlerRootView>
  );
}
