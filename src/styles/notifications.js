import { StyleSheet } from "react-native";
import { colors, fonts, tStyles } from "../common/theme";


const lightStyles = StyleSheet.create({
    container: {
        ...tStyles.flex1,
        backgroundColor: colors.white
    },
    delBtn: {
        ...tStyles.centerx,
        ...tStyles.centery,
        width: 30,
        height: 30,
        borderRadius: 10,
        backgroundColor: colors.primary
    },
    userAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    userReplyAvatar: {
        width: 28,
        height: 28,
        borderRadius: 15,
        position: 'absolute',
        bottom: -2, right: 0
    },
    detailText: {
        ...fonts.medium,
        fontSize: 12
    },
    timeText: {
        ...fonts.semibold,
        fontSize: 10,
        color: colors.gray40,
        marginTop: 4
    },
    newsImg: {
        width: 35,
        height: 40,
        borderRadius: 5
    }
});


const darkStyles = StyleSheet.create({
    container: {
        ...lightStyles.container
    },
    delBtn: {
        ...lightStyles.delBtn
    },
    userAvatar: {
        ...lightStyles.userAvatar
    },
    userReplyAvatar: {
        ...lightStyles.userReplyAvatar
    },
    detailText: {
        ...lightStyles.detailText
    },
    timeText: {
        ...lightStyles.timeText
    },
    newsImg: {
        ...lightStyles.newsImg
    }
});


export const getStyles = (mode) => {
    if(mode == 'light'){
        return lightStyles;
    }else{
        return darkStyles;
    }
}