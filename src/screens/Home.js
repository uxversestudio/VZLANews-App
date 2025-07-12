"use client";

import { useState, useEffect, useRef } from "react";
import { useColorScheme } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
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
  const mode = useColorScheme?.() || "light";
  const [selCategory, setSelCategory] = useState(1);
  const [sliderItems, setSliderItems] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(false);

  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMoreArticles, setHasMoreArticles] = useState(true);
  const [loadingMoreArticles, setLoadingMoreArticles] = useState(false);

  // Referencias para evitar llamadas duplicadas
  const isLoadingMoreRef = useRef(false);
  const mainListRef = useRef(null);

  const categories = [
    { id: 1, title: "Lo último" },
    { id: 2, title: "Nacionales" },
    { id: 3, title: "Internacionales" },
    { id: 4, title: "Opinion" },
    { id: 5, title: "Política" },
    { id: 6, title: "Economía" },
    { id: 7, title: "Deportes" },
  ];

  // Fallback data in case API fails - FIXED: Unique IDs with timestamp
  const fallbackSliderData = [
    {
      id: `fallback-slider-${Date.now()}`,
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
      id: `fallback-news-${Date.now()}`,
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

  // UTILITY FUNCTION: Remove duplicates and ensure unique IDs
  const removeDuplicatesAndEnsureUniqueIds = (items, prefix = "") => {
    const seen = new Set();
    return items
      .map((item, index) => {
        let uniqueId = item.id;

        // If ID is already seen or doesn't exist, create a unique one
        if (!uniqueId || seen.has(uniqueId)) {
          uniqueId = `${prefix}${item.id || "item"}-${index}-${Date.now()}`;
        }

        seen.add(uniqueId);

        return {
          ...item,
          id: uniqueId,
        };
      })
      .filter(
        (item, index, self) =>
          // Additional filter to remove duplicates by content
          index === self.findIndex((t) => t.headline === item.headline)
      );
  };

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Reset pagination when category changes
  useEffect(() => {
    if (!loading) {
      resetAndLoadCategory();
    }
  }, [selCategory]);

  const resetAndLoadCategory = async () => {
    // Resetear estado de paginación
    setCurrentPage(1);
    setTotalPages(1);
    setHasMoreArticles(true);
    // NO limpiar articles aquí para evitar el pestañeo
    // setArticles([]);

    // Cargar primera página de la categoría
    await loadCategoryData(selCategory, 1, true);
  };

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🚀 Loading initial data...");

      // Load featured posts for slider
      const featured = await getFeaturedNews();
      if (featured && featured.length > 0) {
        const uniqueSliderItems = removeDuplicatesAndEnsureUniqueIds(
          featured,
          "slider-"
        );
        setSliderItems(uniqueSliderItems);
      } else {
        setSliderItems(fallbackSliderData);
      }

      // Load latest news with pagination info
      const result = await getLatestNews(1);
      if (result.posts && result.posts.length > 0) {
        const uniqueArticles = removeDuplicatesAndEnsureUniqueIds(
          result.posts,
          "article-"
        );
        setArticles(uniqueArticles);
        setTotalPages(result.totalPages);
        setHasMoreArticles(result.hasMore);
      } else {
        setArticles(fallbackNewsData);
        setHasMoreArticles(false);
      }
    } catch (error) {
      console.error("❌ Error loading initial data:", error);
      setError("Error al cargar las noticias");

      // Use fallback data
      setSliderItems(fallbackSliderData);
      setArticles(fallbackNewsData);
      setHasMoreArticles(false);
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryData = async (
    categoryId,
    page = 1,
    isNewCategory = false
  ) => {
    try {
      if (isNewCategory) {
        setCategoryLoading(true);
      } else {
        setLoadingMoreArticles(true);
      }

      console.log(`📂 Loading category ${categoryId}, page ${page}...`);

      const result = await getPostsByCategory(categoryId, page);

      if (result.posts && result.posts.length > 0) {
        const uniqueNewPosts = removeDuplicatesAndEnsureUniqueIds(
          result.posts,
          `cat-${categoryId}-page-${page}-`
        );

        if (isNewCategory) {
          // Si es una nueva categoría, reemplazar artículos
          setArticles(uniqueNewPosts);
        } else {
          // Si es carga de más artículos, añadir a los existentes evitando duplicados
          setArticles((prevArticles) => {
            const combined = [...prevArticles, ...uniqueNewPosts];
            return removeDuplicatesAndEnsureUniqueIds(combined, "combined-");
          });
        }

        setTotalPages(result.totalPages);
        setHasMoreArticles(result.hasMore);
        setError(null);
      } else if (isNewCategory) {
        // Solo usar fallback si es una nueva categoría y no hay resultados
        setArticles([
          {
            ...fallbackNewsData[0],
            id: `fallback-cat-${categoryId}-${Date.now()}`,
          },
        ]);
        setHasMoreArticles(false);
      }
    } catch (error) {
      console.error(`❌ Error loading category ${categoryId}:`, error);
      setError("Error al cargar la categoría");

      if (isNewCategory) {
        setArticles([
          {
            ...fallbackNewsData[0],
            id: `fallback-error-${categoryId}-${Date.now()}`,
          },
        ]);
        setHasMoreArticles(false);
      }
    } finally {
      setCategoryLoading(false);
      setLoadingMoreArticles(false);
      isLoadingMoreRef.current = false;
    }
  };

  // Función para cargar más artículos al hacer scroll
  const loadMoreArticles = () => {
    if (
      !hasMoreArticles ||
      loadingMoreArticles ||
      isLoadingMoreRef.current ||
      categoryLoading
    ) {
      return;
    }

    console.log("📜 Loading more articles...");
    isLoadingMoreRef.current = true;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadCategoryData(selCategory, nextPage, false);
  };

  // Función para refrescar TODO el contenido (slider + artículos)
  const onRefreshAll = async () => {
    setRefreshing(true);
    try {
      console.log("🔄 Refreshing all content...");
      await loadInitialData();
      setError(null);
    } catch (error) {
      console.error("❌ Error refreshing all content:", error);
      setError("Error al actualizar el contenido");
    } finally {
      setRefreshing(false);
    }
  };

  const handleCategoryPress = (categoryId) => {
    if (categoryId === selCategory) return;
    setSelCategory(categoryId);
  };

  const showErrorAlert = () => {
    Alert.alert(
      "Error de conexión",
      "No se pudieron cargar los artículos. Verifica tu conexión a internet e intenta nuevamente.",
      [
        { text: "Reintentar", onPress: onRefreshAll },
        { text: "Cancelar", style: "cancel" },
      ]
    );
  };

  // Handle navigation to news detail
  const handleNewsPress = (newsItem) => {
    console.log("🚀 Navigating to news detail with:", newsItem.headline);

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

    try {
      navigation.navigate("NewsDetail", { post: postData });
    } catch (error) {
      console.error("❌ Navigation error:", error);
      Alert.alert("Error", "No se pudo abrir la noticia. Intenta nuevamente.");
    }
  };

  // Handle slider item press
  const handleSliderPress = (sliderItem) => {
    console.log("🎯 Slider item pressed:", sliderItem.headline);

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

  // IMPROVED KEY EXTRACTOR: Ensures unique keys with fallback
  const getUniqueKey = (item, index, prefix = "") => {
    if (item.id) {
      return `${prefix}${item.id}`;
    }
    return `${prefix}item-${index}-${Date.now()}`;
  };

  // HEADER ESTÁTICO: Logo + Slider + Categorías (NUNCA CAMBIA)
  const renderStaticHeader = () => {
    return (
      <View>
        {/* Logo & Notification */}
        <View
          style={[
            tStyles.spacedRow,
            { paddingHorizontal: 15, paddingTop: 5, paddingBottom: 20 },
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

        {/* Slider - COMPLETAMENTE FIJO */}
        {sliderItems.length > 0 && (
          <View style={{ marginTop: 15, position: "relative", marginLeft: -8 }}>
            <HomeSlider data={sliderItems} onItemPress={handleSliderPress} />
          </View>
        )}

        {/* Categories - FIJO */}
        <View style={{ marginVertical: 20 }}>
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            bounces={false}
            data={categories}
            keyExtractor={(item, index) =>
              getUniqueKey(item, index, "category-")
            }
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

        {/* Información de paginación - SOLO CUANDO NO ESTÁ CARGANDO */}
        {!categoryLoading && articles.length > 0 && (
          <View style={{ paddingHorizontal: 15, marginBottom: 10 }}>
            <Text
              style={{ fontSize: 12, color: getColor("textLight", "#666666") }}
            >
              {articles.length} artículos • Página {currentPage} de {totalPages}{" "}
              •{hasMoreArticles ? " Scroll para más" : " Fin de resultados"}
            </Text>
          </View>
        )}
      </View>
    );
  };

  // COMPONENTE DE LOADING SEPARADO (FUERA DEL HEADER)
  const renderCategoryLoadingState = () => {
    if (!categoryLoading) return null;

    return (
      <View
        style={{
          padding: 30,
          alignItems: "center",
          backgroundColor: getColor("background", "#ffffff"),
        }}
      >
        <ActivityIndicator
          size='large'
          color={getColor("primary", "#1e3a8a")}
        />
        <Text
          style={{
            marginTop: 10,
            color: getColor("text", "#000000"),
            fontSize: 14,
            textAlign: "center",
          }}
        >
          Cargando{" "}
          {categories.find((cat) => cat.id === selCategory)?.title ||
            "categoría"}
          ...
        </Text>
      </View>
    );
  };

  // RENDERIZAR ITEM DE ARTÍCULO NORMAL
  const renderArticleItem = ({ item }) => {
    return <NewsListItem item={item} onPress={() => handleNewsPress(item)} />;
  };

  // Renderizar el footer para la lista de artículos
  const renderFooter = () => {
    if (!hasMoreArticles && !categoryLoading) {
      return (
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text style={{ color: getColor("text", "#000000"), fontSize: 12 }}>
            ✓ Has visto todos los artículos
          </Text>
        </View>
      );
    }

    if (loadingMoreArticles) {
      return (
        <View style={{ padding: 20, alignItems: "center" }}>
          <ActivityIndicator
            size='small'
            color={getColor("primary", "#1e3a8a")}
          />
          <Text
            style={{
              marginTop: 5,
              color: getColor("text", "#000000"),
              fontSize: 12,
            }}
          >
            Cargando más artículos...
          </Text>
        </View>
      );
    }

    return null;
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
      {/* ESTRUCTURA PRINCIPAL CON HEADER FIJO Y CONTENIDO DINÁMICO */}
      <FlatList
        ref={mainListRef}
        data={articles} // SIEMPRE mostrar artículos
        keyExtractor={(item, index) => getUniqueKey(item, index, "article-")}
        renderItem={renderArticleItem}
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingBottom: 90,
        }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Header estático que NUNCA cambia */}
            {renderStaticHeader()}
            {/* Loading state separado que aparece DESPUÉS del header */}
            {renderCategoryLoadingState()}
          </View>
        }
        ListEmptyComponent={
          !categoryLoading ? (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={{ color: getColor("text", "#000000") }}>
                No hay noticias disponibles
              </Text>
              <TouchableOpacity
                onPress={onRefreshAll}
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
          ) : null
        }
        ListFooterComponent={renderFooter}
        onEndReached={loadMoreArticles}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefreshAll}
            colors={[getColor("primary", "#1e3a8a")]}
            tintColor={getColor("primary", "#1e3a8a")}
            title='Actualizando contenido...'
            titleColor={getColor("text", "#000000")}
          />
        }
      />
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
