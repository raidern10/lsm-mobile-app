import { Tabs } from "expo-router";
import React from "react";

export default function AppLayout() {
  return (
    // PERBAIKAN: screenOptions dan options menggunakan {{ ... }}
    <Tabs
      screenOptions={{ headerShown: true, tabBarStyle: { paddingBottom: 4 } }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarLabel: "Home",
        }}
      />

      <Tabs.Screen
        name="absensi/index"
        options={{
          title: "Absensi",
          tabBarLabel: "Absensi",
        }}
      />

      <Tabs.Screen
        name="jurnal/index"
        options={{
          title: "Jurnal",
          tabBarLabel: "Jurnal",
        }}
      />

      <Tabs.Screen
        name="profil"
        options={{
          title: "Profil",
          tabBarLabel: "Profil",
        }}
      />

      {/* Menyembunyikan halaman 'tambah' dari Bottom Tab Bar tetapi tetap bisa dinavigasikan */}
      <Tabs.Screen
        name="absensi/tambah"
        options={{ href: null, title: "Tambah Absensi" }}
      />
      <Tabs.Screen
        name="jurnal/tambah"
        options={{ href: null, title: "Tambah Jurnal" }}
      />
    </Tabs>
  );
}
