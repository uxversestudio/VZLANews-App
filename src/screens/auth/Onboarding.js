"use client";

import React, { useEffect } from "react";
import {
  View,
  Text,
  useColorScheme,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, tStyles } from "../../common/theme";
import { getStyles } from "../../styles/auth";
import OnboardingItem from "./OnboardingItem";
import Logo from "../../components/Logo";
import { useOnboarding } from "../../feature/useOnboarding";

const Onboarding = ({ navigation }) => {
  const mode = useColorScheme();
  const { width } = useWindowDimensions();
  const { isOnboardingCompleted, isLoading, completeOnboarding } =
    useOnboarding();

  // Función para manejar cuando se omite el onboarding
  const handleSkip = async () => {
    await completeOnboarding();
    navigation.navigate("BottomTabNavigator");
  };

  // Función para manejar cuando se completa el onboarding
  const handleComplete = async () => {
    await completeOnboarding();
    navigation.navigate("BottomTabNavigator");
  };

  // Si ya completó el onboarding, navegar directamente
  useEffect(() => {
    if (!isLoading && isOnboardingCompleted) {
      console.log(
        "🚀 Usuario ya completó onboarding, navegando a app principal"
      );
      navigation.replace("BottomTabNavigator");
    }
  }, [isOnboardingCompleted, isLoading, navigation]);

  // Mostrar loading mientras se verifica el estado
  if (isLoading) {
    return (
      <SafeAreaView
        edges={["top", "right", "left"]}
        style={getStyles(mode).container}
      >
        <View style={[tStyles.flex1, tStyles.center]}>
          <ActivityIndicator size='large' color={colors.primary} />
          <Text style={[getStyles(mode).loadingText, { marginTop: 10 }]}>
            Cargando...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Si ya completó el onboarding, no mostrar nada (se navegará automáticamente)
  if (isOnboardingCompleted) {
    return null;
  }

  return (
    <SafeAreaView
      edges={["top", "right", "left"]}
      style={getStyles(mode).container}
    >
      {/* Logo and Skip Button */}
      <View
        style={[
          tStyles.spacedRow,
          { paddingHorizontal: 15, paddingVertical: 15 },
        ]}
      >
        <Logo />
        <TouchableOpacity onPress={handleSkip}>
          <Text style={getStyles(mode).skipBtnText}>Omitir</Text>
        </TouchableOpacity>
      </View>

      <OnboardingSlider onComplete={handleComplete} />
    </SafeAreaView>
  );
};

const OnboardingSlider = ({ onComplete }) => {
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
          onComplete={onComplete}
        />
      )}
      viewabilityConfig={viewabilityConfig}
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
    />
  );
};

export default Onboarding;
