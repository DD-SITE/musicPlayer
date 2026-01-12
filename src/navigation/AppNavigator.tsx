import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MiniPlayer from "../components/MiniPlayer";
import HomeScreen from "../screens/HomeScreen";
import PlayerScreen from "../screens/PlayerScreen";
import QueueScreen from "../screens/QueueScreen";
import { navigationRef } from "./RootNavigation";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Player" component={PlayerScreen} />
        <Stack.Screen name="Queue" component={QueueScreen} />
      </Stack.Navigator>

      <MiniPlayer />
    </NavigationContainer>
  );
}


