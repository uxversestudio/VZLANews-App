import { StyleSheet } from "react-native";

export const colors = {
  primary: "#2f366a",
  blueVogue: "#192E51",
  lynch: "#607698",
  athensGray: "#E9E9F0",
  seen: "#50B9E4",
  white: "#FFFFFF",
  secondary: "#6B7278",
  dark: "#0B141B",
  darkSecondary: "#242B31",
  gray1: "#FCFCFC",
  gray2: "#FAFAFA",
  gray3: "#F7F7F7",
  gray4: "#F5F5F5",
  gray5: "#F2F2F2",
  gray6: "#F0F0F0",
  gray7: "#EDEDED",
  gray8: "#EBEBEB",
  gray9: "#E8E8E8",
  gray10: "#E5E5E5",
  gray25: "#BFBFBF",
  gray30: "#B3B3B3",
  gray40: "#999999",
  gray50: "#7F7F7F",
  gray75: "#404040",
  gray90: "#000000e6",
};

const fontStyles = {
  black: "Montserrat_900Black",
  bold: "Montserrat_700Bold",
  semibold: "Montserrat_600SemiBold",
  medium: "Montserrat_500Medium",
  regular: "Montserrat_400Regular",
  light: "Montserrat_300Light",
};

export const fonts = StyleSheet.create({
  //Font Weights
  black: {
    fontFamily: fontStyles.black,
    includeFontPadding: false,
  },
  bold: {
    fontFamily: fontStyles.bold,
    includeFontPadding: false,
  },
  semibold: {
    fontFamily: fontStyles.semibold,
    includeFontPadding: false,
  },
  light: {
    fontFamily: fontStyles.light,
    includeFontPadding: false,
  },
  regular: {
    fontFamily: fontStyles.regular,
    includeFontPadding: false,
  },
  medium: {
    fontFamily: fontStyles.medium,
    includeFontPadding: false,
  },
});

export const tStyles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  selfcenter: {
    alignSelf: "center",
  },
  selfleft: {
    alignSelf: "flex-start",
  },
  selfright: {
    alignSelf: "flex-end",
  },
  spacedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  wrap: {
    flexWrap: "wrap",
  },
  centerx: {
    justifyContent: "center",
  },
  centery: {
    alignItems: "center",
  },
  startx: {
    justifyContent: "flex-start",
  },
  starty: {
    alignItems: "flex-start",
  },
  endx: {
    justifyContent: "flex-end",
  },
  endy: {
    alignItems: "flex-end",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
});
