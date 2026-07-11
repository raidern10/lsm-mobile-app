import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Screen } from '../../../src/components/Screen';
import { Card } from '../../../src/components/Card';
import { TextField } from '../../../src/components/TextField';
import { Button } from '../../../src/components/Button';
import { absensiApi } from '../../../src/api/services';
import { getApiError } from '../../../src/api/client';
import { colors, fonts, radius, spacing } from '../../../src/theme';

const STATUS = ['Hadir', 'Izin', 'Sakit', 'Alpha'] as const;

export default function TambahAbsensi() {
  const router = useRouter();
  const qc = useQueryClient();
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<(typeof STATUS)[number]>('Hadir');
  const [jamMasuk, setJamMasuk] = useState('08:00');
  const [jamPulang, setJamPulang] = useState('16:00');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await absensiApi.create({
        tanggal, status,
        jam_masuk: status === 'Hadir' ? jamMasuk : undefined,
        jam_pulang: status === 'Hadir' ? jamPulang : undefined,
      });
      await qc.invalidateQueries({ queryKey: ['absensis'] });
      Alert.alert('Berhasil', 'Absensi tersimpan.', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (e) { Alert.alert('Gagal', getApiError(e)); }
    finally { setLoading(false); }
  };

  return (
    <Screen>
      <Card style= gap: 12 >
        <TextField label="Tanggal (YYYY-MM-DD)" value={tanggal} onChangeText={setTanggal} />
        <View style= gap: 8 >
          <Text style={styles.label}>Status</Text>
          <View style={styles.chips}>
            {STATUS.map((s) => {
              const active = s === status;
              return (
                <Pressable key={s} onPress={() => setStatus(s)}
                  style={[styles.chip, active && { backgroundColor: colors.primary, borderColor: colors.primary }]}>
                  <Text style={[styles.chipTxt, active && { color: colors.white }]}>{s}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        {status === 'Hadir' && (
          <View style= flexDirection: 'row', gap: 12 >
            <View style= flex: 1 ><TextField label="Jam Masuk (H:i)" value={jamMasuk} onChangeText={setJamMasuk} /></View>
            <View style= flex: 1 ><TextField label="Jam Pulang (H:i)" value={jamPulang} onChangeText={setJamPulang} /></View>
          </View>
        )}
        <Button title="Simpan Absensi" variant="success" onPress={submit} loading={loading} />
      </Card>
    </Screen>
  );
}
const styles = StyleSheet.create({
  label: { fontFamily: fonts.medium, color: colors.text, fontSize: 14 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.full, borderWidth: 1, borderColor: colors.borderSoft, backgroundColor: colors.white },
  chipTxt: { fontFamily: fonts.medium, color: colors.text, fontSize: 13 },
});