/**
 * HistoryScreen Styles
 * Styling for the history/records display screen
 */

import { StyleSheet } from "react-native";
import { COLORS, FONTS, SPACING } from "../../utils/constants";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingTop: 60,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray.light,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: "bold",
    color: COLORS.text.primary,
  },
  backButton: {
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 18,
    color: "#007AFF",
  },
  refreshButton: {
    padding: SPACING.sm,
  },
  refreshButtonText: {
    fontSize: FONTS.sizes.lg,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  listContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
