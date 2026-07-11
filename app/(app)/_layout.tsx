import React from 'react';
import { Tabs } from 'expo-router';
import { colors, fonts } from '../../src/theme';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.white },
        headerTitleStyle: { fontFamily: fonts.semibold, color: colors.text },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedLight,
        tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 11 },
        tabBarStyle: { borderTopColor: colors.borderSoft, height: 60, paddingBottom: 8 },
      }}
    >
      <Tabs.Screen name="dashboard" options= title: 'Dashboard'  />
      <Tabs.Screen name="jurnal/index" options= title: 'Jurnal'  />
      <Tabs.Screen name="absensi/index" options= title: 'Absensi'  />
      <Tabs.Screen name="profil" options= title: 'Profil'  />
      {/* Halaman form disembunyikan dari tab bar */}
      <Tabs.Screen name="jurnal/tambah" options= href: null, title: 'Tambah Jurnal'  />
      <Tabs.Screen name="absensi/tambah" options= href: null, title: 'Tambah Absensi'  />
    </Tabs>
  );
}