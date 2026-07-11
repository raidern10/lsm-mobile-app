import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../src/auth/AuthContext";

export default function ProfilScreen() {
  const { user, signOut } = useAuth();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#f9fafb",
        padding: 20,
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: "#d1d5db",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 32, color: "#ffffff" }}>👤</Text>
      </View>

      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#1f2937",
          marginBottom: 4,
        }}
      >
        {user?.email || "Akun Pengguna"}
      </Text>
      <Text style={{ fontSize: 16, color: "#6b7280", marginBottom: 30 }}>
        LSM Mobile App
      </Text>

      <TouchableOpacity
        onPress={signOut}
        style={{
          backgroundColor: "#ef4444",
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 8,
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "bold" }}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}
