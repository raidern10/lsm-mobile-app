import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import TextField from "../../../src/components/TextField";

export default function TambahJurnalScreen() {
  const [judulKegiatan, setJudulKegiatan] = useState("");
  const [deskripsi, setDeskripsi] = useState("");

  const handleSimpan = () => {
    // Logika simpan data API
    console.log("Simpan Jurnal", { judulKegiatan, deskripsi });
    router.back(); // Kembali ke halaman sebelumnya
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View style={{ padding: 20 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#1f2937",
            marginBottom: 20,
          }}
        >
          Tambah Jurnal Kegiatan
        </Text>

        <TextField
          label="Judul Kegiatan"
          placeholder="Contoh: Membuat API Endpoint"
          value={judulKegiatan}
          onChangeText={setJudulKegiatan}
        />

        <TextField
          label="Deskripsi Kegiatan"
          placeholder="Jelaskan apa yang Anda kerjakan hari ini..."
          value={deskripsi}
          onChangeText={setDeskripsi}
          multiline
          numberOfLines={4}
          style={{ height: 100, textAlignVertical: "top" }} // Kustom style tinggi untuk textarea
        />

        <TouchableOpacity
          onPress={handleSimpan}
          style={{
            backgroundColor: "#f59e0b",
            paddingVertical: 14,
            borderRadius: 8,
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "bold" }}>
            Simpan Jurnal
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
