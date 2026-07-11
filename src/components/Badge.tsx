import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { fonts, radius, statusColor } from "../theme";

export function Badge({ status }: { status?: string }) {
  const c = statusColor(status);
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.txt, { color: c.fg }]}>{status || "-"}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    alignSelf: "flex-start",
  },
  txt: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    textTransform: "capitalize",
  },
});
