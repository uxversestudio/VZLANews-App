import React from "react";
import {
  View,
  Text,
  useColorScheme,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts, tStyles } from "../../common/theme";
import { getStyles } from "../../styles/auth";
import OnboardingItem from "./OnboardingItem";
import Logo from "../../components/Logo";

const Onboarding = ({ navigation }) => {
  const mode = useColorScheme();
  const { width } = useWindowDimensions();

  return (
    <SafeAreaView
      edges={["top", "right", "left"]}
      style={getStyles(mode).container}
      v
    >
      {/* Logo and Skip Button */}
      <View
        style={[
          tStyles.spacedRow,
          { paddingHorizontal: 15, paddingVertical: 15 },
        ]}
      >
        <Logo />
        <TouchableOpacity
          onPress={() => navigation.navigate("BottomTabNavigator")}
        >
          <Text style={getStyles(mode).skipBtnText}>Omitir</Text>
        </TouchableOpacity>
      </View>

      <OnboardingSlider />
    </SafeAreaView>
  );
};

const OnboardingSlider = () => {
  const sliderRef = React.useRef();
  const [activeSlide, setActiveSlide] = React.useState(0);

  const slides = [
    {
      id: 1,
      img: require("../../assets/images/onboarding_1.jpg"),
      heading: "Infórmate con lo que realmente importa",
    },
    {
      id: 2,
      img: require("../../assets/images/onboarding_2.jpg"),
      heading: "Todas las noticias, en un solo lugar",
    },
    {
      id: 3,
      img: require("../../assets/images/onboarding_3.jpg"),
      heading: "Tú eliges lo que quieres leer",
    },
  ];

  const next = () => {
    if (activeSlide < slides.length - 1) {
      sliderRef.current?.scrollToIndex({ index: activeSlide + 1 });
    }
  };

  // Set the active onboarding screen
  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems[0].index !== null) {
      setActiveSlide(viewableItems[0].index);
    }
  };
  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
  const viewabilityConfigCallbackPairs = React.useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  return (
    <FlatList
      ref={sliderRef}
      data={slides}
      horizontal={true}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      pagingEnabled={true}
      bounces={false}
      renderItem={({ item, index }) => (
        <OnboardingItem
          item={item}
          index={index}
          next={next}
          slides={slides.length}
        />
      )}
      viewabilityConfig={viewabilityConfig}
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
    />
  );
};

export default Onboarding;
