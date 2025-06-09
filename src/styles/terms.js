import { StyleSheet } from "react-native";
import { colors, fonts, tStyles } from "../common/theme";


const lightStyles = StyleSheet.create({
    container: {
        ...tStyles.flex1,
        backgroundColor: colors.white
    },
    termsText: {
        ...fonts.medium,
        fontSize: 13,
        color: colors.lynch,
        textAlign: 'justify'
    }
});


const darkStyles = StyleSheet.create({
    container: {
        ...lightStyles.container
    },
    termsText: {
        ...lightStyles.termsText
    }
});


export const getStyles = (mode) => {
    if(mode == 'light'){
        return lightStyles;
    }else{
        return darkStyles;
    }
}