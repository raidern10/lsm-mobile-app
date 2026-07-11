import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, spacing } from "../theme";

export function EmptyState({ text = "Belum ada data." }: { text?: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.txt}>{text}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { padding: spacing.xxl, alignItems: "center" },
  txt: { fontFamily: fonts.regular, color: colors.muted, fontSize: 14 },
});
