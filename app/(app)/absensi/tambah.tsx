import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { getApiError } from "../../../src/api/client";
import { absensiApi } from "../../../src/api/services";
import { Button } from "../../../src/components/Button";
import { Card } from "../../../src/components/Card";
import { Screen } from "../../../src/components/Screen";
import { TextField } from "../../../src/components/TextField";
import { colors, fonts, radius, spacing } from "../../../src/theme";

const STATUS = ["Hadir", "Izin", "Sakit", "Alpha"] as const;

export default function TambahAbsensi() {
  const router = useRouter();
  const qc = useQueryClient();
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<(typeof STATUS)[number]>("Hadir");
  const [jamMasuk, setJamMasuk] = useState("08:00");
  const [jamPulang, setJamPulang] = useState("16:00");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await absensiApi.create({
        tanggal,
        status,
        jam_masuk: status === "Hadir" ? jamMasuk : undefined,
        jam_pulang: status === "Hadir" ? jamPulang : undefined,
      });
      await qc.invalidateQueries({ queryKey: ["absensis"] });
      Alert.alert("Berhasil", "Absensi tersimpan.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert("Gagal", getApiError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Card style={styles.gap12}>
        <TextField
          label="Tanggal (YYYY-MM-DD)"
          value={tanggal}
          onChangeText={setTanggal}
        />

        <View style={styles.gap6}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.chips}>
            {STATUS.map((s) => {
              const active = s === status;
              return (
                <Pressable
                  key={s}
                  onPress={() => setStatus(s)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text
                    style={[styles.chipTxt, active && styles.chipTxtActive]}
                  >
                    {s}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {status === "Hadir" ? (
          <View style={styles.jamRow}>
            <View style={styles.flex1}>
              <TextField
                label="Jam Masuk (H:i)"
                value={jamMasuk}
                onChangeText={setJamMasuk}
              />
            </View>
            <View style={styles.flex1}>
              <TextField
                label="Jam Pulang (H:i)"
                value={jamPulang}
                onChangeText={setJamPulang}
              />
            </View>
          </View>
        ) : null}

        <Button
          title="Simpan Absensi"
          variant="success"
          onPress={submit}
          loading={loading}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  gap12: { gap: 12 },
  gap6: { gap: 6 },
  label: { fontFamily: fonts.medium, color: colors.text, fontSize: 14 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.white,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipTxt: { fontFamily: fonts.medium, color: colors.text, fontSize: 13 },
  chipTxtActive: { color: colors.white },
  jamRow: { flexDirection: "row", gap: spacing.sm },
  flex1: { flex: 1 },
});
