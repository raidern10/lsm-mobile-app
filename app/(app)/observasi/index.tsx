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
import type { Observasi } from "../../../src/api/services";
import { cetakApi, siswaApi } from "../../../src/api/services";
import { Badge } from "../../../src/components/Badge";
import { Button } from "../../../src/components/Button";
import { Card } from "../../../src/components/Card";
import { EmptyState } from "../../../src/components/EmptyState";
import { Screen } from "../../../src/components/Screen";
import { colors, fonts } from "../../../src/theme";

export default function ObservasiList() {
  const router = useRouter();
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["observasi"],
    queryFn: () => siswaApi.observasiList(),
  });
  const items: Observasi[] = data?.data ?? [];

  const cetak = async () => {
    try {
      const res = await cetakApi.observasi();
      if (res?.url) Linking.openURL(res.url);
    } catch (e) {
      Alert.alert("Gagal", getApiError(e));
    }
  };

  return (
    <Screen refreshing={isRefetching} onRefresh={refetch}>
      {isLoading ? (
        <Text style={styles.loading}>Memuat...</Text>
      ) : items.length === 0 ? (
        <EmptyState text="Belum ada lembar observasi." />
      ) : (
        items.map((o) => (
          <Pressable
            key={o.id}
            onPress={() => router.push(`/(app)/observasi/${o.id}` as Href)}
          >
            <Card style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.date}>{o.hari_tanggal}</Text>
                <Badge status={o.is_approved ? "disetujui" : "pending"} />
              </View>
              <Text style={styles.proj}>{o.pekerjaan_projek ?? "-"}</Text>
              <Text style={styles.meta}>
                Guru: {o.guru?.name ?? "-"} · {o.items?.length ?? 0} poin
              </Text>
            </Card>
          </Pressable>
        ))
      )}
      {items.length > 0 ? (
        <Button title="Cetak PDF Observasi" variant="outline" onPress={cetak} />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: 4 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  proj: { fontFamily: fonts.regular, fontSize: 14, color: colors.text },
  meta: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
  loading: { fontFamily: fonts.regular, color: colors.muted },
});
