import { StyleSheet } from "react-native";
import { colors, fonts, tStyles } from "../common/theme";


const lightStyles = StyleSheet.create({
    container: {
        ...tStyles.flex1,
        backgroundColor: colors.white
    },
    online: {
        width: 9,
        height: 9,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: colors.white,
        backgroundColor: colors.primary,
        position: 'absolute',
        right: 1, top: 1
    },
    categoryItem: {
        paddingHorizontal: 18,
        paddingVertical: 8
    },
    selCategoryItem: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        backgroundColor: colors.blueVogue,
        borderRadius: 15
    },
    categoryText: {
        ...fonts.medium,
        fontSize: 12
    },
    selCategoryText: {
        ...fonts.medium,
        fontSize: 11,
        color: colors.white
    },
});


const darkStyles = StyleSheet.create({
    container: {
        ...lightStyles.container
    },
    online: {
       ...lightStyles.online
    },
    categoryItem: {
        ...lightStyles.categoryItem
    },
    selCategoryItem: {
        ...lightStyles.selCategoryItem
    },
    categoryText: {
        ...lightStyles.categoryText
    },
    selCategoryText: {
        ...lightStyles.selCategoryText
    },
});


export const getStyles = (mode) => {
    if(mode == 'light'){
        return lightStyles;
    }else{
        return darkStyles;
    }
}