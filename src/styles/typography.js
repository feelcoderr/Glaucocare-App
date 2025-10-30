export const typography = {
  // Font Families
  fontFamily: {
    light: "Poppins_300Light",
    regular: "Poppins_400Regular",
    medium: "Poppins_500Medium",
    semiBold: "Poppins_600SemiBold",
    bold: "Poppins_700Bold",
  },

  // Font Sizes and Line Heights
  fontSize: {
    // Headings (based on your design spec)
    heading1: { fontSize: 24, lineHeight: 32, fontWeight: "700" }, // Bold
    heading2: { fontSize: 21, lineHeight: 28, fontWeight: "600" }, // SemiBold
    heading3: { fontSize: 18, lineHeight: 24, fontWeight: "600" }, // SemiBold
    heading4: { fontSize: 16, lineHeight: 22, fontWeight: "600" }, // SemiBold
    heading5: { fontSize: 14, lineHeight: 20, fontWeight: "600" }, // SemiBold

    // Body Text
    bodyRegular: { fontSize: 16, lineHeight: 24, fontWeight: "400" }, // Regular (minimum for accessibility)
    bodySmall: { fontSize: 14, lineHeight: 20, fontWeight: "400" }, // Regular
    bodyExtraSmall: { fontSize: 12, lineHeight: 18, fontWeight: "400" }, // Regular

    // UI Elements
    button: { fontSize: 16, lineHeight: 20, fontWeight: "600" }, // SemiBold
    caption: { fontSize: 12, lineHeight: 16, fontWeight: "400" }, // Regular
    label: { fontSize: 14, lineHeight: 20, fontWeight: "500" }, // Medium
  },
};
