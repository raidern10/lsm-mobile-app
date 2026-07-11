import { Slot } from "expo-router";
import { View } from "react-native";
import { AuthProvider } from "../src/auth/AuthContext";
// Import colors/theme Anda jika ada
// import { colors } from '../src/theme';

export default function RootLayout() {
  return (
    <AuthProvider>
      {/* PERBAIKAN: Menggunakan kurung kurawal ganda {{ }} */}
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f4f4f5",
        }}
      >
        <Slot />
      </View>
    </AuthProvider>
  );
}
