import { useQuery } from "@tanstack/react-query";
import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { absensiApi, guruApi } from "../../../src/api/services";
import { useAuth } from "../../../src/auth/AuthContext";
import { Badge } from "../../../src/components/Badge";
import { Button } from "../../../src/components/Button";
import { Card } from "../../../src/components/Card";
import { EmptyState } from "../../../src/components/EmptyState";
import { Screen } from "../../../src/components/Screen";
import { colors, fonts } from "../../../src/theme";

const TAMBAH = "/(app)/absensi/tambah" as Href;

export default function AbsensiList() {
  const router = useRouter();
  const { user } = useAuth();
  const isSiswa = user?.role === "siswa_pkl";
  const isGuru = user?.role === "guru_pembimbing";

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["absensis", user?.role],
    queryFn: () => (isGuru ? guruApi.monitoringAbsensi() : absensiApi.list()),
  });
  const items: any[] = data?.data ?? [];

  return (
    <Screen refreshing={isRefetching} onRefresh={refetch}>
      {isSiswa ? (
        <Button
          title="+ Isi Absensi Hari Ini"
          onPress={() => router.push(TAMBAH)}
        />
      ) : null}
      {isLoading ? (
        <Text style={styles.loading}>Memuat...</Text>
      ) : items.length === 0 ? (
        <EmptyState text="Belum ada absensi." />
      ) : (
        items.map((a) => (
          <Card key={a.id} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.date}>{a.tanggal}</Text>
              <Badge status={a.status} />
            </View>
            {!isSiswa ? (
              <Text style={styles.siswa}>{a.siswa?.name ?? "-"}</Text>
            ) : null}
            <Text style={styles.jam}>
              Masuk: {a.jam_masuk ?? "-"} · Pulang: {a.jam_pulang ?? "-"}
            </Text>
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
  jam: { fontFamily: fonts.regular, color: colors.muted, fontSize: 13 },
});
