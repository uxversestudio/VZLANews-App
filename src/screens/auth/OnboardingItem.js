import React from "react";
import {
  View,
  Text,
  ImageBackground,
  useWindowDimensions,
  Platform,
  useColorScheme,
} from "react-native";
import { tStyles } from "../../common/theme";
import { getStyles } from "../../styles/auth";
import MainBtn from "../../components/MainBtn";
import { useNavigation } from "@react-navigation/native";

const OnboardingItem = ({ item, index, next, slides, onComplete }) => {
  const mode = useColorScheme();
  const { height, width } = useWindowDimensions();
  const ht = Platform.OS === "ios" ? height - 120 : height - 60;
  const handleFinalButton = async () => {
    console.log("🎉 Usuario completó el onboarding");
    if (onComplete) {
      await onComplete();
    }
  };

  const navigation = useNavigation();

  return (
    <View
      style={[
        tStyles.flex1,
        tStyles.centery,
        { width: width - 30, marginHorizontal: 15 },
      ]}
    >
      <ImageBackground
        source={item.img}
        style={[{ width: "100%", height: ht, marginTop: 5 }]}
        imageStyle={{ borderRadius: 30 }}
        resizeMode='cover'
      >
        <View style={[getStyles(mode).onboardingTint]}>
          <Text style={getStyles(mode).onboardingHeading}>
            {item.heading}
            <Text style={getStyles(mode).onboardingHeadingColor}></Text>
          </Text>

          {/* Progress Bar */}
          <View style={getStyles(mode).progressContainer}>
            <View
              style={[
                getStyles(mode).progress,
                { width: `${((index + 1) / slides) * 100}%` },
              ]}
            />
          </View>

          <View style={[tStyles.selfcenter, { width: 180, marginTop: 40 }]}>
            {index == slides - 1 ? (
              <MainBtn onPress={handleFinalButton} title='Ingresar' />
            ) : (
              <MainBtn onPress={next} title='Siguiente' />
            )}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
export default OnboardingItem;
