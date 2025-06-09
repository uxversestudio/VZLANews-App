"use client";

import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ImageBackground,
  useWindowDimensions,
  Platform,
  useColorScheme,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
} from "react-native-reanimated";
import { getStyles } from "../styles/newsdetails";
import { AntDesign } from "@expo/vector-icons";
import { colors, fonts, tStyles } from "../common/theme";
import ShareBackHeader from "../components/ShareBackHeader";
import Hr from "../components/Hr";
import { useNavigation, useRoute } from "@react-navigation/native";
import Pill from "../components/Pill";
import usePostDetails from "../feature/wordpress-api-details";

const NewsDetails = ({ navigation }) => {
  const mode = useColorScheme();
  const route = useRoute();
  const scroll = useSharedValue(0);
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsFetched, setDetailsFetched] = useState(false);
  const [shouldFetchDetails, setShouldFetchDetails] = useState(false);
  const scrollThreshold = 200; // Scroll threshold to trigger detailed fetch

  // Custom hook for fetching detailed post data
  const {
    postDetails,
    loading: detailsLoading,
    error: detailsError,
    hasDetailedContent,
    fetchPostDetails,
    resetPostDetails,
  } = usePostDetails();

  // Get the post data from navigation params
  const { post } = route.params || {};

  // Función segura para manejar el scroll y activar la carga de detalles
  const handleScrollThreshold = useCallback(() => {
    if (
      !detailsFetched &&
      !detailsLoading &&
      newsData?.id &&
      !hasDetailedContent
    ) {
      console.log(
        "🚀 Scroll threshold reached, setting flag to fetch detailed content..."
      );
      setDetailsFetched(true);
      setShouldFetchDetails(true);
    }
  }, [detailsFetched, detailsLoading, newsData, hasDetailedContent]);

  // Configurar el manejador de scroll de forma segura
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scroll.value = e.contentOffset.y;

      // Usar runOnJS para llamar a funciones de JavaScript desde el hilo de UI
      if (e.contentOffset.y > scrollThreshold) {
        runOnJS(handleScrollThreshold)();
      }
    },
  });

  // Inicializar datos cuando se carga el componente
  useEffect(() => {
    if (post) {
      console.log("✅ Post data found, setting newsData");
      setNewsData(post);
      setLoading(false);
    } else {
      console.log("❌ No post data found in params");
      setLoading(false);
    }

    // Reset details when component mounts with new post
    resetPostDetails();
    setDetailsFetched(false);
    setShouldFetchDetails(false);
  }, [post, resetPostDetails]);

  // Efecto para cargar detalles cuando se activa la bandera
  useEffect(() => {
    const loadDetails = async () => {
      if (shouldFetchDetails && newsData?.id) {
        try {
          console.log("📡 Fetching post details for ID:", newsData.id);
          await fetchPostDetails(newsData.id);
          setShouldFetchDetails(false);
        } catch (error) {
          console.error("Error fetching details:", error);
          setShouldFetchDetails(false);
        }
      }
    };

    loadDetails();
  }, [shouldFetchDetails, newsData, fetchPostDetails]);

  // Update newsData when detailed content is fetched
  useEffect(() => {
    if (postDetails && hasDetailedContent) {
      console.log("🔄 Updating newsData with detailed content");
      // Combinar datos originales con los nuevos para preservar campos importantes
      setNewsData((prev) => ({
        ...prev,
        ...postDetails,
        // Asegurar que estos campos siempre existan
        img: postDetails.img || prev.img,
        headline: postDetails.headline || prev.headline,
        content: postDetails.content || prev.content || prev.headline,
      }));
    }
  }, [postDetails, hasDetailedContent]);

  // Generate hashtags from post tags or create default ones
  const getHashtags = () => {
    try {
      if (newsData?.tags && newsData.tags.length > 0) {
        return newsData.tags.map(
          (tag) => `#${tag.toLowerCase().replace(/\s+/g, "")}`
        );
      }
      return ["#venezuela", "#noticias", "#actualidad"];
    } catch (e) {
      console.error("Error generando hashtags:", e);
      return ["#venezuela", "#noticias", "#actualidad"];
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Reciente";

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return "1 día";
      if (diffDays < 7) return `${diffDays} días`;
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} semanas`;
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Reciente";
    }
  };

  // Split content into paragraphs with better handling
  const getContentParagraphs = () => {
    try {
      if (!newsData?.content) return [];

      // Use detailed content if available, otherwise fall back to excerpt or headline
      const content = hasDetailedContent
        ? newsData.content
        : newsData.excerpt || newsData.content || newsData.headline || "";

      return content
        .split("\n")
        .filter((paragraph) => paragraph.trim().length > 0)
        .map((paragraph) => paragraph.trim());
    } catch (e) {
      console.error("Error procesando párrafos:", e);
      return [newsData?.headline || "Contenido no disponible"];
    }
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={getStyles(mode).container}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size='large' color={colors.primary} />
          <Text style={{ marginTop: 10, color: "#000" }}>
            Cargando noticia...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // No data state
  if (!newsData) {
    return (
      <SafeAreaView style={getStyles(mode).container}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: colors[mode].text,
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            No se pudo cargar la noticia
          </Text>
          <TouchableOpacity
            style={{
              padding: 12,
              backgroundColor: colors.primary,
              borderRadius: 8,
            }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["right", "left"]} style={getStyles(mode).container}>
      <KeyboardAvoidingView behavior='height' style={getStyles(mode).container}>
        {/* Top Bar */}
        <TopBar scroll={scroll} headline={newsData.headline} />

        <Animated.ScrollView
          bounces={false}
          contentContainerStyle={{ paddingBottom: 50 }}
          onScroll={scrollHandler}
          showsVerticalScrollIndicator={false}
          style={tStyles.flex1}
          scrollEventThrottle={16} // Important for smooth scroll detection
        >
          {/* Image Hero Header */}
          <ImageHeader scroll={scroll} newsData={newsData} />

          {/* News Source Social */}
          <NewsSourceSocial newsData={newsData} />

          {/* Loading indicator for detailed content */}
          {detailsLoading && (
            <View
              style={{
                paddingHorizontal: 15,
                paddingVertical: 20,
                alignItems: "center",
              }}
            >
              <ActivityIndicator size='small' color={colors.primary} />
              <Text style={{ marginTop: 8, color: "#000", fontSize: 14 }}>
                Cargando contenido completo...
              </Text>
            </View>
          )}

          {/* Error message for detailed content */}
          {detailsError && (
            <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
              <View
                style={{
                  backgroundColor: "#fee2e2",
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    color: "#dc2626",
                    textAlign: "center",
                    fontSize: 14,
                  }}
                >
                  Error al cargar contenido detallado
                </Text>
              </View>
            </View>
          )}

          {/* News Details */}
          <View style={{ paddingHorizontal: 15 }}>
            {getContentParagraphs().map((paragraph, index) => (
              <Text
                key={index}
                style={[
                  getStyles(mode).newsDetailsText,
                  { marginTop: index === 0 ? 10 : 15, textAlign: "justify" },
                ]}
              >
                {paragraph}
              </Text>
            ))}

            {getContentParagraphs().length === 0 && (
              <Text
                style={[
                  getStyles(mode).newsDetailsText,
                  { marginTop: 10, textAlign: "justify" },
                ]}
              >
                {newsData.headline || "Contenido no disponible"}
              </Text>
            )}

            {/* Show content status */}
          </View>

          {/* News Images - Show featured image if available */}
          {newsData.img && (
            <View style={{ paddingHorizontal: 15, marginVertical: 20 }}>
              <Image
                source={{ uri: newsData.img }}
                style={{ width: "100%", height: 250, borderRadius: 15 }}
                resizeMode='cover'
              />
            </View>
          )}

          {/* Hashtags */}
          <View
            style={[
              tStyles.row,
              tStyles.wrap,
              { rowGap: 10, marginTop: 35, paddingHorizontal: 15 },
            ]}
          >
            {getHashtags().map((item, index) => (
              <TouchableOpacity
                onPress={() => navigation.navigate("HashDetails")}
                style={getStyles(mode).hashtag}
                key={index}
              >
                <Text style={getStyles(mode).hashtagText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ paddingHorizontal: 15, marginVertical: 25 }}>
            <Hr size={2} color={colors.gray5} />
          </View>

          {/* News Comments */}
          <View style={{ paddingHorizontal: 15 }}>
            <View style={[tStyles.spacedRow]}></View>

            <View style={{ marginTop: 25 }}></View>
          </View>
        </Animated.ScrollView>

        {/* Comment Box */}
        <View
          style={{ paddingHorizontal: 15, paddingTop: 10, paddingBottom: 30 }}
        ></View>

        {/* Like Button */}
        <View style={getStyles(mode).likeContainer}></View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const TopBar = ({ scroll, addBookmark, headline }) => {
  const mode = useColorScheme();
  const pTop = Platform.OS === "ios" ? 37 : 37;

  const topBarStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scroll.value,
      [0, 230],
      [0, 0],
      Extrapolation.CLAMP
    );
    const backgroundColor = interpolateColor(
      scroll.value,
      [0, 230],
      ["transparent", colors.lynch]
    );

    return {
      transform: [{ translateY }],
      backgroundColor,
    };
  });

  const headlineStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scroll.value,
      [0, 250],
      [0, 1],
      Extrapolation.CLAMP
    );
    const translateX = interpolate(
      scroll.value,
      [0, 250],
      [0, 0],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      scroll.value,
      [0, 250],
      [20, 50],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ translateX }, { translateY }],
    };
  });

  return (
    <Animated.View
      style={[
        { position: "absolute", top: 0, zIndex: 2, width: "100%" },
        topBarStyle,
      ]}
    >
      <LinearGradient
        colors={["rgba(25,46,81,0.9)", "rgba(25,46,81,0.4)", "transparent"]}
        style={[
          getStyles(mode).newsHeadlineContainer,
          getStyles(mode).newsTobBar,
          { paddingTop: pTop, paddingBottom: 10 },
        ]}
      >
        <ShareBackHeader
          color={colors.gray10}
          share={() => alert("Función de backend")}
        />

        <Animated.Text
          style={[
            headlineStyle,
            fonts.semibold,
            {
              position: "absolute",
              zIndex: 3,
              color: colors.white,
              fontSize: 16,
              paddingHorizontal: 60,
            },
          ]}
          numberOfLines={2}
        >
          {headline || "Noticia"}
        </Animated.Text>
      </LinearGradient>
    </Animated.View>
  );
};

const ImageHeader = ({ scroll, newsData }) => {
  const mode = useColorScheme();
  const { height } = useWindowDimensions();

  const headStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scroll.value,
      [0, 230],
      [1, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity,
    };
  });

  const formatDate = (dateString) => {
    if (!dateString) return "Reciente";

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return "1 día";
      if (diffDays < 7) return `${diffDays} días`;
      return `${Math.ceil(diffDays / 7)} semanas`;
    } catch (error) {
      return "Reciente";
    }
  };

  return (
    <ImageBackground
      source={{
        uri:
          newsData.img ||
          "https://via.placeholder.com/400x300/cccccc/666666?text=Venezuela+News",
      }}
      style={{
        width: "100%",
        height: height * 0.65,
        justifyContent: "flex-end",
      }}
      imageStyle={{ borderBottomLeftRadius: 25, borderBottomRightRadius: 25 }}
    >
      <Animated.View style={headStyle}>
        <LinearGradient
          colors={["transparent", "rgba(25,46,81,0.4)", "rgba(25,46,81,0.9)"]}
          style={getStyles(mode).newsHeadlineContainer}
        >
          <View style={[tStyles.row, { marginBottom: 13 }]}>
            <Pill title={newsData.category || "General"} />

            <Text
              style={[getStyles(mode).newsMetaText, { marginHorizontal: 12 }]}
            >
              {newsData.read_time || 3} min lectura
            </Text>

            <Text style={getStyles(mode).newsMetaText}>
              {formatDate(newsData.time)}
            </Text>
          </View>

          <Text style={getStyles(mode).newsHeadline}>
            {newsData.headline || "Título no disponible"}
          </Text>

          <View style={[tStyles.row, { marginTop: 10 }]}>
            <View style={tStyles.row}>
              <AntDesign name='eyeo' size={12} color={colors.gray10} />
            </View>

            <View style={[tStyles.row, { marginLeft: 20 }]}>
              <AntDesign name='like2' size={12} color={colors.gray10} />
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </ImageBackground>
  );
};

const NewsSourceSocial = ({ newsData }) => {
  const mode = useColorScheme();
  const navigation = useNavigation();

  return (
    <View
      style={[
        tStyles.spacedRow,
        { paddingVertical: 20, paddingHorizontal: 15 },
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate("SourceProfile")}
        style={tStyles.row}
      >
        <Image
          source={require("../assets/images/logo.jpeg")}
          style={getStyles(mode).sourceLogo}
        />

        <View>
          <Text style={[getStyles(mode).sourceName]}>
            {newsData?.author?.name || "Venezuela News"}
          </Text>
          <Text style={[getStyles(mode).sourceUsername]}>
            @
            {(newsData?.author?.name || "venezuelanews")
              .toLowerCase()
              .replace(/\s+/g, "")}
          </Text>
        </View>
      </TouchableOpacity>

      <View></View>
    </View>
  );
};

export default NewsDetails;
