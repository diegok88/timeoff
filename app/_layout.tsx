import { Stack } from "expo-router";
import { AuthProvider } from "./context/authcontext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Login" }} />
        <Stack.Screen name="principal" options={{ title: "Principal" }} />
      </Stack>
    </AuthProvider>
  )
}
