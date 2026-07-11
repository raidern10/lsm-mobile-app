import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Screen } from '../../src/components/Screen';
import { Card } from '../../src/components/Card';
import { useAuth } from '../../src/auth/AuthContext';
import { fonts } from '../../src/theme';

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <Screen>
      <Card style= backgroundColor: '#0047d6' >
        <Text style={styles.hi}>Halo, {user?.name} 👋</Text>
        <Text style={styles.role}>{user?.role}</Text>
      </Card>
    </Screen>
  );
}
const styles = StyleSheet.create({
  hi: { fontFamily: fonts.bold, fontSize: 20, color: '#fff' },
  role: { fontFamily: fonts.medium, color: '#dbe4ff', marginTop: 4 },
});