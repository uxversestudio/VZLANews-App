"use client";

import { useState, useRef } from "react";
import {
  View,
  Text,
  useColorScheme,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackHeader from "../components/BackHeader";
import { tStyles } from "../common/theme";
import { getStyles } from "../styles/search";
import SmallHeading from "../components/SmallHeading";
import ImageCatItem from "../components/ImageCatItem";
import SearchResultItem from "../components/SearchResultItem";
import useWordPressSearch from "../feature/useWordPressSearch";

const Search = ({ navigation }) => {
  const mode = useColorScheme();
  const [selected, setSelected] = useState([]);
  const hasInitializedSelectedRef = useRef(false);
  const flatListRef = useRef(null);

  // Usar nuestro hook personalizado SIN LÍMITE DE TIEMPO
  const {
    categories,
    allCategories,
    searchResults,
    searchQuery,
    showCategories,
    categoriesLoading,
    categoriesError,
    searchLoading,
    searchError,
    isSearching,
    hasMoreCategories,
    loadingMoreCategories,
    hasMoreSearchResults,
    loadingMoreSearchResults,
    searchPage,
    handleSearchInputChange,
    clearSearch,
    refreshCategories,
    loadMoreCategories,
    loadMoreSearchResults,
  } = useWordPressSearch();

  // INICIALIZACIÓN ÚNICA DE CATEGORÍAS SELECCIONADAS
  if (categories.length > 0 && !hasInitializedSelectedRef.current) {
    const topCategoryIds = categories.slice(0, 3).map((cat) => cat.id);
    setSelected(topCategoryIds);
    hasInitializedSelectedRef.current = true;
    console.log("🎯 Categorías seleccionadas por defecto:", topCategoryIds);
  }

  // Funciones de navegación - ESTABLES
  const handleSearchSubmit = () => {
    if (searchQuery.length >= 3) {
      navigation.navigate("SearchResults", {
        query: searchQuery,
        results: searchResults,
      });
    }
  };

  const handleNewsPress = (newsItem) => {
    navigation.navigate("NewsDetail", { post: newsItem });
  };

  const handleCategoryPress = (category) => {
    navigation.navigate("TopicNews", { category });
  };

  // Función de debug para scroll
  const debugScrollInfo = () => {
    console.log(`🔍 Estado actual de búsqueda:`);
    console.log(`   - Query: "${searchQuery}"`);
    console.log(`   - Resultados: ${searchResults.length}`);
    console.log(`   - Página actual: ${searchPage}`);
    console.log(`   - Hay más: ${hasMoreSearchResults}`);
    console.log(`   - Cargando más: ${loadingMoreSearchResults}`);
  };

  // Renderizar item de categoría
  const renderCategoryItem = ({ item }) => (
    <ImageCatItem
      item={item}
      selected={selected}
      setSelected={setSelected}
      onPress={() => handleCategoryPress(item)}
    />
  );

  // Renderizar item de resultado de búsqueda
  const renderSearchResultItem = ({ item }) => (
    <SearchResultItem item={item} onPress={handleNewsPress} />
  );

  // Renderizar footer para categorías
  const renderCategoriesFooter = () => {
    if (loadingMoreCategories) {
      return (
        <View style={getStyles(mode).loadingFooter}>
          <ActivityIndicator size='small' color='#1e3a8a' />
          <Text style={getStyles(mode).loadingText}>
            Cargando 3 categorías más...
          </Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={getStyles(mode).loadMoreButton}
        onPress={loadMoreCategories}
      >
        <Text style={getStyles(mode).loadMoreText}>
          Cargar 3 categorías más
        </Text>
        <MaterialCommunityIcons name='chevron-down' size={20} color='#1e3a8a' />
      </TouchableOpacity>
    );
  };

  // Renderizar footer para resultados de búsqueda
  const renderSearchFooter = () => {
    if (!hasMoreSearchResults) {
      return (
        <View style={getStyles(mode).footerContainer}>
          <Text style={getStyles(mode).footerText}>
            ✅ Todos los resultados mostrados ({searchResults.length} total)
          </Text>
        </View>
      );
    }

    if (loadingMoreSearchResults) {
      return (
        <View style={getStyles(mode).loadingFooter}>
          <ActivityIndicator size='small' color='#1e3a8a' />
          <Text style={getStyles(mode).loadingText}>
            Cargando 3 resultados más...
          </Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={getStyles(mode).loadMoreButton}
        onPress={() => {
          console.log("🔄 Botón de cargar más presionado manualmente");
          loadMoreSearchResults();
        }}
      >
        <Text style={getStyles(mode).loadMoreText}>Ver 3 resultados más</Text>
        <MaterialCommunityIcons name='chevron-down' size={20} color='#1e3a8a' />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      edges={["top", "right", "left"]}
      style={getStyles(mode).container}
    >
      {/* Top Bar */}
      <View style={{ paddingHorizontal: 15, paddingBottom: 5 }}>
        <BackHeader />
      </View>

      {/* Heading */}
      <View style={{ paddingHorizontal: 15 }}>
        <SmallHeading heading='Buscar' />
      </View>

      {/* Search Bar Optimizado */}
      <View style={{ paddingHorizontal: 15, marginTop: 20, marginBottom: 10 }}>
        <View style={getStyles(mode).searchContainer}>
          <MaterialCommunityIcons
            name='magnify'
            size={24}
            color='#666'
            style={{ marginRight: 10 }}
          />
          <TextInput
            style={getStyles(mode).searchInput}
            placeholder='Buscar noticias'
            placeholderTextColor='#999'
            value={searchQuery}
            onChangeText={handleSearchInputChange}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType='search'
            autoCorrect={false}
            autoCapitalize='none'
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <MaterialCommunityIcons name='close' size={20} color='#666' />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Stats Bar Optimizada */}

      {/* Stats Bar para Búsqueda */}

      {/* Error Messages */}
      {categoriesError && (
        <View style={getStyles(mode).errorContainer}>
          <Text style={getStyles(mode).errorText}>
            Error al cargar categorías: {categoriesError}
          </Text>
          <TouchableOpacity
            style={getStyles(mode).retryButton}
            onPress={refreshCategories}
          >
            <Text style={getStyles(mode).retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}

      {searchError && isSearching && (
        <View style={getStyles(mode).errorContainer}>
          <Text style={getStyles(mode).errorText}>
            Error en la búsqueda: {searchError}
          </Text>
        </View>
      )}

      {/* Loading States */}
      {categoriesLoading && showCategories && (
        <View style={getStyles(mode).loadingContainer}>
          <ActivityIndicator size='large' color='#1e3a8a' />
          <Text style={getStyles(mode).loadingText}>
            Cargando categorías...
          </Text>
        </View>
      )}

      {/* Search Results - CON SCROLL INFINITO SIN LÍMITE */}
      {isSearching && (
        <>
          <View style={{ paddingHorizontal: 15, marginBottom: 10 }}>
            <Text style={getStyles(mode).resultsTitle}>
              Resultados para "{searchQuery}"{" "}
              {searchResults.length > 0 && `(${searchResults.length})`}
            </Text>
          </View>

          {searchLoading ? (
            <View style={getStyles(mode).loadingContainer}>
              <ActivityIndicator size='small' color='#1e3a8a' />
              <Text style={getStyles(mode).loadingText}>
                Buscando resultados...
              </Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={searchResults}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderSearchResultItem}
              ListEmptyComponent={
                <View style={getStyles(mode).emptyContainer}>
                  <Text style={getStyles(mode).emptyText}>
                    No se encontraron resultados para "{searchQuery}"
                  </Text>
                  <Text style={getStyles(mode).emptySubText}>
                    Intenta con términos más específicos
                  </Text>
                </View>
              }
              ListFooterComponent={renderSearchFooter}
              contentContainerStyle={{
                paddingHorizontal: 15,
                paddingBottom: 20,
              }}
              showsVerticalScrollIndicator={false}
              onEndReached={() => {
                console.log(
                  `📱 onEndReached triggered - hasMore: ${hasMoreSearchResults}, loading: ${loadingMoreSearchResults}`
                );
                debugScrollInfo();

                if (hasMoreSearchResults && !loadingMoreSearchResults) {
                  console.log(`🚀 Iniciando carga de más resultados...`);
                  loadMoreSearchResults();
                } else {
                  console.log(
                    `🛑 No se cargan más resultados - hasMore: ${hasMoreSearchResults}, loading: ${loadingMoreSearchResults}`
                  );
                }
              }}
              onEndReachedThreshold={0.3}
            />
          )}
        </>
      )}

      {/* Category Listing with Pagination - 3 CATEGORÍAS POR VEZ */}
      {showCategories && !categoriesLoading && (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCategoryItem}
          style={tStyles.flex1}
          contentContainerStyle={[
            { paddingHorizontal: 15, paddingTop: 10, paddingBottom: 90 },
          ]}
          numColumns={2}
          columnWrapperStyle={tStyles.spacedRow}
          ItemSeparatorComponent={<View style={{ height: 15 }} />}
          ListFooterComponent={renderCategoriesFooter}
          onEndReached={() => {
            if (hasMoreCategories && !loadingMoreCategories) {
              loadMoreCategories();
            }
          }}
          onEndReachedThreshold={0.3}
        />
      )}
    </SafeAreaView>
  );
};

export default Search;
