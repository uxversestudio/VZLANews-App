"use client";

import React from "react";
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  Pressable,
  useWindowDimensions,
  useColorScheme,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import { tStyles } from "../common/theme";
import { getStyles } from "../styles/common";
import Pill from "./Pill";
import "moment/locale/es";

const HomeSlider = ({ data, onItemPress }) => {
  // ✅ Recibir onItemPress como prop
  console.log(data, "pase por aca");
  const mode = useColorScheme();
  const sliderRef = React.useRef();
  const [activeSlide, setActiveSlide] = React.useState(0);
  const navigation = useNavigation();

  const next = () => {
    if (activeSlide < data.length - 1) {
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
    <>
      <FlatList
        ref={sliderRef}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SliderItem
            item={item}
            onPress={onItemPress} // ✅ Pasar onItemPress como onPress
          />
        )}
        pagingEnabled={true}
        viewabilityConfig={viewabilityConfig}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />

      {/* Progress Bar */}
      <View style={getStyles(mode).progressContainer}>
        <View
          style={[
            getStyles(mode).progress,
            { width: `${((activeSlide + 1) / data.length) * 100}%` },
          ]}
        />
      </View>
    </>
  );
};

const SliderItem = ({ item, onPress }) => {
  const { width } = useWindowDimensions();
  const mode = useColorScheme();
  const navigation = useNavigation();

  // Función para navegar con los datos de la noticia
  const navigateToNewsDetail = () => {
    if (onPress) {
      // ✅ Usar la función onPress pasada desde el padre
      onPress(item);
    } else {
      // ✅ Fallback a navegación directa si no hay onPress
      navigation.navigate("NewsDetail", {
        newsData: item,
      });
    }
  };
  console.log(moment(item.time).locale("es").fromNow()), "Aca estoy";
  return (
    <ImageBackground
      source={{ uri: item.img }}
      style={{
        width: width - 30,
        height: 1.07 * width,
        justifyContent: "space-between",
        marginHorizontal: 15,
      }}
      imageStyle={{ borderRadius: 30 }}
      resizeMode='cover'
    >
      <Pressable style={getStyles(mode).bookmarkHolder}></Pressable>

      <LinearGradient
        colors={[
          "transparent",
          "rgba(25,46,81,1)",
          "rgba(25,46,81,0.75)",
          "rgba(25,46,81,0.75)",
        ]}
        style={getStyles(mode).sliderNewsContainer}
      >
        {/* News Category */}
        <TouchableOpacity
          onPress={console.log("Hola")}
          style={{ marginBottom: 5 }}
        >
          <Pill title={item.category} />
        </TouchableOpacity>

        {/* News Headline */}
        <TouchableOpacity onPress={navigateToNewsDetail}>
          <Text style={getStyles(mode).sliderHeadline}>{item.headline}</Text>
        </TouchableOpacity>

        {/* News Source  */}
        <View style={[tStyles.spacedRow, { marginTop: 12 }]}>
          {/* Logo & Name  */}
          <View style={tStyles.row}>
            <Image
              source={{ uri: item.source.logo }}
              style={getStyles(mode).sliderSourceLogo}
            />
            <Text style={getStyles(mode).sliderSourceName}>
              {item.source.name}
            </Text>
          </View>

          <Text style={getStyles(mode).sliderNewsTime}>
            {moment(item.time).locale("es").fromNow()}
          </Text>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

export default HomeSlider;
