/**
 * DeviceDetailScreen Styles
 * Styling for device connection and data viewing
 */

import { StyleSheet } from "react-native";
import { COLORS, SPACING, FONTS } from "../../utils/constants";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray.light,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: "bold",
    color: COLORS.text.primary,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.lg,
  },
  statusText: {
    marginLeft: SPACING.md,
    fontSize: FONTS.sizes.md,
    color: COLORS.text.secondary,
  },
  successMessage: {
    backgroundColor: COLORS.success,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.lg,
  },
  successText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: "600",
    textAlign: "center",
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray.light,
  },
  infoLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text.secondary,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text.primary,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  dataContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: SPACING.md,
    marginTop: SPACING.md,
    maxHeight: 200,
  },
  dataText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.primary,
    fontFamily: "monospace",
  },
  buttonContainer: {
    gap: SPACING.md,
    marginVertical: SPACING.lg,
  },
  scrollContainer: {
    flexGrow: 1,
  },
});
