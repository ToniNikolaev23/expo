import { COLORS } from "@/constants/colors";
import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: COLORS.background,
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        contentStyle: {
          backgroundColor: COLORS.background,
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: "All Characters" }} />
      {/* <Stack.Screen name="[id]" options={{ title: "Film Details" }} /> */}
    </Stack>
  );
};

export default Layout;
