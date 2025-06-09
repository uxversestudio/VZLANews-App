"use client";

import {
  View,
  Text,
  useColorScheme,
  Image,
  TouchableOpacity,
} from "react-native";
import { getStyles } from "../styles/common";
import { colors, tStyles } from "../common/theme";
import { ellipString } from "../common/helpers";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import "moment/locale/es";

const NewsListItem = ({ item, onPress }) => {
  const mode = useColorScheme();
  const [isBookmarkedState, setIsBookmarkedState] = React.useState(false);

  // Check if item is bookmarked on component mount
  React.useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        const existingBookmarks = await AsyncStorage.getItem("bookmarkedNews");
        const bookmarkedIds = existingBookmarks
          ? JSON.parse(existingBookmarks)
          : [];
        const newsId = item.id || item._id || item.slug;

        if (newsId) {
          setIsBookmarkedState(bookmarkedIds.includes(newsId));
        }
      } catch (error) {
        console.error("Error checking bookmark status:", error);
      }
    };

    checkBookmarkStatus();
  }, [item]);

  const isBookmarked = () => isBookmarkedState;

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Reciente";

    try {
      return moment(dateString).fromNow();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Reciente";
    }
  };

  // Handle bookmark toggle
  const handleBookmarkPress = async (e) => {
    e.stopPropagation(); // Evita que se active el onPress principal

    try {
      // Obtener bookmarks existentes
      const existingBookmarks = await AsyncStorage.getItem("bookmarkedNews");
      let bookmarkedIds = existingBookmarks
        ? JSON.parse(existingBookmarks)
        : [];

      const newsId = item.id || item._id || item.slug; // Usar el ID disponible

      if (!newsId) {
        console.error("No se encontró ID para la noticia:", item);
        return;
      }

      const isCurrentlyBookmarked = bookmarkedIds.includes(newsId);

      if (isCurrentlyBookmarked) {
        // Remover bookmark
        bookmarkedIds = bookmarkedIds.filter((id) => id !== newsId);
        console.log("📌 Bookmark removido para:", item.headline);
      } else {
        // Agregar bookmark
        bookmarkedIds.push(newsId);
        console.log("📌 Bookmark agregado para:", item.headline);
      }

      // Guardar en AsyncStorage
      await AsyncStorage.setItem(
        "bookmarkedNews",
        JSON.stringify(bookmarkedIds)
      );

      // También guardar los detalles completos de las noticias bookmarked
      const bookmarkedDetails = await AsyncStorage.getItem(
        "bookmarkedNewsDetails"
      );
      let detailsArray = bookmarkedDetails ? JSON.parse(bookmarkedDetails) : [];

      if (isCurrentlyBookmarked) {
        // Remover de detalles
        detailsArray = detailsArray.filter((news) => {
          const detailId = news.id || news._id || news.slug;
          return detailId !== newsId;
        });
      } else {
        // Agregar a detalles (evitar duplicados)
        const existsInDetails = detailsArray.some((news) => {
          const detailId = news.id || news._id || news.slug;
          return detailId === newsId;
        });

        if (!existsInDetails) {
          detailsArray.push({
            ...item,
            bookmarkedAt: new Date().toISOString(),
          });
        }
      }

      await AsyncStorage.setItem(
        "bookmarkedNewsDetails",
        JSON.stringify(detailsArray)
      );

      console.log(
        "✅ Bookmarks actualizados:",
        bookmarkedIds.length,
        "noticias guardadas"
      );
    } catch (error) {
      console.error("❌ Error al manejar bookmark:", error);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onPress && onPress(item)} // ✅ Use the onPress prop correctly
      activeOpacity={0.7}
      style={getStyles(mode).newsItemContainer}
    >
      <Image
        source={{
          uri:
            item.img ||
            "https://via.placeholder.com/300x200/cccccc/666666?text=Venezuela+News",
        }}
        style={getStyles(mode).newsItemImage}
        resizeMode='cover'
      />

      <View style={[tStyles.flex1]}>
        <View style={tStyles.spacedRow}>
          <Text style={getStyles(mode).newsMetaText}>
            {item.category || "General"}{" "}
            <Text style={{ color: colors.gray75 }}>
              • {item.read_time || 3} min lectura
            </Text>
          </Text>
        </View>

        <Text style={getStyles(mode).newsHeadline}>
          {ellipString(item.headline || "Sin título", 60)}
        </Text>

        <Text style={getStyles(mode).newsMetaText}>
          {formatDate(item.time)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default NewsListItem;
