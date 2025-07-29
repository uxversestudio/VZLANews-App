import { StyleSheet } from "react-native";
import { colors, fonts, tStyles } from "../common/theme";

const lightStyles = StyleSheet.create({
  container: {
    ...tStyles.flex1,
    backgroundColor: colors.white,
  },
  newsTobBar: {
    paddingBottom: 20,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  newsHeadlineContainer: {
    width: "100%",
    paddingHorizontal: 25,
    paddingVertical: 35,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
  },
  newsHeadline: {
    ...fonts.bold,
    color: colors.white,
    fontSize: 22,
    paddingRight: 10,
  },
  newsMetaText: {
    ...fonts.semibold,
    fontSize: 9,
    color: colors.gray10,
  },
  sourceLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  sourceName: {
    ...fonts.bold,
  },
  sourceUsername: {
    ...fonts.medium,
    fontSize: 12,
    color: colors.gray40,
    marginTop: 1,
  },
  newsDetailsText: {
    ...fonts.medium,
    color: colors.lynch,
    fontSize: 12,
    marginTop: 15,
    lineHeight: 17,
    textAlign: "left",
  },
  hashtag: {
    backgroundColor: colors.gray5,
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  hashtagText: {
    ...fonts.semibold,
    fontSize: 11,
    color: colors.gray50,
  },
  likeContainer: {
    ...tStyles.endy,
    position: "absolute",
    right: 15,
    bottom: 85,
  },
  likeBtn: {
    ...tStyles.centerx,
    ...tStyles.centery,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(240,240,240, 0.8)",
  },
  viewAllText: {
    color: colors.primary,
    ...fonts.semibold,
    fontSize: 11,
  },
  commentContainer: {
    ...tStyles.row,
  },
  commentAvatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    alignSelf: "flex-start",
  },
  replyAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignSelf: "flex-start",
  },
  commentUsername: {
    ...fonts.bold,
    fontSize: 15,
  },
  commentText: {
    ...fonts.medium,
    color: colors.lynch,
    fontSize: 11,
    marginTop: 5,
    lineHeight: 17,
    marginBottom: 10,
    paddingRight: 30,
  },
  commentTime: {
    ...fonts.semibold,
    fontSize: 11,
    color: colors.gray50,
  },
});

const darkStyles = StyleSheet.create({
  container: {
    ...lightStyles.container,
  },
  newsTobBar: {
    ...lightStyles.newsTobBar,
  },
  newsHeadlineContainer: {
    ...lightStyles.newsHeadlineContainer,
  },
  newsHeadline: {
    ...lightStyles.newsHeadline,
  },
  newsMetaText: {
    ...lightStyles.newsMetaText,
  },
  sourceLogo: {
    ...lightStyles.sourceLogo,
  },
  sourceName: {
    ...lightStyles.sourceName,
  },
  sourceUsername: {
    ...lightStyles.sourceUsername,
  },
  newsDetailsText: {
    ...lightStyles.newsDetailsText,
  },
  hashtag: {
    ...lightStyles.hashtag,
  },
  hashtagText: {
    ...lightStyles.hashtagText,
  },
  likeContainer: {
    ...lightStyles.likeContainer,
  },
  likeBtn: {
    ...lightStyles.likeBtn,
  },
  viewAllText: {
    ...lightStyles.viewAllText,
  },
  commentContainer: {
    ...lightStyles.commentContainer,
  },
  commentAvatar: {
    ...lightStyles.commentAvatar,
  },
  replyAvatar: {
    ...lightStyles.replyAvatar,
  },
  commentUsername: {
    ...lightStyles.commentUsername,
  },
  commentText: {
    ...lightStyles.commentText,
  },
  commentTime: {
    ...lightStyles.commentTime,
  },
});

export const getStyles = (mode) => {
  if (mode == "light") {
    return lightStyles;
  } else {
    return darkStyles;
  }
};
