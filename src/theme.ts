export const colors = {
  primary: "#0047d6",
  primaryAccent: "#0052ff",
  success: "#05b169",
  text: "#1e293b",
  muted: "#5b616e",
  mutedLight: "#7c828a",
  bg: "#ffffff",
  bgSubtle: "#f8fafc",
  border: "#dbe4ff",
  borderSoft: "#e2e8f0",
  danger: "#e11d48",
  warning: "#d97706",
  white: "#ffffff",
};

export const radius = { md: 12, lg: 16, xl: 20, full: 999 };
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const shadow = {
  shadowColor: "#0047d6",
  shadowOpacity: 0.06,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
};

export const fonts = {
  regular: "Figtree_400Regular",
  medium: "Figtree_500Medium",
  semibold: "Figtree_600SemiBold",
  bold: "Figtree_700Bold",
};

export const statusColor = (status?: string) => {
  const s = (status || "").toLowerCase();
  if (["disetujui", "hadir", "approved", "selesai"].some((k) => s.includes(k)))
    return { bg: "#e6f7ef", fg: colors.success };
  if (["pending", "menunggu", "izin"].some((k) => s.includes(k)))
    return { bg: "#fff7e6", fg: colors.warning };
  if (
    ["ditolak", "batal", "alpha", "alfa", "rejected"].some((k) => s.includes(k))
  )
    return { bg: "#fdecef", fg: colors.danger };
  return { bg: colors.bgSubtle, fg: colors.muted };
};
