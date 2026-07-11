import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
} from "react-native";
import { colors, fonts, radius, spacing } from "../theme";

type Props = TextInputProps & { label?: string };

// PERBAIKAN: Menggunakan named export agar sinkron dengan file komponen lainnya
export function TextField({ label, style, ...props }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    // PERBAIKAN: Memanggil gaya objek menggunakan kurung kurawal tunggal {}
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.mutedLight}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[styles.input, focused && styles.inputFocused, style]}
        {...props}
      />
    </View>
  );
}

// PERBAIKAN UTAMA: Objek style dideklarasikan secara valid di dalam StyleSheet.create
const styles = StyleSheet.create({
  wrap: {
    gap: 6,
  },
  label: {
    fontFamily: fonts.medium,
    color: colors.text,
    fontSize: 14,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 48,
    fontFamily: fonts.regular,
    color: colors.text,
    fontSize: 15,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
});
