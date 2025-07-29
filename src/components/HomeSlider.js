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
          <SliderItem item={item} onPress={onItemPress} />
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
  const { width, height } = useWindowDimensions();
  const mode = useColorScheme();
  const navigation = useNavigation();
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageDimensions, setImageDimensions] = React.useState({
    width: 0,
    height: 0,
  });

  // Obtener dimensiones de la imagen para mantener proporción
  React.useEffect(() => {
    if (item.img) {
      Image.getSize(
        item.img,
        (imgWidth, imgHeight) => {
          const containerWidth = width - 30;
          const aspectRatio = imgHeight / imgWidth;
          const calculatedHeight = containerWidth * aspectRatio;

          // Limitar altura máxima para mantener buen diseño
          const maxHeight = 800;
          const finalHeight = Math.min(calculatedHeight, maxHeight);

          setImageDimensions({
            width: containerWidth,
            height: 400,
          });
          setImageLoaded(true);
        },
        (error) => {
          console.log("Error loading image:", error);
          // Fallback a dimensiones por defecto
          setImageDimensions({
            width: width - 30,
            height: (width - 10) * 0.3,
          });
          setImageLoaded(true);
        }
      );
    }
  }, [item.img, width, height]);

  const navigateToNewsDetail = () => {
    if (onPress) {
      onPress(item);
    } else {
      navigation.navigate("NewsDetail", {
        newsData: item,
      });
    }
  };

  if (!imageLoaded) {
    // Mostrar placeholder mientras carga
    return (
      <View
        style={{
          width: width - 30,
          height: (width - 50) * 2,
          backgroundColor: "#f0f0f0",
          borderRadius: 30,
          marginHorizontal: 15,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={{
        uri: item.img,
        // Mejorar calidad de imagen
        cache: "force-cache",
      }}
      style={{
        width: imageDimensions.width,
        height: imageDimensions.height,
        justifyContent: "space-between",
        marginHorizontal: 5,
      }}
      imageStyle={{
        borderRadius: 30,
        // Mejorar renderizado de imagen
        resizeMode: "cover",
      }}
      // Cambiar resizeMode para mejor calidad
      resizeMode='cover'
      // Añadir callback para manejar errores de carga
      onError={(error) => {
        console.log("ImageBackground error:", error);
      }}
    >
      <Pressable style={getStyles(mode).bookmarkHolder}></Pressable>

      <LinearGradient
        colors={[
          "transparent",
          "rgba(25,46,81,0.3)",
          "rgba(25,46,81,0.7)",
          "rgba(25,46,81,0.9)",
        ]}
        style={[
          getStyles(mode).sliderNewsContainer,
          {
            // Asegurar que el gradiente cubra bien el área
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          },
        ]}
      >
        {/* News Category */}
        <TouchableOpacity
          onPress={() => console.log("Category pressed")}
          style={{ marginBottom: 5 }}
        >
          <Pill title={item.category} />
        </TouchableOpacity>

        {/* News Headline */}
        <TouchableOpacity onPress={navigateToNewsDetail}>
          <Text style={getStyles(mode).sliderHeadline}>{item.headline}</Text>
        </TouchableOpacity>

        {/* News Source */}
        <View style={[tStyles.spacedRow, { marginTop: 12 }]}>
          {/* Logo & Name */}
          <View style={tStyles.row}>
            <Image
              source={{
                uri: "https://scontent-bog2-1.xx.fbcdn.net/v/t39.30808-6/472256498_122214930218021272_6856094330000092042_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=ORRrfDNEANAQ7kNvwEEbs1X&_nc_oc=AdkVWd3Ugxnx5Xmz1K7JaW78QhlELyZPlOuzO2ijfy2i0CgI66iuPR-1_H8hJRoix0g&_nc_zt=23&_nc_ht=scontent-bog2-1.xx&_nc_gid=R0sfzbTHgWJZBl1ox5o9Bg&oh=00_AfN8YH4VX0_BtkC1NsW_wlJYQvQ37B_L7rF29W-26nlQ3g&oe=6857BFC3",
              }}
              style={[
                getStyles(mode).sliderSourceLogo,
                {
                  // Mejorar renderizado del logo
                  resizeMode: "cover",
                },
              ]}
              // Añadir fallback para logo
              onError={(e) => {
                console.log(e);
                console.log("Logo failed to load");
              }}
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
