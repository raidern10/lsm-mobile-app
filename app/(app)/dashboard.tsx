import React from "react";
import { StyleSheet, Text } from "react-native";
import { useAuth } from "../../src/auth/AuthContext";
import { Card } from "../../src/components/Card";
import { Screen } from "../../src/components/Screen";
import { fonts } from "../../src/theme";

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <Screen>
      <Card style={styles.hero}>
        <Text style={styles.hi}>Halo, {user?.name} 👋</Text>
        <Text style={styles.role}>{user?.role}</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: "#0047d6" },
  hi: { fontFamily: fonts.bold, fontSize: 20, color: "#fff" },
  role: { fontFamily: fonts.medium, color: "#dbe4ff", marginTop: 4 },
});
