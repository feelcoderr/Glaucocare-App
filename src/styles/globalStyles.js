import { StyleSheet } from "react-native";
import { colors } from "./colors";
import { typography } from "./typography";

export const globalStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },

  // Layout Styles
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  spaceBetween: {
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  column: {
    flexDirection: "column",
  },

  // Padding & Margin
  padding: {
    padding: 16,
  },
  paddingHorizontal: {
    paddingHorizontal: 16,
  },
  paddingVertical: {
    paddingVertical: 16,
  },
  margin: {
    margin: 16,
  },
  marginHorizontal: {
    marginHorizontal: 16,
  },
  marginVertical: {
    marginVertical: 16,
  },

  // Typography Styles
  heading1: {
    fontSize: typography.fontSize.heading1.fontSize,
    lineHeight: typography.fontSize.heading1.lineHeight,
    fontWeight: typography.fontSize.heading1.fontWeight,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.bold,
  },
  heading2: {
    fontSize: typography.fontSize.heading2.fontSize,
    lineHeight: typography.fontSize.heading2.lineHeight,
    fontWeight: typography.fontSize.heading2.fontWeight,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.semiBold,
  },
  heading3: {
    fontSize: typography.fontSize.heading3.fontSize,
    lineHeight: typography.fontSize.heading3.lineHeight,
    fontWeight: typography.fontSize.heading3.fontWeight,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.semiBold,
  },
  bodyText: {
    fontSize: typography.fontSize.bodyRegular.fontSize,
    lineHeight: typography.fontSize.bodyRegular.lineHeight,
    fontWeight: typography.fontSize.bodyRegular.fontWeight,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.regular,
  },
  bodySmall: {
    fontSize: typography.fontSize.bodySmall.fontSize,
    lineHeight: typography.fontSize.bodySmall.lineHeight,
    fontWeight: typography.fontSize.bodySmall.fontWeight,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.regular,
  },

  // Card Styles
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  // Button Base Styles
  buttonBase: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48, // Accessibility requirement
  },

  // Input Base Styles
  inputBase: {
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: typography.fontSize.bodyRegular.fontSize,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    backgroundColor: colors.white,
    minHeight: 48, // Accessibility requirement
  },

  // Shadow Styles
  cardShadow: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonShadow: {
    shadowColor: colors.primaryDark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
});
