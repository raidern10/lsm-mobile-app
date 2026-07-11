import { useQuery } from "@tanstack/react-query";
import { useRouter, type Href } from "expo-router";
import React from "react";
import { Alert, Linking, StyleSheet, Text, View } from "react-native";
import { getApiError } from "../../../src/api/client";
import { cetakApi, jurnalApi } from "../../../src/api/services";
import { useAuth } from "../../../src/auth/AuthContext";
import { Badge } from "../../../src/components/Badge";
import { Button } from "../../../src/components/Button";
import { Card } from "../../../src/components/Card";
import { EmptyState } from "../../../src/components/EmptyState";
import { Screen } from "../../../src/components/Screen";
import { colors, fonts } from "../../../src/theme";

const TAMBAH: Href = "/(app)/jurnal/tambah";

export default function JurnalList() {
  const { user } = useAuth();
  const router = useRouter();
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["jurnals"],
    queryFn: () => jurnalApi.list(),
  });
  const items = data?.data ?? [];

  const cetak = async () => {
    try {
      const res = await cetakApi.jurnal();
      if (res?.url) await Linking.openURL(res.url);
      else Alert.alert("Info", "URL cetak tidak tersedia.");
    } catch (e) {
      Alert.alert("Gagal mencetak", getApiError(e));
    }
  };

  return (
    <Screen refreshing={isRefetching} onRefresh={refetch}>
      {user?.role === "siswa_pkl" ? (
        <Button title="+ Tambah Jurnal" onPress={() => router.push(TAMBAH)} />
      ) : null}
      <Button title="Cetak PDF Jurnal" variant="outline" onPress={cetak} />

      {isLoading ? (
        <Text style={styles.loading}>Memuat...</Text>
      ) : items.length === 0 ? (
        <EmptyState text="Belum ada jurnal." />
      ) : (
        items.map((j: any) => (
          <Card key={j.id} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.date}>{j.hari_tanggal}</Text>
              <Badge status={j.status_persetujuan} />
            </View>
            {j.siswa?.name ? (
              <Text style={styles.siswa}>{j.siswa.name}</Text>
            ) : null}
            {(j.items ?? []).slice(0, 2).map((it: any, i: number) => (
              <Text key={i} style={styles.item}>
                • {it.unit_kerja}: {it.uraian}
              </Text>
            ))}
          </Card>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: 4 },
  loading: { fontFamily: fonts.regular, color: colors.muted },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: { fontFamily: fonts.semibold, color: colors.text, fontSize: 15 },
  siswa: { fontFamily: fonts.medium, color: colors.primary, fontSize: 13 },
  item: { fontFamily: fonts.regular, color: colors.muted, fontSize: 13 },
});
