import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { getApiError } from "../../../src/api/client";
import type { Catatan } from "../../../src/api/services";
import { guruApi, instrukturApi, siswaApi } from "../../../src/api/services";
import { useAuth } from "../../../src/auth/AuthContext";
import { Badge } from "../../../src/components/Badge";
import { Button } from "../../../src/components/Button";
import { Card } from "../../../src/components/Card";
import { EmptyState } from "../../../src/components/EmptyState";
import { Screen } from "../../../src/components/Screen";
import { TextField } from "../../../src/components/TextField";
import { colors, fonts } from "../../../src/theme";

export default function CatatanDetail() {
  const router = useRouter();
  const qc = useQueryClient();
  const { user } = useAuth();
  const role = user?.role;
  const isSiswa = role === "siswa_pkl";
  const isGuru = role === "guru_pembimbing";
  const isInstruktur = role === "instruktur_industri";

  const params = useLocalSearchParams<{ id: string }>();
  const catatanId = Number(params.id);

  const { data } = useQuery({
    queryKey: ["catatan", role],
    queryFn: () =>
      isGuru
        ? guruApi.catatan()
        : isSiswa
          ? siswaApi.catatanList()
          : instrukturApi.catatanList(),
  });
  const items: Catatan[] = data?.data ?? [];
  const current = items.find((c) => c.id === catatanId);

  const [namaPekerjaan, setNamaPekerjaan] = useState("");
  const [perencanaan, setPerencanaan] = useState("");
  const [pelaksanaan, setPelaksanaan] = useState("");
  const [komentar, setKomentar] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (current) {
      setNamaPekerjaan(current.nama_pekerjaan);
      setPerencanaan(current.perencanaan_kegiatan);
      setPelaksanaan(current.pelaksanaan_kegiatan);
      setKomentar(current.catatan_instruktur ?? "");
    }
  }, [current?.id]);

  const refresh = () => qc.invalidateQueries({ queryKey: ["catatan"] });

  const simpanSiswa = async () => {
    if (!namaPekerjaan || !perencanaan || !pelaksanaan) {
      Alert.alert("Validasi", "Semua kolom wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      await siswaApi.catatanUpdate(catatanId, {
        nama_pekerjaan: namaPekerjaan,
        perencanaan_kegiatan: perencanaan,
        pelaksanaan_kegiatan: pelaksanaan,
      });
      await refresh();
      Alert.alert("Berhasil", "Catatan diperbarui.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert("Gagal", getApiError(e));
    } finally {
      setLoading(false);
    }
  };

  const hapusSiswa = () => {
    Alert.alert("Hapus Catatan", "Yakin ingin menghapus?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            await siswaApi.catatanDelete(catatanId);
            await refresh();
            router.back();
          } catch (e) {
            Alert.alert("Gagal", getApiError(e));
          }
        },
      },
    ]);
  };

  const ubahStatus = async (approved: boolean) => {
    setLoading(true);
    try {
      await instrukturApi.catatanApprove(catatanId, approved);
      await refresh();
      Alert.alert(
        "Berhasil",
        approved ? "Catatan disetujui." : "Persetujuan dibatalkan.",
      );
    } catch (e) {
      Alert.alert("Gagal", getApiError(e));
    } finally {
      setLoading(false);
    }
  };

  const simpanKomentar = async () => {
    if (!komentar) {
      Alert.alert("Validasi", "Komentar tidak boleh kosong.");
      return;
    }
    setLoading(true);
    try {
      await instrukturApi.catatanKomentar(catatanId, komentar);
      await refresh();
      Alert.alert("Berhasil", "Komentar tersimpan.");
    } catch (e) {
      Alert.alert("Gagal", getApiError(e));
    } finally {
      setLoading(false);
    }
  };

  if (!current) {
    return (
      <Screen>
        <EmptyState text="Catatan tidak ditemukan." />
      </Screen>
    );
  }

  // ===== SISWA: edit =====
  if (isSiswa) {
    return (
      <Screen>
        <Card style={styles.form}>
          <TextField
            label="Nama Pekerjaan"
            value={namaPekerjaan}
            onChangeText={setNamaPekerjaan}
          />
          <TextField
            label="Perencanaan Kegiatan"
            value={perencanaan}
            onChangeText={setPerencanaan}
            multiline
            style={styles.textarea}
          />
          <TextField
            label="Pelaksanaan Kegiatan"
            value={pelaksanaan}
            onChangeText={setPelaksanaan}
            multiline
            style={styles.textarea}
          />
        </Card>
        <Button
          title="Simpan Perubahan"
          variant="success"
          onPress={simpanSiswa}
          loading={loading}
        />
        <Button title="Hapus Catatan" variant="outline" onPress={hapusSiswa} />
      </Screen>
    );
  }

  // ===== GURU (baca) / INSTRUKTUR (tinjau) =====
  return (
    <Screen>
      <Card style={styles.head}>
        <View style={styles.row}>
          <Text style={styles.title}>{current.nama_pekerjaan}</Text>
          <Badge status={current.is_approved ? "disetujui" : "pending"} />
        </View>
        <Text style={styles.siswa}>
          {current.siswa?.name ?? "-"} · {current.siswa?.nisn ?? "-"}
        </Text>
        <Text style={styles.label}>Perencanaan</Text>
        <Text style={styles.body}>{current.perencanaan_kegiatan}</Text>
        <Text style={styles.label}>Pelaksanaan</Text>
        <Text style={styles.body}>{current.pelaksanaan_kegiatan}</Text>
      </Card>

      {isInstruktur ? (
        <Card style={styles.form}>
          <Text style={styles.formTitle}>Tinjau Catatan</Text>
          {current.is_approved ? (
            <Button
              title="Batalkan Persetujuan"
              variant="outline"
              onPress={() => ubahStatus(false)}
              loading={loading}
            />
          ) : (
            <Button
              title="Setujui Catatan"
              variant="success"
              onPress={() => ubahStatus(true)}
              loading={loading}
            />
          )}
          <TextField
            label="Komentar / Catatan Instruktur"
            value={komentar}
            onChangeText={setKomentar}
            multiline
            style={styles.textarea}
          />
          <Button
            title="Simpan Komentar"
            onPress={simpanKomentar}
            loading={loading}
          />
        </Card>
      ) : current.catatan_instruktur ? (
        <Card style={styles.note}>
          <Text style={styles.noteLabel}>Catatan Instruktur</Text>
          <Text style={styles.noteBody}>{current.catatan_instruktur}</Text>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { gap: 12 },
  head: { gap: 4 },
  note: { gap: 2, backgroundColor: colors.bgSubtle },
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
  siswa: { fontFamily: fonts.medium, fontSize: 13, color: colors.primary },
  label: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.mutedLight,
    marginTop: 4,
  },
  body: { fontFamily: fonts.regular, fontSize: 14, color: colors.text },
  formTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.text },
  noteLabel: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.primary,
  },
  noteBody: { fontFamily: fonts.regular, fontSize: 13, color: colors.text },
  textarea: { height: 100, textAlignVertical: "top", paddingTop: 10 },
});
