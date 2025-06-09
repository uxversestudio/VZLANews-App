"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  useColorScheme,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, tStyles } from "../common/theme";
import { getStyles } from "../styles/home";
import Logo from "../components/Logo";
import NewsListItem from "../components/NewsListItem";
import HomeSlider from "../components/HomeSlider";

// Import your WordPress API handler
import {
  getLatestNews,
  getFeaturedNews,
  getPostsByCategory,
} from "../feature/wordpress-api-handler";

const Home = ({ navigation }) => {
  const mode = useColorScheme();
  const [selCategory, setSelCategory] = useState(1);
  const [sliderItems, setSliderItems] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(false);

  const categories = [
    { id: 1, title: "Lo último" },
    { id: 2, title: "Nacionales" },
    { id: 3, title: "Internacionales" },
    { id: 4, title: "Opinion" },
    { id: 5, title: "Política" },
    { id: 6, title: "Economía" },
    { id: 7, title: "Deportes" },
  ];

  // Fallback data in case API fails
  const fallbackSliderData = [
    {
      id: "fallback-1",
      img: "https://via.placeholder.com/400x200/1e3a8a/ffffff?text=Venezuela+News",
      headline: "Últimas noticias de Venezuela",
      category: "General",
      content:
        "Mantente informado con las últimas noticias de Venezuela y el mundo.",
      source: {
        logo: "https://via.placeholder.com/100x50/ffffff/1e3a8a?text=VN",
        name: "Venezuela News",
      },
      time: new Date().toISOString(),
      read_time: 2,
      author: {
        name: "Venezuela News",
        avatar: "https://via.placeholder.com/50x50/1e3a8a/ffffff?text=VN",
      },
      tags: ["venezuela", "noticias"],
    },
  ];

  const fallbackNewsData = [
    {
      id: "fallback-news-1",
      headline: "Conectando con Venezuela News...",
      category: "General",
      content: "Estamos cargando las últimas noticias para ti.",
      img: "https://via.placeholder.com/300x200/1e3a8a/ffffff?text=Cargando",
      read_time: 1,
      time: new Date().toISOString(),
      bookmarked: false,
      author: {
        name: "Venezuela News",
        avatar: "https://via.placeholder.com/50x50/1e3a8a/ffffff?text=VN",
      },
      tags: ["cargando"],
    },
  ];

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load data when category changes
  useEffect(() => {
    if (!loading) {
      loadCategoryData(selCategory);
    }
  }, [selCategory]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Loading initial data...");

      // Load featured posts for slider
      const featured = await getFeaturedNews();
      if (featured && featured.length > 0) {
        setSliderItems(featured);
      } else {
        setSliderItems(fallbackSliderData);
      }

      // Load latest news
      const latest = await getLatestNews();
      if (latest && latest.length > 0) {
        setLatestNews(latest);
      } else {
        setLatestNews(fallbackNewsData);
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
      setError("Error al cargar las noticias");

      // Use fallback data
      setSliderItems(fallbackSliderData);
      setLatestNews(fallbackNewsData);
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryData = async (categoryId) => {
    try {
      setCategoryLoading(true); // Activar spinner de categoría
      const posts = await getPostsByCategory(categoryId);

      if (posts && posts.length > 0) {
        setLatestNews(posts);
        setError(null);
      } else {
        setLatestNews(fallbackNewsData);
      }
    } catch (error) {
      setError("Error al cargar la categoría");
      setLatestNews(fallbackNewsData);
    } finally {
      setCategoryLoading(false); // Desactivar spinner de categoría
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const handleCategoryPress = (categoryId) => {
    setSelCategory(categoryId);
  };

  const showErrorAlert = () => {
    Alert.alert(
      "Error de conexión",
      "No se pudieron cargar las noticias. Verifica tu conexión a internet e intenta nuevamente.",
      [
        { text: "Reintentar", onPress: loadInitialData },
        { text: "Cancelar", style: "cancel" },
      ]
    );
  };

  // Handle navigation to news detail - PROPERLY IMPLEMENTED
  const handleNewsPress = (newsItem) => {
    console.log("🚀 Navigating to news detail with:", newsItem);

    // Ensure we have all required data for the news detail screen
    const postData = {
      id: newsItem.id,
      headline: newsItem.headline,
      content: newsItem.content || newsItem.headline,
      category: newsItem.category,
      img: newsItem.img,
      time: newsItem.time,
      read_time: newsItem.read_time || 3,
      author: newsItem.author || {
        name: "Venezuela News",
        avatar: "https://via.placeholder.com/50x50/1e3a8a/ffffff?text=VN",
      },
      tags: newsItem.tags || [],
      bookmarked: newsItem.bookmarked || false,
      slug: newsItem.slug,
      link: newsItem.link,
    };

    console.log("📦 Post data being sent:", postData);

    // NAVIGATION WITH PROPER ERROR HANDLING
    try {
      navigation.navigate("NewsDetail", { post: postData });
    } catch (error) {
      console.error("❌ Navigation error:", error);
      Alert.alert("Error", "No se pudo abrir la noticia. Intenta nuevamente.");
    }
  };

  // Handle slider item press - PROPERLY IMPLEMENTED
  const handleSliderPress = (sliderItem) => {
    console.log("🎯 Slider item pressed:", sliderItem);

    // Convert slider item format to post format
    const postData = {
      id: sliderItem.id,
      headline: sliderItem.headline,
      content: sliderItem.content || sliderItem.headline,
      category: sliderItem.category,
      img: sliderItem.img,
      time: sliderItem.time,
      read_time: sliderItem.read_time || 3,
      author: {
        name: sliderItem.source?.name || "Venezuela News",
        avatar:
          sliderItem.source?.logo ||
          "https://via.placeholder.com/50x50/1e3a8a/ffffff?text=VN",
      },
      tags: sliderItem.tags || [],
      bookmarked: false,
      slug: sliderItem.slug,
      link: sliderItem.link,
    };

    console.log("📦 Slider post data being sent:", postData);

    // NAVIGATION WITH PROPER ERROR HANDLING
    try {
      navigation.navigate("NewsDetail", { post: postData });
    } catch (error) {
      console.error("❌ Slider navigation error:", error);
      Alert.alert("Error", "No se pudo abrir la noticia. Intenta nuevamente.");
    }
  };

  // Safe color access
  const getColor = (colorPath, fallback = "#000000") => {
    try {
      return colors[mode]?.[colorPath] || fallback;
    } catch {
      return fallback;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={getStyles(mode).container}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator
            size='large'
            color={getColor("primary", "#1e3a8a")}
          />
          <Text
            style={{
              marginTop: 10,
              color: getColor("text", "#000000"),
              fontSize: 16,
            }}
          >
            Cargando noticias...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={["top", "right", "left"]}
      style={getStyles(mode).container}
    >
      {/* Logo & Notification */}
      <View
        style={[
          tStyles.spacedRow,
          { paddingHorizontal: 15, paddingTop: 5, paddingBottom: 10 },
        ]}
      >
        <Logo />

        <TouchableOpacity
          onPress={() => navigation.navigate("Notifications")}
          style={{ position: "relative" }}
        >
          {/* Add your notification icon here */}
        </TouchableOpacity>
      </View>

      {/* Error banner */}
      {error && (
        <TouchableOpacity
          onPress={showErrorAlert}
          style={{
            backgroundColor: "#fee2e2",
            padding: 10,
            marginHorizontal: 15,
            borderRadius: 8,
            marginBottom: 10,
          }}
        >
          <Text style={{ color: "#dc2626", textAlign: "center" }}>
            {error} - Toca para reintentar
          </Text>
        </TouchableOpacity>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ paddingBottom: 90 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[getColor("primary", "#1e3a8a")]}
            tintColor={getColor("primary", "#1e3a8a")}
            title='Actualizando noticias...'
            titleColor={getColor("text", "#000000")}
          />
        }
      >
        {/* Home Slider */}
        {sliderItems.length > 0 && (
          <View style={{ marginTop: 15, position: "relative" }}>
            <HomeSlider data={sliderItems} onItemPress={handleSliderPress} />
          </View>
        )}

        {/* Categories */}
        <View style={{ marginVertical: 20 }}>
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            bounces={false}
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <CategoryItem
                item={item}
                selCategory={selCategory}
                setSelCategory={handleCategoryPress}
                mode={mode}
              />
            )}
            contentContainerStyle={{ paddingHorizontal: 15 }}
          />
        </View>

        {/* News Items - FIXED NAVIGATION */}
        <View style={{ paddingHorizontal: 15 }}>
          {categoryLoading ? (
            <View style={{ padding: 30, alignItems: "center" }}>
              <ActivityIndicator
                size='large'
                color={getColor("primary", "#1e3a8a")}
              />
              <Text
                style={{
                  marginTop: 10,
                  color: getColor("text", "#000000"),
                  fontSize: 14,
                }}
              >
                Cargando{" "}
                {categories.find((cat) => cat.id === selCategory)?.title ||
                  "categoría"}
                ...
              </Text>
            </View>
          ) : latestNews.length > 0 ? (
            latestNews.map((item) => (
              <NewsListItem
                item={item}
                key={item.id}
                onPress={() => handleNewsPress(item)} // ✅ PROPERLY CALLING NAVIGATION
              />
            ))
          ) : (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={{ color: getColor("text", "#000000") }}>
                No hay noticias disponibles
              </Text>
              <TouchableOpacity
                onPress={loadInitialData}
                style={{
                  marginTop: 10,
                  padding: 10,
                  backgroundColor: getColor("primary", "#1e3a8a"),
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "#ffffff" }}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const CategoryItem = ({ item, selCategory, setSelCategory, mode }) => {
  const isSelected = () => item.id === selCategory;

  // Safe color access
  const getColor = (colorPath, fallback = "#000000") => {
    try {
      return colors[mode]?.[colorPath] || fallback;
    } catch {
      return fallback;
    }
  };

  return (
    <TouchableOpacity
      onPress={() => setSelCategory(item.id)}
      style={
        isSelected()
          ? getStyles(mode).selCategoryItem
          : getStyles(mode).categoryItem
      }
    >
      <Text
        style={
          isSelected()
            ? getStyles(mode).selCategoryText
            : getStyles(mode).categoryText
        }
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );
};

export default Home;
