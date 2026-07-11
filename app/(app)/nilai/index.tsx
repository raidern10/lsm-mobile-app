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
import type { Nilai } from "../../../src/api/services";
import {
    cetakApi,
    guruApi,
    instrukturApi,
    siswaApi,
} from "../../../src/api/services";
import { useAuth } from "../../../src/auth/AuthContext";
import { Button } from "../../../src/components/Button";
import { Card } from "../../../src/components/Card";
import { EmptyState } from "../../../src/components/EmptyState";
import { Screen } from "../../../src/components/Screen";
import { colors, fonts } from "../../../src/theme";

export default function NilaiScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const role = user?.role;
  const isSiswa = role === "siswa_pkl";
  const isGuru = role === "guru_pembimbing";

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["nilai", role],
    queryFn: () =>
      isSiswa
        ? siswaApi.nilai()
        : isGuru
          ? guruApi.nilaiList()
          : instrukturApi.nilaiList(),
  });

  // ===== SISWA: nilai sendiri =====
  if (isSiswa) {
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

  // ===== GURU / INSTRUKTUR: list nilai siswa =====
  const items: any[] = data?.data ?? [];

  return (
    <Screen refreshing={isRefetching} onRefresh={refetch}>
      {isLoading ? (
        <Text style={styles.loading}>Memuat...</Text>
      ) : items.length === 0 ? (
        <EmptyState text="Belum ada data nilai siswa." />
      ) : (
        items.map((n: any) => (
          <Pressable
            key={n.id}
            onPress={() => router.push(`/(app)/nilai/${n.id}` as Href)}
          >
            <Card style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.siswaName}>{n.siswa?.name ?? "-"}</Text>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreText}>
                    NA: {n.nilai_akhir ?? "-"}
                  </Text>
                </View>
              </View>
              <Text style={styles.meta}>
                NISN: {n.siswa?.nisn ?? "-"} · Rata-rata Instruktur:{" "}
                {n.rata_rata ?? "-"}
              </Text>
            </Card>
          </Pressable>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: { fontFamily: fonts.regular, color: colors.muted },
  hero: {
    backgroundColor: colors.primary,
    alignItems: "center",
    gap: 2,
    padding: 16,
    borderRadius: 12,
  },
  heroLabel: { fontFamily: fonts.medium, fontSize: 13, color: "#dbe4ff" },
  heroValue: { fontFamily: fonts.bold, fontSize: 40, color: "#ffffff" },
  heroHint: { fontFamily: fonts.regular, fontSize: 12, color: "#dbe4ff" },
  list: { gap: 10 },
  card: { gap: 4 },
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
  siswaName: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  scoreBadge: {
    backgroundColor: "#e6f7ef",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  scoreText: { fontFamily: fonts.bold, fontSize: 13, color: "#10b981" },
  meta: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
  },
  note: { gap: 2 },
  noteLabel: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.primary,
  },
  noteBody: { fontFamily: fonts.regular, fontSize: 13, color: colors.text },
});
