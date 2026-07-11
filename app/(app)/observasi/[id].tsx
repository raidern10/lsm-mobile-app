import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import type { Observasi } from "../../../src/api/services";
import { siswaApi } from "../../../src/api/services";
import { Badge } from "../../../src/components/Badge";
import { Card } from "../../../src/components/Card";
import { EmptyState } from "../../../src/components/EmptyState";
import { Screen } from "../../../src/components/Screen";
import { colors, fonts } from "../../../src/theme";

export default function ObservasiDetail() {
  const params = useLocalSearchParams<{ id: string }>();
  const obsId = Number(params.id);
  const { data, isLoading } = useQuery({
    queryKey: ["observasi"],
    queryFn: () => siswaApi.observasiList(),
  });
  const items: Observasi[] = data?.data ?? [];
  const obs = items.find((o) => o.id === obsId);

  if (isLoading) {
    return (
      <Screen>
        <Text style={styles.loading}>Memuat...</Text>
      </Screen>
    );
  }
  if (!obs) {
    return (
      <Screen>
        <EmptyState text="Data observasi tidak ditemukan." />
      </Screen>
    );
  }

  return (
    <Screen>
      <Card style={styles.head}>
        <View style={styles.row}>
          <Text style={styles.date}>{obs.hari_tanggal}</Text>
          <Badge status={obs.is_approved ? "disetujui" : "pending"} />
        </View>
        <Text style={styles.label}>Pekerjaan / Projek</Text>
        <Text style={styles.body}>{obs.pekerjaan_projek ?? "-"}</Text>
        <Text style={styles.meta}>
          Guru Pembimbing: {obs.guru?.name ?? "-"}
        </Text>
      </Card>
      {(obs.items ?? []).map((it, i) => (
        <Card key={it.id ?? i} style={styles.item}>
          <Text style={styles.itemTitle}>Poin #{i + 1}</Text>
          <Text style={styles.label}>Permasalahan</Text>
          <Text style={styles.body}>{it.permasalahan}</Text>
          <Text style={styles.label}>Solusi</Text>
          <Text style={styles.body}>{it.solusi}</Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { gap: 4 },
  item: { gap: 4 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  label: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.mutedLight,
    marginTop: 4,
  },
  body: { fontFamily: fonts.regular, fontSize: 14, color: colors.text },
  meta: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    marginTop: 4,
  },
  itemTitle: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.primary,
  },
  loading: { fontFamily: fonts.regular, color: colors.muted },
});
