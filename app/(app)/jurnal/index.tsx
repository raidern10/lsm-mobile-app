import { useQuery } from "@tanstack/react-query";
import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { guruApi, jurnalApi } from "../../../src/api/services";
import { useAuth } from "../../../src/auth/AuthContext";
import { Badge } from "../../../src/components/Badge";
import { Button } from "../../../src/components/Button";
import { Card } from "../../../src/components/Card";
import { EmptyState } from "../../../src/components/EmptyState";
import { Screen } from "../../../src/components/Screen";
import { colors, fonts } from "../../../src/theme";

const TAMBAH = "/(app)/jurnal/tambah" as Href;

export default function JurnalList() {
  const router = useRouter();
  const { user } = useAuth();
  const isSiswa = user?.role === "siswa_pkl";
  const isGuru = user?.role === "guru_pembimbing";

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["jurnals", user?.role],
    queryFn: () => (isGuru ? guruApi.monitoringJurnal() : jurnalApi.list()),
  });
  const items: any[] = data?.data ?? [];

  return (
    <Screen refreshing={isRefetching} onRefresh={refetch}>
      {isSiswa ? (
        <Button title="+ Tambah Jurnal" onPress={() => router.push(TAMBAH)} />
      ) : null}
      {isLoading ? (
        <Text style={styles.loading}>Memuat...</Text>
      ) : items.length === 0 ? (
        <EmptyState text="Belum ada jurnal." />
      ) : (
        items.map((j) => (
          <Pressable
            key={j.id}
            onPress={() => router.push(`/(app)/jurnal/${j.id}` as Href)}
          >
            <Card style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.date}>{j.hari_tanggal}</Text>
                <Badge status={j.status_persetujuan} />
              </View>
              {!isSiswa ? (
                <Text style={styles.siswa}>
                  {j.siswa?.name ?? "-"} · {j.siswa?.nisn ?? "-"}
                </Text>
              ) : null}
              <Text style={styles.meta}>
                {j.items?.length ?? 0} kegiatan · ketuk untuk detail
              </Text>
            </Card>
          </Pressable>
        ))
      )}
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
  siswa: { fontFamily: fonts.medium, fontSize: 13, color: colors.primary },
  meta: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
  loading: { fontFamily: fonts.regular, color: colors.muted },
});
