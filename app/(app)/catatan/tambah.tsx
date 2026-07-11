import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { getApiError } from "../../../src/api/client";
import { siswaApi } from "../../../src/api/services";
import { Button } from "../../../src/components/Button";
import { Card } from "../../../src/components/Card";
import { Screen } from "../../../src/components/Screen";
import { TextField } from "../../../src/components/TextField";

export default function TambahCatatan() {
  const router = useRouter();
  const qc = useQueryClient();
  const [namaPekerjaan, setNamaPekerjaan] = useState("");
  const [perencanaan, setPerencanaan] = useState("");
  const [pelaksanaan, setPelaksanaan] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!namaPekerjaan || !perencanaan || !pelaksanaan) {
      Alert.alert("Validasi", "Semua kolom wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      await siswaApi.catatanCreate({
        nama_pekerjaan: namaPekerjaan,
        perencanaan_kegiatan: perencanaan,
        pelaksanaan_kegiatan: pelaksanaan,
      });
      await qc.invalidateQueries({ queryKey: ["catatan"] });
      Alert.alert("Berhasil", "Catatan tersimpan.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert("Gagal", getApiError(e));
    } finally {
      setLoading(false);
    }
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
        title="Simpan Catatan"
        variant="success"
        onPress={submit}
        loading={loading}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { gap: 12 },
  textarea: { height: 100, textAlignVertical: "top", paddingTop: 10 },
});
