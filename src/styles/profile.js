import { StyleSheet } from "react-native";
import { colors, fonts, tStyles } from "../common/theme";

const lightStyles = StyleSheet.create({
  container: {
    ...tStyles.flex1,
    backgroundColor: colors.white,
    position: "relative",
  },
  userDetailContainer: {
    ...tStyles.row,
    paddingHorizontal: 15,
    position: "absolute",
    zIndex: 2,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileName: {
    ...fonts.bold,
  },
  profileUsername: {
    ...fonts.medium,
    fontSize: 12,
    color: colors.gray40,
    marginTop: 1,
  },
  userBioText: {
    ...fonts.medium,
    color: colors.lynch,
    fontSize: 12,
    marginTop: 15,
    lineHeight: 17,
  },
  linkText: {
    color: colors.primary,
    ...fonts.semibold,
    fontSize: 11,
    marginLeft: 5,
  },
});

const darkStyles = StyleSheet.create({
  container: {
    ...lightStyles.container,
  },
  userDetailContainer: {
    ...lightStyles.userDetailContainer,
  },
  userAvatar: {
    ...lightStyles.userAvatar,
  },
  profileName: {
    ...lightStyles.profileName,
  },
  profileUsername: {
    ...lightStyles.profileUsername,
  },
  userBioText: {
    ...lightStyles.userBioText,
  },
  linkText: {
    ...lightStyles.linkText,
  },
});

export const getStyles = (mode) => {
  if (mode == "light") {
    return lightStyles;
  } else {
    return darkStyles;
  }
};
