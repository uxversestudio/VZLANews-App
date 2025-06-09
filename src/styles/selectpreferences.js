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
    },
    countryItem: {
        ...tStyles.row,
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 15,
    },
    countryItemSelected: {
        ...tStyles.row,
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 15,
        backgroundColor: colors.blueVogue
    },
    countryName: {
        ...fonts.semibold,
        fontSize: 13,
        marginLeft: 25
    },
    checkBox: {
        ...tStyles.centerx,
        ...tStyles.centery,
        width: 16,
        height: 16,
        borderRadius: 5,
        backgroundColor: colors.primary
    },
    
});


const darkStyles = StyleSheet.create({
    container: {
        ...lightStyles.container
    },
    termsText: {
        ...lightStyles.termsText
    },
    countryItem: {
        ...lightStyles.countryItem
    },
    countryItemSelected: {
        ...lightStyles.countryItemSelected
    },
    countryName: {
        ...lightStyles.countryName
    },
    checkBox: {
        ...lightStyles.checkBox
    },
    
});


export const getStyles = (mode) => {
    if(mode == 'light'){
        return lightStyles;
    }else{
        return darkStyles;
    }
}