import { useQuery } from "@tanstack/react-query";
import { Alert, Linking, StyleSheet, Text, View } from "react-native";
import { getApiError } from "../../src/api/client";
import type { Nilai } from "../../src/api/services";
import { cetakApi, siswaApi } from "../../src/api/services";
import { Button } from "../../src/components/Button";
import { Card } from "../../src/components/Card";
import { EmptyState } from "../../src/components/EmptyState";
import { Screen } from "../../src/components/Screen";
import { colors, fonts } from "../../src/theme";

export default function NilaiScreen() {
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["nilai"],
    queryFn: () => siswaApi.nilai(),
  });
  const nilai: Nilai | null = data?.data ?? null;

  const cetak = async () => {
    try {
      const res = await cetakApi.nilai();
      if (res?.url) Linking.openURL(res.url);
    } catch (e) {
      Alert.alert("Gagal", getApiError(e));
    }
  };

  const komponen = [
    { label: "Soft Skill", value: nilai?.soft_skill, unit: "/5" },
    { label: "Hard Skill", value: nilai?.hard_skill, unit: "/5" },
    {
      label: "Pengembangan Hard Skill",
      value: nilai?.pengembangan_hard_skill,
      unit: "/5",
    },
    { label: "Kewirausahaan", value: nilai?.kewirausahaan, unit: "/5" },
    { label: "Rata-rata Instruktur", value: nilai?.rata_rata, unit: "/5" },
    { label: "Nilai Guru", value: nilai?.nilai_guru, unit: "/100" },
    { label: "Nilai Laporan", value: nilai?.nilai_laporan, unit: "/100" },
  ];

  return (
    <Screen refreshing={isRefetching} onRefresh={refetch}>
      {isLoading ? (
        <Text style={styles.loading}>Memuat...</Text>
      ) : !nilai ? (
        <EmptyState text="Nilai belum tersedia. Menunggu penilaian dari instruktur & guru." />
      ) : (
        <>
          <Card style={styles.hero}>
            <Text style={styles.heroLabel}>Nilai Akhir</Text>
            <Text style={styles.heroValue}>{nilai.nilai_akhir ?? "-"}</Text>
            <Text style={styles.heroHint}>
              {nilai.nilai_akhir == null
                ? "Komponen penilaian belum lengkap"
                : "Skala 0 - 100"}
            </Text>
          </Card>

          <Card style={styles.list}>
            {komponen.map((k) => (
              <View key={k.label} style={styles.row}>
                <Text style={styles.rowLabel}>{k.label}</Text>
                <Text style={styles.rowValue}>
                  {k.value == null ? "-" : `${k.value}${k.unit}`}
                </Text>
              </View>
            ))}
          </Card>

          {nilai.catatan_rekomendasi ? (
            <Card style={styles.note}>
              <Text style={styles.noteLabel}>Catatan Instruktur</Text>
              <Text style={styles.noteBody}>{nilai.catatan_rekomendasi}</Text>
            </Card>
          ) : null}

          {nilai.catatan_guru ? (
            <Card style={styles.note}>
              <Text style={styles.noteLabel}>Catatan Guru</Text>
              <Text style={styles.noteBody}>{nilai.catatan_guru}</Text>
            </Card>
          ) : null}

          <Button title="Cetak PDF Nilai" variant="outline" onPress={cetak} />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: { fontFamily: fonts.regular, color: colors.muted },
  hero: { backgroundColor: colors.primary, alignItems: "center", gap: 2 },
  heroLabel: { fontFamily: fonts.medium, fontSize: 13, color: "#dbe4ff" },
  heroValue: { fontFamily: fonts.bold, fontSize: 40, color: "#ffffff" },
  heroHint: { fontFamily: fonts.regular, fontSize: 12, color: "#dbe4ff" },
  list: { gap: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLabel: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  rowValue: { fontFamily: fonts.semibold, fontSize: 14, color: colors.primary },
  note: { gap: 2 },
  noteLabel: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.primary,
  },
  noteBody: { fontFamily: fonts.regular, fontSize: 13, color: colors.text },
});
