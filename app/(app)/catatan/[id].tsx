import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { getApiError } from "../../../src/api/client";
import type { Catatan } from "../../../src/api/services";
import { siswaApi } from "../../../src/api/services";
import { Button } from "../../../src/components/Button";
import { Card } from "../../../src/components/Card";
import { Screen } from "../../../src/components/Screen";
import { TextField } from "../../../src/components/TextField";

export default function EditCatatan() {
  const router = useRouter();
  const qc = useQueryClient();
  const params = useLocalSearchParams<{ id: string }>();
  const catatanId = Number(params.id);

  const { data } = useQuery({
    queryKey: ["catatan"],
    queryFn: () => siswaApi.catatanList(),
  });
  const items: Catatan[] = data?.data ?? [];
  const current = items.find((c) => c.id === catatanId);

  const [namaPekerjaan, setNamaPekerjaan] = useState("");
  const [perencanaan, setPerencanaan] = useState("");
  const [pelaksanaan, setPelaksanaan] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (current) {
      setNamaPekerjaan(current.nama_pekerjaan);
      setPerencanaan(current.perencanaan_kegiatan);
      setPelaksanaan(current.pelaksanaan_kegiatan);
    }
  }, [current?.id]);

  const submit = async () => {
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
      await qc.invalidateQueries({ queryKey: ["catatan"] });
      Alert.alert("Berhasil", "Catatan diperbarui.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert("Gagal", getApiError(e));
    } finally {
      setLoading(false);
    }
  };

  const hapus = () => {
    Alert.alert("Hapus Catatan", "Yakin ingin menghapus catatan ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            await siswaApi.catatanDelete(catatanId);
            await qc.invalidateQueries({ queryKey: ["catatan"] });
            router.back();
          } catch (e) {
            Alert.alert("Gagal", getApiError(e));
          }
        },
      },
    ]);
  };

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
        onPress={submit}
        loading={loading}
      />
      <Button title="Hapus Catatan" variant="outline" onPress={hapus} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { gap: 12 },
  textarea: { height: 100, textAlignVertical: "top", paddingTop: 10 },
});
