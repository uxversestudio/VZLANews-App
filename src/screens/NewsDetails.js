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
  Linking,
  Alert,
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
import { colors, fonts, tStyles } from "../common/theme";
import ShareBackHeader from "../components/ShareBackHeader";
import Hr from "../components/Hr";
import { useNavigation, useRoute } from "@react-navigation/native";
import Pill from "../components/Pill";
import usePostDetails from "../feature/wordpress-api-details";
import { shareContent } from "../common/shareUtils";

// Función mejorada para parsear HTML y extraer enlaces con mejor espaciado
const parseHTMLContent = (htmlContent) => {
  if (!htmlContent) return [];

  // Regex para encontrar enlaces HTML
  const linkRegex = /<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(htmlContent)) !== null) {
    // Agregar texto antes del enlace
    if (match.index > lastIndex) {
      const textBefore = htmlContent.slice(lastIndex, match.index);
      const cleanText = textBefore.replace(/<[^>]*>/g, "");
      if (cleanText.trim()) {
        parts.push({ type: "text", content: cleanText });
      }
    }

    // Agregar el enlace
    const url = match[1];
    const linkText = match[2].replace(/<[^>]*>/g, "").trim();
    if (linkText && url) {
      parts.push({
        type: "link",
        content: linkText,
        url: url,
      });
    }

    lastIndex = linkRegex.lastIndex;
  }

  // Agregar texto restante después del último enlace
  if (lastIndex < htmlContent.length) {
    const remainingText = htmlContent.slice(lastIndex);
    const cleanText = remainingText.replace(/<[^>]*>/g, "");
    if (cleanText.trim()) {
      parts.push({ type: "text", content: cleanText });
    }
  }

  // Si no se encontraron enlaces, devolver todo como texto
  if (parts.length === 0) {
    const cleanText = htmlContent.replace(/<[^>]*>/g, "");
    if (cleanText.trim()) {
      parts.push({ type: "text", content: cleanText });
    }
  }

  return parts;
};

// Componente mejorado para renderizar texto con enlaces bien espaciados
const RenderTextWithLinks = ({ content, textStyle, mode }) => {
  const parts = parseHTMLContent(content);

  const handleLinkPress = async (url) => {
    try {
      // Verificar si la URL es válida
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }

      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "No se puede abrir este enlace");
      }
    } catch (error) {
      console.error("Error opening link:", error);
      Alert.alert("Error", "No se pudo abrir el enlace");
    }
  };

  // Función para determinar si necesitamos agregar separación después de un enlace
  const needsSpacing = (currentIndex, parts) => {
    const nextPart = parts[currentIndex + 1];
    // Agregar separación si el siguiente elemento es otro enlace
    return nextPart && nextPart.type === "link";
  };

  return (
    <Text style={textStyle}>
      {parts.map((part, index) => {
        if (part.type === "link") {
          return (
            <Text key={index}>
              <Text
                style={[
                  textStyle,
                  {
                    color: "#0066CC",
                    textDecorationLine: "underline",
                    fontWeight: "500",
                  },
                ]}
                onPress={() => handleLinkPress(part.url)}
              >
                {part.content}
              </Text>
              {/* Agregar separación solo si el siguiente elemento es otro enlace */}
              {needsSpacing(index, parts) && (
                <Text style={textStyle}>{"\n\n"}</Text>
              )}
              {/* Espacio normal después de cada enlace */}
              <Text style={textStyle}> </Text>
            </Text>
          );
        } else {
          return (
            <Text key={index} style={textStyle}>
              {part.content}
            </Text>
          );
        }
      })}
    </Text>
  );
};

