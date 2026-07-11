import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { getApiError } from "../../../src/api/client";
import { instrukturApi, jurnalApi } from "../../../src/api/services";
import { useAuth } from "../../../src/auth/AuthContext";
import { Badge } from "../../../src/components/Badge";
import { Button } from "../../../src/components/Button";
import { Card } from "../../../src/components/Card";
import { EmptyState } from "../../../src/components/EmptyState";
import { Screen } from "../../../src/components/Screen";
import { TextField } from "../../../src/components/TextField";
import { colors, fonts } from "../../../src/theme";

const STATUS_OPSI = [
  { key: "disetujui", label: "Setujui" },
  { key: "revisi", label: "Revisi" },
  { key: "pending", label: "Pending" },
];

export default function JurnalDetail() {
  const router = useRouter();
  const qc = useQueryClient();
  const { user } = useAuth();
  const isInstruktur = user?.role === "instruktur_industri";
  const params = useLocalSearchParams<{ id: string }>();
  const jurnalId = Number(params.id);

  const { data, isLoading } = useQuery({
    queryKey: ["jurnal", jurnalId],
    queryFn: () => jurnalApi.show(jurnalId),
  });
  const jurnal: any = data?.data ?? null;

  const [status, setStatus] = useState("disetujui");
  const [catatan, setCatatan] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (jurnal) {
      setStatus(jurnal.status_persetujuan ?? "disetujui");
      setCatatan(jurnal.catatan_instruktur ?? "");
    }
  }, [jurnal?.id]);

  const simpan = async () => {
    setLoading(true);
    try {
      await instrukturApi.jurnalUpdate(jurnalId, {
        status_persetujuan: status as "pending" | "disetujui" | "revisi",
        catatan_instruktur: catatan || null,
      });
      await qc.invalidateQueries({ queryKey: ["jurnals"] });
      await qc.invalidateQueries({ queryKey: ["jurnal", jurnalId] });
      Alert.alert("Berhasil", "Status jurnal diperbarui.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert("Gagal", getApiError(e));
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Screen>
        <Text style={styles.loading}>Memuat...</Text>
      </Screen>
    );
  }
  if (!jurnal) {
    return (
      <Screen>
        <EmptyState text="Jurnal tidak ditemukan." />
      </Screen>
    );
  }

  return (
    <Screen>
      <Card style={styles.head}>
        <View style={styles.row}>
          <Text style={styles.date}>{jurnal.hari_tanggal}</Text>
          <Badge status={jurnal.status_persetujuan} />
        </View>
        <Text style={styles.siswa}>
          {jurnal.siswa?.name ?? "-"} · {jurnal.siswa?.nisn ?? "-"}
        </Text>
      </Card>

      {(jurnal.items ?? []).map((it: any, i: number) => (
        <Card key={it.id ?? i} style={styles.item}>
          <Text style={styles.itemTitle}>Kegiatan #{i + 1}</Text>
          <Text style={styles.label}>Unit Kerja</Text>
          <Text style={styles.body}>{it.unit_kerja ?? "-"}</Text>
          <Text style={styles.label}>Uraian</Text>
          <Text style={styles.body}>{it.uraian ?? "-"}</Text>
        </Card>
      ))}

      {isInstruktur ? (
        <Card style={styles.form}>
          <Text style={styles.formTitle}>Tinjau Jurnal</Text>
          <View style={styles.chips}>
            {STATUS_OPSI.map((o) => {
              const active = status === o.key;
              return (
                <Pressable
                  key={o.key}
                  onPress={() => setStatus(o.key)}
                  style={[styles.chip, active ? styles.chipOn : styles.chipOff]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      active ? styles.chipTextOn : styles.chipTextOff,
                    ]}
                  >
                    {o.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <TextField
            label="Catatan untuk siswa (opsional)"
            value={catatan}
            onChangeText={setCatatan}
            multiline
            style={styles.textarea}
          />
          <Button
            title="Simpan Penilaian"
            variant="success"
            onPress={simpan}
            loading={loading}
          />
        </Card>
      ) : jurnal.catatan_instruktur ? (
        <Card style={styles.note}>
          <Text style={styles.noteLabel}>Catatan Instruktur</Text>
          <Text style={styles.noteBody}>{jurnal.catatan_instruktur}</Text>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { gap: 4 },
  item: { gap: 2 },
  form: { gap: 10 },
  note: { gap: 2, backgroundColor: colors.bgSubtle },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  siswa: { fontFamily: fonts.medium, fontSize: 13, color: colors.primary },
  itemTitle: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text },
  label: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.mutedLight,
    marginTop: 4,
  },
  body: { fontFamily: fonts.regular, fontSize: 14, color: colors.text },
  noteLabel: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.primary,
  },
  noteBody: { fontFamily: fonts.regular, fontSize: 13, color: colors.text },
  formTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.text },
  chips: { flexDirection: "row", gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipOff: { backgroundColor: colors.white, borderColor: colors.border },
  chipText: { fontFamily: fonts.semibold, fontSize: 13 },
  chipTextOn: { color: colors.white },
  chipTextOff: { color: colors.muted },
  textarea: { height: 90, textAlignVertical: "top", paddingTop: 10 },
  loading: { fontFamily: fonts.regular, color: colors.muted },
});
