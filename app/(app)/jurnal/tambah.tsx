import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Screen } from '../../../src/components/Screen';
import { Card } from '../../../src/components/Card';
import { TextField } from '../../../src/components/TextField';
import { Button } from '../../../src/components/Button';
import { jurnalApi, JurnalItem } from '../../../src/api/services';
import { getApiError } from '../../../src/api/client';
import { colors, fonts } from '../../../src/theme';

export default function TambahJurnal() {
  const router = useRouter();
  const qc = useQueryClient();
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState<JurnalItem[]>([{ unit_kerja: '', uraian: '' }]);
  const [loading, setLoading] = useState(false);

  const updateItem = (i: number, key: keyof JurnalItem, val: string) =>
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, [key]: val } : it)));
  const addItem = () => setItems((p) => [...p, { unit_kerja: '', uraian: '' }]);
  const removeItem = (i: number) => setItems((p) => p.filter((_, idx) => idx !== i));

  const submit = async () => {
    if (!tanggal) return Alert.alert('Validasi', 'Tanggal wajib diisi.');
    if (items.some((it) => !it.unit_kerja || !it.uraian))
      return Alert.alert('Validasi', 'Semua unit kerja & uraian wajib diisi.');
    setLoading(true);
    try {
      await jurnalApi.create({ hari_tanggal: tanggal, items });
      await qc.invalidateQueries({ queryKey: ['jurnals'] });
      Alert.alert('Berhasil', 'Jurnal tersimpan.', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (e) { Alert.alert('Gagal', getApiError(e)); }
    finally { setLoading(false); }
  };

  return (
    <Screen>
      <Card style= gap: 12 >
        <TextField label="Hari / Tanggal (YYYY-MM-DD)" value={tanggal} onChangeText={setTanggal} />
      </Card>
      {items.map((it, i) => (
        <Card key={i} style= gap: 8 >
          <View style={styles.row}>
            <Text style={styles.itemTitle}>Kegiatan #{i + 1}</Text>
            {items.length > 1 && (
              <Pressable onPress={() => removeItem(i)}><Text style={styles.remove}>Hapus</Text></Pressable>
            )}
          </View>
          <TextField label="Unit Kerja" value={it.unit_kerja} onChangeText={(v) => updateItem(i, 'unit_kerja', v)} />
          <TextField label="Uraian Kegiatan" value={it.uraian} multiline style= height: 90, textAlignVertical: 'top', paddingTop: 10  onChangeText={(v) => updateItem(i, 'uraian', v)} />
        </Card>
      ))}
      <Button title="+ Tambah Kegiatan" variant="outline" onPress={addItem} />
      <Button title="Simpan Jurnal" variant="success" onPress={submit} loading={loading} />
    </Screen>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTitle: { fontFamily: fonts.semibold, color: colors.text },
  remove: { fontFamily: fonts.medium, color: colors.danger, fontSize: 13 },
});