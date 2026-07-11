import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { colors, radius, fonts, spacing } from '../theme';

type Props = TextInputProps & { label?: string };
export function TextField({ label, style, ...props }: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <View style= gap: spacing.xs >
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.mutedLight}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[styles.input, focused && { borderColor: colors.primary }, style]}
        {...props}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  label: { fontFamily: fonts.medium, color: colors.text, fontSize: 14 },
  input: {
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderSoft,
    borderRadius: radius.md, paddingHorizontal: spacing.md, height: 48,
    fontFamily: fonts.regular, color: colors.text, fontSize: 15,
  },
});