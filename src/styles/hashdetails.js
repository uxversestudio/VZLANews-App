import { StyleSheet } from "react-native";
import { colors, fonts, tStyles } from "../common/theme";


const lightStyles = StyleSheet.create({
    container: {
        ...tStyles.flex1,
        backgroundColor: colors.white
    },
    hashtag: {
        backgroundColor: colors.gray5,
        paddingVertical: 9,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginRight: 10,
        alignSelf: 'flex-start'
    },
    hashtagText: {
        ...fonts.semibold,
        fontSize: 13,
        color: colors.gray50
    },
});


const darkStyles = StyleSheet.create({
    container: {
        ...lightStyles.container
    },
    hashtag: {
        ...lightStyles.hashtag
    },
    hashtagText: {
        ...lightStyles.hashtagText
    }
    
});


export const getStyles = (mode) => {
    if(mode == 'light'){
        return lightStyles;
    }else{
        return darkStyles;
    }
}