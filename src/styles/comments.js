import { StyleSheet } from "react-native";
import { colors, fonts, tStyles } from "../common/theme";


const lightStyles = StyleSheet.create({
    container: {
        ...tStyles.flex1,
        backgroundColor: colors.white
    },
    coverImg: {
        width: '100%',
        height: 140,
        justifyContent: 'flex-end'
    },
    newsHeadlineContainer: {
        width: '100%', 
        paddingHorizontal: 25,
        paddingVertical: 35, 
        borderBottomRightRadius: 20, 
        borderBottomLeftRadius: 20 
    },
    newsHeadline: {
        ...fonts.bold,
        color: colors.white,
        fontSize: 18,
        paddingRight: 10,
        marginTop: 5
    },
    commentContainer: {
        ...tStyles.row,
    },
    commentAvatar: {
        width: 45,
        height: 45,
        borderRadius: 25,
        alignSelf: 'flex-start'
    },
    replyAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignSelf: 'flex-start'
    },
    commentUsername: {
        ...fonts.bold,
        fontSize: 15
    },
    commentText: {
        ...fonts.medium,
        color: colors.lynch,
        fontSize: 11,
        marginTop: 5,
        lineHeight: 17,
        marginBottom: 10,
        paddingRight: 30
    },
    commentTime: {
        ...fonts.semibold,
        fontSize: 11,
        color: colors.gray50
    }
    
});


const darkStyles = StyleSheet.create({
    container: {
        ...lightStyles.container
    },
    newsHeadlineContainer: {
        ...lightStyles.newsHeadlineContainer
    },
    newsHeadline: {
        ...lightStyles.newsHeadline
    },
    commentContainer: {
        ...tStyles.row,
    },
    commentAvatar: {
        ...lightStyles.commentAvatar
    },
    replyAvatar: {
        ...lightStyles.replyAvatar
    },
    commentUsername: {
        ...lightStyles.commentUsername
    },
    commentText: {
        ...lightStyles.commentText
    },
    commentTime: {
        ...lightStyles.commentTime
    }
});


export const getStyles = (mode) => {
    if(mode == 'light'){
        return lightStyles;
    }else{
        return darkStyles;
    }
}