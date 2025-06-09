import React from "react";
import {
  Text,
  useColorScheme,
  Image,
  Platform,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { getStyles } from "../styles/profile";
import PillBtn from "./PillBtn";
import { colors } from "../common/theme";

const AnimProfileHeader = ({
  scroll,
  name,
  userName,
  image,
  follow = false,
  btnPress,
}) => {
  const mode = useColorScheme();
  const top = Platform.OS === "ios" ? 90 : 80;
  const yValue = Platform.OS === "ios" ? 36 : 20;
  const { width } = useWindowDimensions();

  const transVlaue = width - 90;

  const avatarStyles = useAnimatedStyle(() => {
    const scale = interpolate(
      scroll.value,
      [0, 230],
      [1, 0.7],
      Extrapolation.CLAMP
    );
    const _top = interpolate(
      scroll.value,
      [0, 230],
      [top, !follow ? yValue : yValue - 5],
      Extrapolation.CLAMP
    );
    const left = interpolate(
      scroll.value,
      [0, 230],
      [0, 10],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
      top: _top,
      left,
    };
  });

  const followStyles = useAnimatedStyle(() => {
    const translateX = interpolate(
      scroll.value,
      [0, 230],
      [0, transVlaue],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      scroll.value,
      [0, 230],
      [0, -40],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      scroll.value,
      [0, 230],
      [1, 1.2],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateX }, { translateY }, { scale }],
    };
  });

  const userStyles = useAnimatedStyle(() => {
    const translateY = interpolate(
      scroll.value,
      [0, 230],
      [0, 20],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY }],
    };
  });

  return (
    <Animated.View
      style={[getStyles(mode).userDetailContainer, { top }, avatarStyles]}
    >
      <Image
        source={{ uri: image }}
        style={getStyles(mode).userAvatar}
        resizeMode='cover'
      />

      {/* Username Details */}
      <Animated.View style={[{ marginLeft: 15 }, follow ? userStyles : null]}>
        <Text style={[getStyles(mode).profileName]}>{name}</Text>

        {/* Follow Button */}
        {follow && (
          <Animated.View style={[{ marginTop: 10 }, followStyles]}>
            <PillBtn
              onPress={btnPress}
              title='+ Follow'
              color={colors.primary}
            />
          </Animated.View>
        )}
      </Animated.View>
    </Animated.View>
  );
};
export default AnimProfileHeader;
