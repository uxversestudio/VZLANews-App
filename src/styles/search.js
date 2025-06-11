import { StyleSheet } from "react-native";
import { colors, fonts, tStyles } from "../common/theme";

const lightStyles = StyleSheet.create({
  container: {
    ...tStyles.flex1,
    backgroundColor: colors.white,
  },
  addBookmarkBtn: {
    backgroundColor: colors.gray5,
    ...tStyles.centerx,
    ...tStyles.centery,
    borderRadius: 40,
  },
  addBookmarkText: {
    ...fonts.regular,
    fontSize: 35,
    color: colors.primary,
  },
});

const darkStyles = StyleSheet.create({
  container: {
    ...lightStyles.container,
  },
  addBookmarkBtn: {
    ...lightStyles.addBookmarkBtn,
  },
  addBookmarkText: {
    ...lightStyles.addBookmarkText,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    padding: 0,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginTop: 10,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginTop: 10,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#ccc",
  },
  errorContainer: {
    margin: 15,
    padding: 15,
    backgroundColor: "#fee2e2",
    borderRadius: 8,
  },
  errorText: {
    color: "#dc2626",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: "#1e3a8a",
    borderRadius: 4,
    alignSelf: "center",
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  emptyContainer: {
    padding: 30,
    alignItems: "center",
  },
  emptyText: {
    color: "#ccc",
    textAlign: "center",
  },
  container: {
    flex: 1,
  },
});

StyleSheet.create({
  container: {
    flex: 1,
  },
});

export const getStyles = (mode) => {
  if (mode == "light") {
    return lightStyles;
  } else {
    return darkStyles;
  }
};
