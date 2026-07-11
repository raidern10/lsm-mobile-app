import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Screen } from '../src/components/Screen';
import { Card } from '../src/components/Card';
import { TextField } from '../src/components/TextField';
import { Button } from '../src/components/Button';
import { useAuth } from '../src/auth/AuthContext';
import { getApiError } from '../src/api/client';
import { colors, fonts, spacing } from '../src/theme';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!login || !password) return Alert.alert('Lengkapi data', 'Isi login dan password.');
    setLoading(true);
    try { await signIn(login.trim(), password); }
    catch (e) { Alert.alert('Login gagal', getApiError(e)); }
    finally { setLoading(false); }
  };

  return (
    <Screen scroll={false}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style= flex: 1, justifyContent: 'center' >
        <View style={styles.header}>
          <Text style={styles.brand}>Sistem PKL</Text>
          <Text style={styles.subtitle}>Monitoring Praktik Kerja Lapangan</Text>
        </View>
        <Card style= gap: spacing.md >
          <TextField label="NISN / NIP / Email" placeholder="Masukkan login kamu" autoCapitalize="none" value={login} onChangeText={setLogin} />
          <TextField label="Password" placeholder="••••••••" secureTextEntry value={password} onChangeText={setPassword} />
          <Button title="Masuk" onPress={onSubmit} loading={loading} />
        </Card>
      </KeyboardAvoidingView>
    </Screen>
  );
}
const styles = StyleSheet.create({
  header: { alignItems: 'center', marginBottom: spacing.xl },
  brand: { fontFamily: fonts.bold, fontSize: 28, color: colors.primary },
  subtitle: { fontFamily: fonts.regular, color: colors.muted, marginTop: 4 },
});