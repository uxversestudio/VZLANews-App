"use client";

import { useState, useEffect } from "react";
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

  // Usar nuestro hook personalizado
  const {
    categories,
    searchResults,
    searchQuery,
    showCategories,
    categoriesLoading,
    categoriesError,
    searchLoading,
    searchError,
    isSearching,
    handleSearchInputChange,
    clearSearch,
    refreshCategories,
  } = useWordPressSearch();

  // Seleccionar categorías populares por defecto
  useEffect(() => {
    if (categories.length > 0 && selected.length === 0) {
      // Seleccionar las 3 categorías con más artículos
      const topCategoryIds = categories.slice(0, 3).map((cat) => cat.id);

      setSelected(topCategoryIds);
    }
  }, [categories, selected]);

  // Manejar la navegación a los resultados de búsqueda
  const handleSearchSubmit = () => {
    if (searchQuery.length >= 3) {
      navigation.navigate("SearchResults", {
        query: searchQuery,
        results: searchResults,
      });
    }
  };

  // Manejar la navegación a los detalles de la noticia
  const handleNewsPress = (newsItem) => {
    navigation.navigate("NewsDetail", { post: newsItem });
  };

  // Manejar la navegación a la categoría
  const handleCategoryPress = (category) => {
    navigation.navigate("TopicNews", { category });
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

      {/* Search Bar */}
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
            placeholder='Buscar noticias...'
            placeholderTextColor='#999'
            value={searchQuery}
            onChangeText={handleSearchInputChange}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType='search'
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <MaterialCommunityIcons name='close' size={20} color='#666' />
            </TouchableOpacity>
          )}
        </View>
      </View>

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

      {/* Search Results */}
      {isSearching && (
        <>
          <View style={{ paddingHorizontal: 15, marginBottom: 10 }}>
            <Text style={getStyles(mode).resultsTitle}>
              Resultados para "{searchQuery}"
            </Text>
          </View>

          {searchLoading ? (
            <View style={getStyles(mode).loadingContainer}>
              <ActivityIndicator size='small' color='#1e3a8a' />
              <Text style={getStyles(mode).loadingText}>Buscando...</Text>
            </View>
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <SearchResultItem item={item} onPress={handleNewsPress} />
              )}
              ListEmptyComponent={
                <View style={getStyles(mode).emptyContainer}>
                  <Text style={getStyles(mode).emptyText}>
                    No se encontraron resultados para "{searchQuery}"
                  </Text>
                </View>
              }
              contentContainerStyle={{
                paddingHorizontal: 15,
                paddingBottom: 20,
              }}
            />
          )}
        </>
      )}

      {/* Category Listing */}
      {showCategories && !categoriesLoading && (
        <>
          <View style={{ paddingHorizontal: 15, marginBottom: 10 }}></View>

          <FlatList
            showsVerticalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ImageCatItem
                item={item}
                selected={selected}
                setSelected={setSelected}
                onPress={() => handleCategoryPress(item)}
              />
            )}
            style={tStyles.flex1}
            contentContainerStyle={[
              { paddingHorizontal: 15, paddingTop: 10, paddingBottom: 90 },
            ]}
            numColumns={2}
            columnWrapperStyle={tStyles.spacedRow}
            ItemSeparatorComponent={<View style={{ height: 15 }} />}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default Search;
