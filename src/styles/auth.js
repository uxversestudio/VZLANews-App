import { StyleSheet } from "react-native";
import { colors, fonts, tStyles } from "../common/theme";



const lightStyles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        ...tStyles.flex1
    },
    onboardingTint: {
        backgroundColor: 'rgba(0,0,0,0.25)',
        paddingHorizontal: 25, 
        paddingBottom: 20,
        borderRadius: 30,
        ...tStyles.flex1,
        ...tStyles.endx
    },
    onboardingHeading: {
        ...fonts.bold,
        fontSize: 30,
        color: colors.white
    },
    onboardingHeadingColor: {
        color: colors.primary
    },
    skipBtnText: {
        color: colors.blueVogue,
        ...fonts.medium,
        fontSize: 13
    },
    progressContainer: {
        ...tStyles. selfcenter,
        width: 130, height: 5,
        backgroundColor: colors.lynch,
        borderRadius: 5,
        marginTop: 40
    },
    progress: {
        backgroundColor: colors.primary,
        height: 5,
        borderRadius: 5
    },
    authHeading: {
        ...fonts.bold,
        color: colors.white,
        fontSize: 30
    },
    dontHaveAccountText: {
        ...fonts.medium,
        fontSize: 11,
        color: colors.lynch
    },
    avatar: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 5,
        borderColor: colors.primary
    },
    oauthNameText: {
        ...fonts.bold,
        fontSize: 17,
        marginTop: 10
    },
    oauthUsernameText: {
        ...fonts.regular,
        marginTop: 2,
        color: colors.lynch
    }
});


const darkStyles = StyleSheet.create({
    container: {
        ...lightStyles.container
    },
    onboardingTint: {
        ...lightStyles.onboardingTint
    },
    onboardingHeading: {
        ...lightStyles.onboardingHeading
    },
    onboardingHeadingColor: {
        ...lightStyles.onboardingHeadingColor
    },
    skipBtnText: {
        ...lightStyles.skipBtnText
    },
    progressContainer: {
        ...lightStyles.progressContainer
    },
    progress: {
        ...lightStyles.progress
    },
    authHeading: {
        ...lightStyles.authHeading
    },
    dontHaveAccountText: {
        ...lightStyles.dontHaveAccountText
    },
    avatar: {
        ...lightStyles.avatar
    },
    oauthNameText: {
        ...lightStyles.oauthNameText
    },
    oauthUsernameText: {
        ...lightStyles.oauthUsernameText
    }
});


export const getStyles = (mode) => {
    if(mode == 'light'){
        return lightStyles;
    }else{
        return darkStyles;
    }
}