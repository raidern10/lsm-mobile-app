import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { colors, fonts, radius, spacing } from "../theme";

type Props = {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "success" | "outline";
};

export function Button({
  title,
  onPress,
  loading,
  disabled,
  variant = "primary",
}: Props) {
  const isOutline = variant === "outline";
  const bg =
    variant === "success"
      ? colors.success
      : isOutline
        ? "transparent"
        : colors.primary;
  const fg = isOutline ? colors.primary : colors.white;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        isOutline && { borderWidth: 1.5, borderColor: colors.primary },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <Text style={[styles.txt, { color: fg }]}>{title}</Text>
      )}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  btn: {
    height: 50,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  txt: { fontFamily: fonts.semibold, fontSize: 15 },
});
