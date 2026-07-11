import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useAuth } from "../../src/auth/AuthContext";

export default function DashboardScreen() {
  const { user } = useAuth();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <View style={{ padding: 20 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#1f2937",
            marginBottom: 8,
          }}
        >
          Dashboard
        </Text>
        <Text style={{ fontSize: 16, color: "#6b7280", marginBottom: 20 }}>
          Selamat datang kembali, {user?.email || "User"}!
        </Text>

        <View
          style={{
            backgroundColor: "#ffffff",
            padding: 20,
            borderRadius: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 16, color: "#374151" }}>
            Ini adalah halaman utama ringkasan aplikasi LSM Mobile Anda.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
