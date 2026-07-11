import { Tabs } from "expo-router";
import React from "react";
import { colors, fonts } from "../../src/theme";

const screenOptions = {
  headerStyle: { backgroundColor: colors.white },
  headerTitleStyle: { fontFamily: fonts.semibold, color: colors.text },
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.mutedLight,
  tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 11 },
  tabBarStyle: {
    borderTopColor: colors.borderSoft,
    height: 60,
    paddingBottom: 8,
  },
};

const optDashboard = { title: "Dashboard" };
const optJurnal = { title: "Jurnal" };
const optAbsensi = { title: "Absensi" };
const optProfil = { title: "Profil" };
const optHidden = { href: null };

export default function AppLayout() {
  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen name="dashboard" options={optDashboard} />
      <Tabs.Screen name="jurnal/index" options={optJurnal} />
      <Tabs.Screen name="absensi/index" options={optAbsensi} />
      <Tabs.Screen name="profil" options={optProfil} />
      <Tabs.Screen name="jurnal/tambah" options={optHidden} />
      <Tabs.Screen name="absensi/tambah" options={optHidden} />
    </Tabs>
  );
}
