import { StyleSheet } from "react-native";
import { colors, fonts, tStyles } from "../common/theme";


const lightStyles = StyleSheet.create({
    container: {
        ...tStyles.flex1,
        backgroundColor: colors.white
    },
    coverImg: {
        width: '100%',
        height: 110,
        justifyContent: 'flex-end'
    },
    catHeaderContainer: {
        width: '100%', 
        paddingHorizontal: 25,
        paddingVertical: 35, 
        borderBottomRightRadius: 20, 
        borderBottomLeftRadius: 20 
    },
    catHeader: {
        ...fonts.bold,
        color: colors.white,
        fontSize: 18,
        paddingRight: 10,
        marginTop: 5
    },
    catSubtitle: {
        ...fonts.regular,
        color: colors.white,
        fontSize: 11,
        paddingRight: 10,
        marginTop: 2
    },
    
    
});


const darkStyles = lightStyles;


export const getStyles = (mode) => {
    if(mode == 'light'){
        return lightStyles;
    }else{
        return darkStyles;
    }
}