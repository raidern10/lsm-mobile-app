import { useQuery } from "@tanstack/react-query";
import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import {
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getApiError } from "../../../src/api/client";
import type { Catatan } from "../../../src/api/services";
import { cetakApi, siswaApi } from "../../../src/api/services";
import { Badge } from "../../../src/components/Badge";
import { Button } from "../../../src/components/Button";
import { Card } from "../../../src/components/Card";
import { EmptyState } from "../../../src/components/EmptyState";
import { Screen } from "../../../src/components/Screen";
import { colors, fonts } from "../../../src/theme";

const TAMBAH = "/(app)/catatan/tambah" as Href;

export default function CatatanList() {
  const router = useRouter();
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["catatan"],
    queryFn: () => siswaApi.catatanList(),
  });
  const items: Catatan[] = data?.data ?? [];

  const cetak = async () => {
    try {
      const res = await cetakApi.catatan();
      if (res?.url) Linking.openURL(res.url);
    } catch (e) {
      Alert.alert("Gagal", getApiError(e));
    }
  };

  const buka = (c: Catatan) => {
    if (c.is_approved) {
      Alert.alert(
        "Terkunci",
        "Catatan yang sudah disetujui tidak bisa diubah.",
      );
      return;
    }
    router.push(`/(app)/catatan/${c.id}` as Href);
  };

  return (
    <Screen refreshing={isRefetching} onRefresh={refetch}>
      <Button title="+ Tambah Catatan" onPress={() => router.push(TAMBAH)} />
      {isLoading ? (
        <Text style={styles.loading}>Memuat...</Text>
      ) : items.length === 0 ? (
        <EmptyState text="Belum ada catatan kegiatan." />
      ) : (
        items.map((c) => (
          <Pressable key={c.id} onPress={() => buka(c)}>
            <Card style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.title}>{c.nama_pekerjaan}</Text>
                <Badge status={c.is_approved ? "disetujui" : "pending"} />
              </View>
              <Text style={styles.label}>Perencanaan</Text>
              <Text style={styles.body}>{c.perencanaan_kegiatan}</Text>
              <Text style={styles.label}>Pelaksanaan</Text>
              <Text style={styles.body}>{c.pelaksanaan_kegiatan}</Text>
              {c.catatan_instruktur ? (
                <View style={styles.note}>
                  <Text style={styles.noteLabel}>Catatan Instruktur</Text>
                  <Text style={styles.noteBody}>{c.catatan_instruktur}</Text>
                </View>
              ) : null}
            </Card>
          </Pressable>
        ))
      )}
      {items.length > 0 ? (
        <Button title="Cetak PDF Catatan" variant="outline" onPress={cetak} />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: 6 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.mutedLight,
    marginTop: 4,
  },
  body: { fontFamily: fonts.regular, fontSize: 14, color: colors.text },
  loading: { fontFamily: fonts.regular, color: colors.muted },
  note: {
    backgroundColor: colors.bgSubtle,
    borderRadius: 12,
    padding: 10,
    marginTop: 6,
  },
  noteLabel: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.primary,
  },
  noteBody: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.text,
    marginTop: 2,
  },
});
