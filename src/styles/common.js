import { StyleSheet } from "react-native";
import { colors, fonts, tStyles } from "../common/theme";

const lightStyles = StyleSheet.create({
  mainBtn: {
    ...tStyles.row,
    ...tStyles.centerx,
    paddingVertical: 18,
    backgroundColor: colors.primary,
    ...tStyles.centery,
    borderRadius: 18,
  },
  mainBtnText: {
    color: colors.white,
    ...fonts.medium,
    fontSize: 13,
  },
  skipBtnText: {
    color: colors.blueVogue,
    ...fonts.medium,
    fontSize: 13,
  },
  secBtn: {
    ...tStyles.row,
    ...tStyles.centerx,
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: colors.gray7,
    ...tStyles.centery,
    borderRadius: 18,
  },
  secBtnText: {
    color: colors.gray50,
    ...fonts.medium,
    fontSize: 13,
  },
  pillBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  pillBtnText: {
    ...fonts.medium,
    fontSize: 10,
    color: colors.white,
  },
  vogueHeading: {
    ...fonts.bold,
    fontSize: 30,
    color: colors.blueVogue,
    marginBottom: 0,
  },
  smallHeadingText: {
    ...fonts.bold,
    fontSize: 18,
    color: colors.blueVogue,
  },
  subHeadingText: {
    ...fonts.semibold,
    fontSize: 12,
    color: colors.gray40,
    marginTop: 5,
  },
  textInputContainer: {
    ...tStyles.spacedRow,
    backgroundColor: colors.gray4,
    borderRadius: 10,
  },
  textInput: {
    ...tStyles.flex1,
    height: 40,
    paddingLeft: 15,
    ...fonts.medium,
    fontSize: 12,
  },
  checkBox: {
    ...tStyles.centerx,
    ...tStyles.centery,
    width: 16,
    height: 16,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  topicItem: {
    ...tStyles.endx,
    width: "100%",
    height: "100%",
  },
  topicItemSelected: {
    ...tStyles.endx,
    width: "100%",
    height: "100%",
    borderWidth: 3,
    borderRadius: 43,
    borderColor: colors.primary,
  },
  topicNameContainer: {
    width: "100%",
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
  },
  topicName: {
    ...fonts.semibold,
    color: colors.white,
  },
  topicSubtitle: {
    ...fonts.medium,
    color: colors.gray10,
    fontSize: 9,
    marginTop: 5,
  },
  centerImageCatContainer: {
    ...tStyles.centerx,
    backgroundColor: colors.gray5,
    borderRadius: 40,
  },
  centerImageCatContainerSel: {
    ...tStyles.centerx,
    backgroundColor: colors.gray5,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  sourceName: {
    ...fonts.semibold,
    color: colors.gray75,
    marginTop: 8,
  },
  newsItemContainer: {
    ...tStyles.row,
    padding: 12,
    backgroundColor: colors.gray5,
    borderRadius: 25,
    marginBottom: 15,
  },
  newsItemImage: {
    width: 92,
    height: "100%",
    minHeight: 105,
    borderRadius: 25,
    marginRight: 15,
  },
  newsMetaText: {
    ...fonts.semibold,
    fontSize: 9,
    color: colors.gray40,
  },
  newsHeadline: {
    marginVertical: 10,
    ...fonts.bold,
    paddingRight: 10,
  },
  bottomTabContainer: {
    ...tStyles.spacedRow,
    backgroundColor: "rgba(255,255,255, 0.9)",
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 15,
    justifyContent: "space-around",
  },
  statsContainer: {
    padding: 20,
    backgroundColor: colors.gray5,
    borderRadius: 20,
    ...tStyles.row,
    justifyContent: "space-around",
  },
  statsText: {
    ...fonts.bold,
    fontSize: 17,
  },
  statsInfoText: {
    ...fonts.medium,
    fontSize: 11,
    color: colors.gray50,
    marginTop: 5,
  },
  userAvatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
  },
  userText: {
    ...fonts.bold,
    fontSize: 15,
  },
  userNameText: {
    ...fonts.semibold,
    fontSize: 11,
    color: colors.gray40,
    marginTop: 2,
  },
  pillContainer: {
    ...tStyles.selfleft,
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 15,
  },
  pillText: {
    ...fonts.medium,
    fontSize: 9,
  },
  sliderNewsContainer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 50,
    paddingTop: 20,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  bookmarkHolder: {
    paddingHorizontal: 7,
    paddingVertical: 9,
    borderRadius: 8,
    alignSelf: "flex-end",
    marginRight: 20,
    marginTop: 20,
  },
  sliderNewsCategory: {
    backgroundColor: colors.lynch,
    ...tStyles.selfleft,
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 15,
    marginBottom: 13,
  },
  sliderNewsCategoryText: {
    ...fonts.medium,
    color: colors.white,
    fontSize: 9,
  },
  sliderHeadline: {
    ...fonts.bold,
    color: colors.white,
    fontSize: 22,
    paddingRight: 10,
  },
  sliderSourceLogo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  sliderSourceName: {
    ...fonts.semibold,
    color: colors.athensGray,
    fontSize: 12,
    textTransform: "uppercase",
  },
  sliderNewsTime: {
    ...fonts.medium,
    fontSize: 9,
    color: colors.athensGray,
  },
  progressContainer: {
    ...tStyles.selfcenter,
    width: 130,
    height: 5,
    backgroundColor: colors.lynch,
    borderRadius: 5,
    position: "absolute",
    bottom: 25,
  },
  progress: {
    backgroundColor: colors.primary,
    height: 5,
    borderRadius: 5,
  },
});

const darkStyles = StyleSheet.create({
  mainBtn: {
    ...lightStyles.mainBtn,
  },
  mainBtnText: {
    ...lightStyles.mainBtnText,
  },
  skipBtnText: {
    ...lightStyles.skipBtnText,
  },
  secBtn: {
    ...lightStyles.secBtn,
  },
  secBtnText: {
    ...lightStyles.secBtnText,
  },
  pillBtn: {
    ...lightStyles.pillBtn,
  },
  pillBtnText: {
    ...lightStyles.pillBtnText,
  },
  vogueHeading: {
    ...lightStyles.vogueHeading,
  },
  smallHeadingText: {
    ...lightStyles.smallHeadingText,
  },
  subHeadingText: {
    ...lightStyles.subHeadingText,
  },
  textInputContainer: {
    ...lightStyles.textInputContainer,
  },
  textInput: {
    ...lightStyles.textInput,
  },
  checkBox: {
    ...lightStyles.checkBox,
  },
  topicItem: {
    ...lightStyles.topicItem,
  },
  topicItemSelected: {
    ...lightStyles.topicItemSelected,
  },
  topicNameContainer: {
    ...lightStyles.topicNameContainer,
  },
  topicName: {
    ...lightStyles.topicName,
  },
  topicSubtitle: {
    ...lightStyles.topicSubtitle,
  },
  centerImageCatContainer: {
    ...lightStyles.centerImageCatContainer,
  },
  centerImageCatContainerSel: {
    ...lightStyles.centerImageCatContainerSel,
  },
  sourceName: {
    ...lightStyles.sourceName,
  },
  newsItemContainer: {
    ...lightStyles.newsItemContainer,
  },
  newsItemImage: {
    ...lightStyles.newsItemImage,
  },
  newsMetaText: {
    ...lightStyles.newsMetaText,
  },
  newsHeadline: {
    ...lightStyles.newsHeadline,
  },
  bottomTabContainer: {
    ...lightStyles.bottomTabContainer,
  },
  statsContainer: {
    ...lightStyles.statsContainer,
  },
  statsText: {
    ...lightStyles.statsText,
  },
  statsInfoText: {
    ...lightStyles.statsInfoText,
  },
  userAvatar: {
    ...lightStyles.userAvatar,
  },
  userText: {
    ...lightStyles.userText,
  },
  userNameText: {
    ...lightStyles.userNameText,
  },
  pillContainer: {
    ...lightStyles.pillContainer,
  },
  pillText: {
    ...lightStyles.pillText,
  },
  sliderNewsContainer: {
    ...lightStyles.sliderNewsContainer,
  },
  bookmarkHolder: {
    ...lightStyles.bookmarkHolder,
  },
  sliderNewsCategory: {
    ...lightStyles.sliderNewsCategory,
  },
  sliderNewsCategoryText: {
    ...lightStyles.sliderNewsCategoryText,
  },
  sliderHeadline: {
    ...lightStyles.sliderHeadline,
  },
  sliderSourceLogo: {
    ...lightStyles.sliderSourceLogo,
  },
  sliderSourceName: {
    ...lightStyles.sliderSourceName,
  },
  sliderNewsTime: {
    ...lightStyles.sliderNewsTime,
  },
  progressContainer: {
    ...lightStyles.progressContainer,
  },
  progress: {
    ...lightStyles.progress,
  },
});

export const getStyles = (mode) => {
  if (mode == "light") {
    return lightStyles;
  } else {
    return darkStyles;
  }
};
