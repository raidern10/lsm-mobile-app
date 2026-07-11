import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Screen } from '../../../src/components/Screen';
import { Card } from '../../../src/components/Card';
import { Badge } from '../../../src/components/Badge';
import { Button } from '../../../src/components/Button';
import { EmptyState } from '../../../src/components/EmptyState';
import { absensiApi } from '../../../src/api/services';
import { useAuth } from '../../../src/auth/AuthContext';
import { colors, fonts } from '../../../src/theme';

export default function AbsensiList() {
  const { user } = useAuth();
  const router = useRouter();
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['absensis'], queryFn: () => absensiApi.list(),
  });
  const items = data?.data ?? [];

  return (
    <Screen refreshing={isRefetching} onRefresh={refetch}>
      {user?.role === 'siswa_pkl' && (
        <Button title="+ Isi Absensi Hari Ini" onPress={() => router.push('/(app)/absensi/tambah' as Href)} />
      )}
      {isLoading ? (
        <Text style={styles.loading}>Memuat…</Text>
      ) : items.length === 0 ? (
        <EmptyState text="Belum ada absensi." />
      ) : (
        items.map((a: any) => (
          <Card key={a.id} style= gap: 4 >
            <View style={styles.row}>
              <Text style={styles.date}>{a.tanggal}</Text>
              <Badge status={a.status} />
            </View>
            <Text style={styles.jam}>Masuk: {a.jam_masuk ?? '-'} · Pulang: {a.jam_pulang ?? '-'}</Text>
          </Card>
        ))
      )}
    </Screen>
  );
}
const styles = StyleSheet.create({
  loading: { fontFamily: fonts.regular, color: colors.muted },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { fontFamily: fonts.semibold, color: colors.text, fontSize: 15 },
  jam: { fontFamily: fonts.regular, color: colors.muted, fontSize: 13 },
});