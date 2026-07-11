import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import TextField from "../../../src/components/TextField";

export default function TambahAbsensiScreen() {
  const [status, setStatus] = useState("");
  const [keterangan, setKeterangan] = useState("");

  const handleSimpan = () => {
    // Logika simpan data API
    console.log("Simpan Absensi", { status, keterangan });
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
          Tambah Absensi
        </Text>

        <TextField
          label="Status Kehadiran"
          placeholder="Contoh: Hadir / Izin / Sakit"
          value={status}
          onChangeText={setStatus}
        />

        <TextField
          label="Keterangan Tambahan"
          placeholder="Tambahkan catatan jika perlu"
          value={keterangan}
          onChangeText={setKeterangan}
          multiline
          numberOfLines={3}
          style={{ height: 80, textAlignVertical: "top" }} // Kustom style tinggi untuk textarea
        />

        <TouchableOpacity
          onPress={handleSimpan}
          style={{
            backgroundColor: "#10b981",
            paddingVertical: 14,
            borderRadius: 8,
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "bold" }}>
            Simpan Absensi
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