const NewsDetails = ({ navigation }) => {
  const mode = useColorScheme();
  const route = useRoute();
  const scroll = useSharedValue(0);
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsFetched, setDetailsFetched] = useState(false);
  const [shouldFetchDetails, setShouldFetchDetails] = useState(false);
  const scrollThreshold = 200;

  const {
    postDetails,
    loading: detailsLoading,
    error: detailsError,
    hasDetailedContent,
    fetchPostDetails,
    resetPostDetails,
  } = usePostDetails();

  const { post } = route.params || {};

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

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scroll.value = e.contentOffset.y;
      if (e.contentOffset.y > scrollThreshold) {
        runOnJS(handleScrollThreshold)();
      }
    },
  });

  useEffect(() => {
    if (post) {
      console.log("✅ Post data found, setting newsData");
      setNewsData(post);
      setLoading(false);
    } else {
      console.log("❌ No post data found in params");
      setLoading(false);
    }
    resetPostDetails();
    setDetailsFetched(false);
    setShouldFetchDetails(false);
  }, [post, resetPostDetails]);

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

  useEffect(() => {
    if (postDetails && hasDetailedContent) {
      console.log("🔄 Updating newsData with detailed content");
      setNewsData((prev) => ({
        ...prev,
        ...postDetails,
        img: postDetails.img || prev.img,
        headline: postDetails.headline || prev.headline,
        content: postDetails.content || prev.content || prev.headline,
      }));
    }
  }, [postDetails, hasDetailedContent]);

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

  const getContentParagraphs = () => {
    try {
      if (!newsData?.content) return [];

      const content = hasDetailedContent
        ? newsData.content
        : newsData.excerpt || newsData.content || newsData.headline || "";

      // Si el contenido tiene HTML, lo dividimos por párrafos HTML
      if (content.includes("<p>") || content.includes("<a")) {
        // Dividir por párrafos pero mantener los enlaces intactos
        return content
          .split(/\n\n+/)
          .filter((paragraph) => paragraph.trim().length > 0)
          .map((paragraph) => paragraph.trim());
      } else {
        // Si no tiene HTML, dividimos por saltos de línea dobles
        return content
          .split(/\n\n+/)
          .filter((paragraph) => paragraph.trim().length > 0)
          .map((paragraph) => paragraph.trim());
      }
    } catch (e) {
      console.error("Error procesando párrafos:", e);
      return [newsData?.headline || "Contenido no disponible"];
    }
  };

  const handleShareArticle = async () => {
    if (!newsData) return;
    try {
      const articleUrl =
        newsData.link ||
        `https://venezuela-news.com/article/${newsData.id || "unknown"}`;
      await shareContent({
        title: "Compartir noticia",
        message: newsData.headline || "Mira esta noticia interesante",
        url: articleUrl,
      });
    } catch (error) {
      console.error("Error sharing article:", error);
    }
  };

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
        <TopBar
          scroll={scroll}
          headline={newsData.headline}
          shareArticle={handleShareArticle}
        />

        <Animated.ScrollView
          bounces={false}
          contentContainerStyle={{ paddingBottom: 50 }}
          onScroll={scrollHandler}
          showsVerticalScrollIndicator={false}
          style={tStyles.flex1}
          scrollEventThrottle={16}
        >
          <ImageHeader scroll={scroll} newsData={newsData} />
          <NewsSourceSocial newsData={newsData} />

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
                    textAlign: "left",
                    fontSize: 14,
                  }}
                >
                  Error al cargar contenido detallado
                </Text>
              </View>
            </View>
          )}

          <View style={{ paddingHorizontal: 15 }}>
            {getContentParagraphs().map((paragraph, index) => (
              <View key={index} style={{ marginBottom: 12 }}>
                <RenderTextWithLinks
                  content={paragraph}
                  textStyle={[
                    getStyles(mode).newsDetailsText,
                    {
                      textAlign: "left",
                      lineHeight: 20,
                    },
                  ]}
                  mode={mode}
                />
              </View>
            ))}

            {getContentParagraphs().length === 0 && (
              <RenderTextWithLinks
                content={newsData.headline || "Contenido no disponible"}
                textStyle={[
                  getStyles(mode).newsDetailsText,
                  {
                    marginTop: 5,
                    textAlign: "left",
                    lineHeight: 20,
                  },
                ]}
                mode={mode}
              />
            )}
          </View>

          {newsData.img && (
            <View style={{ paddingHorizontal: 15, marginVertical: 20 }}>
              <Image
                source={{ uri: newsData.img }}
                style={{ width: "100%", height: 250, borderRadius: 15 }}
                resizeMode='cover'
              />
            </View>
          )}

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

          <View style={{ paddingHorizontal: 15 }}>
            <View style={[tStyles.spacedRow]}></View>
            <View style={{ marginTop: 25 }}></View>
          </View>
        </Animated.ScrollView>

        <View
          style={{ paddingHorizontal: 15, paddingTop: 10, paddingBottom: 30 }}
        ></View>
        <View style={getStyles(mode).likeContainer}></View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const TopBar = ({ scroll, shareArticle, headline }) => {
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
        <ShareBackHeader color={colors.gray10} share={shareArticle} />
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
            <View style={tStyles.row}></View>
            <View style={[tStyles.row, { marginLeft: 20 }]}></View>
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
