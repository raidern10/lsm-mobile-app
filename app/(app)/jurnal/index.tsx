import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function JurnalIndexScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#1f2937",
            marginBottom: 16,
          }}
        >
          Data Jurnal
        </Text>

        {/* Contoh Item Jurnal */}
        <View
          style={{
            backgroundColor: "#ffffff",
            padding: 16,
            borderRadius: 8,
            borderLeftWidth: 4,
            borderLeftColor: "#f59e0b",
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Pembuatan UI Login
          </Text>
          <Text style={{ color: "#6b7280", marginTop: 4 }}>
            Tanggal: 12 Oktober 2026
          </Text>
          <Text style={{ color: "#374151", marginTop: 8 }}>
            Memperbaiki desain halaman login menggunakan React Native Expo
            Router.
          </Text>
        </View>
      </ScrollView>

      {/* Tombol Tambah (Floating Action Button) */}
      <TouchableOpacity
        onPress={() => router.push("/(app)/jurnal/tambah")}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: "#2563eb",
          width: 56,
          height: 56,
          borderRadius: 28,
          justifyContent: "center",
          alignItems: "center",
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 3,
        }}
      >
        <Text
          style={{
            color: "#ffffff",
            fontSize: 28,
            fontWeight: "300",
            lineHeight: 32,
          }}
        >
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
}
