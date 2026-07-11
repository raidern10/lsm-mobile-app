import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Screen } from '../../src/components/Screen';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { useAuth } from '../../src/auth/AuthContext';
import { colors, fonts } from '../../src/theme';

export default function Profil() {
  const { user, signOut } = useAuth();
  return (
    <Screen>
      <Card style= gap: 4 >
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.meta}>Role: {user?.role}</Text>
        {user?.email ? <Text style={styles.meta}>Email: {user.email}</Text> : null}
      </Card>
      <Button title="Keluar" onPress={signOut} />
    </Screen>
  );
}
const styles = StyleSheet.create({
  name: { fontFamily: fonts.bold, fontSize: 20, color: colors.text },
  meta: { fontFamily: fonts.regular, color: colors.muted, fontSize: 14 },
});