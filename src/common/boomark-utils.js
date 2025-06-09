import AsyncStorage from "@react-native-async-storage/async-storage";

// Claves para AsyncStorage
const BOOKMARKS_KEY = "bookmarkedNews";
const BOOKMARKS_DETAILS_KEY = "bookmarkedNewsDetails";

/**
 * Verifica si una noticia está en bookmarks
 * @param {string} newsId - ID de la noticia
 * @returns {Promise<boolean>} - true si está bookmarked, false si no
 */
export const isNewsBookmarked = async (newsId) => {
  try {
    if (!newsId) return false;

    const existingBookmarks = await AsyncStorage.getItem(BOOKMARKS_KEY);
    const bookmarkedData = existingBookmarks
      ? JSON.parse(existingBookmarks)
      : {};

    // Buscar en todas las categorías
    for (const category in bookmarkedData) {
      if (bookmarkedData[category].includes(newsId)) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error verificando estado de bookmark:", error);
    return false;
  }
};

/**
 * Agrega una noticia a bookmarks organizados por categoría
 * @param {Object} newsItem - Objeto de la noticia
 * @returns {Promise<boolean>} - true si se agregó exitosamente
 */
export const addNewsBookmark = async (newsItem) => {
  try {
    if (!newsItem) {
      console.error("No se proporcionó un item de noticia válido");
      return false;
    }

    const newsId = newsItem.id || newsItem._id || newsItem.slug;
    const category = newsItem.category || "General";

    if (!newsId) {
      console.error("No se encontró ID para la noticia");
      return false;
    }

    // 1. Obtener bookmarks existentes organizados por categoría
    const existingBookmarks = await AsyncStorage.getItem(BOOKMARKS_KEY);
    const bookmarkedData = existingBookmarks
      ? JSON.parse(existingBookmarks)
      : {};

    // Inicializar la categoría si no existe
    if (!bookmarkedData[category]) {
      bookmarkedData[category] = [];
    }

    // Verificar si ya existe en esta categoría
    if (!bookmarkedData[category].includes(newsId)) {
      // Agregar el ID a la categoría correspondiente
      bookmarkedData[category].push(newsId);

      // Guardar la estructura actualizada
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarkedData));
    }

    // 2. Guardar detalles completos de la noticia
    const bookmarkedDetails = await AsyncStorage.getItem(BOOKMARKS_DETAILS_KEY);
    const detailsArray = bookmarkedDetails ? JSON.parse(bookmarkedDetails) : [];

    // Verificar si ya existe en los detalles
    const existsInDetails = detailsArray.some((news) => {
      const detailId = news.id || news._id || news.slug;
      return detailId === newsId;
    });

    if (!existsInDetails) {
      detailsArray.push({
        ...newsItem,
        category,
        bookmarkedAt: new Date().toISOString(),
      });

      await AsyncStorage.setItem(
        BOOKMARKS_DETAILS_KEY,
        JSON.stringify(detailsArray)
      );
    }

    return true;
  } catch (error) {
    console.error("Error agregando bookmark:", error);
    return false;
  }
};

/**
 * Elimina una noticia de bookmarks
 * @param {string} newsId - ID de la noticia
 * @returns {Promise<boolean>} - true si se eliminó exitosamente
 */
export const removeNewsBookmark = async (newsId) => {
  try {
    if (!newsId) {
      console.error("No se proporcionó un ID válido");
      return false;
    }

    // 1. Eliminar de la estructura organizada por categorías
    const existingBookmarks = await AsyncStorage.getItem(BOOKMARKS_KEY);
    const bookmarkedData = existingBookmarks
      ? JSON.parse(existingBookmarks)
      : {};

    let removedFromCategory = null;

    // Buscar y eliminar de todas las categorías
    for (const category in bookmarkedData) {
      const index = bookmarkedData[category].indexOf(newsId);
      if (index > -1) {
        bookmarkedData[category].splice(index, 1);
        removedFromCategory = category;

        // Si la categoría queda vacía, eliminarla
        if (bookmarkedData[category].length === 0) {
          delete bookmarkedData[category];
        }
        break;
      }
    }

    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarkedData));

    // 2. Eliminar de los detalles
    const bookmarkedDetails = await AsyncStorage.getItem(BOOKMARKS_DETAILS_KEY);
    let detailsArray = bookmarkedDetails ? JSON.parse(bookmarkedDetails) : [];

    detailsArray = detailsArray.filter((news) => {
      const detailId = news.id || news._id || news.slug;
      return detailId !== newsId;
    });

    await AsyncStorage.setItem(
      BOOKMARKS_DETAILS_KEY,
      JSON.stringify(detailsArray)
    );

    if (removedFromCategory) {
      console.log(
        `✅ Bookmark eliminado - ID: ${newsId} de categoría: ${removedFromCategory}`
      );
    }

    return true;
  } catch (error) {
    console.error("Error eliminando bookmark:", error);
    return false;
  }
};

/**
 * Alterna el estado de bookmark de una noticia
 * @param {Object} newsItem - Objeto de la noticia
 * @returns {Promise<boolean>} - true si la operación fue exitosa
 */
export const toggleNewsBookmark = async (newsItem) => {
  try {
    const newsId = newsItem.id || newsItem._id || newsItem.slug;

    if (!newsId) {
      console.error("No se encontró ID para la noticia");
      return false;
    }

    const isBookmarked = await isNewsBookmarked(newsId);

    if (isBookmarked) {
      return await removeNewsBookmark(newsId);
    } else {
      return await addNewsBookmark(newsItem);
    }
  } catch (error) {
    console.error("Error alternando estado de bookmark:", error);
    return false;
  }
};

/**
 * Obtiene todos los bookmarks organizados por categoría
 * @returns {Promise<Object>} - Objeto con categorías como keys y arrays de IDs como values
 */
export const getAllBookmarksByCategory = async () => {
  try {
    const existingBookmarks = await AsyncStorage.getItem(BOOKMARKS_KEY);
    return existingBookmarks ? JSON.parse(existingBookmarks) : {};
  } catch (error) {
    console.error("Error obteniendo bookmarks por categoría:", error);
    return {};
  }
};

/**
 * Obtiene todos los IDs de una categoría específica
 * @param {string} category - Nombre de la categoría
 * @returns {Promise<Array>} - Array de IDs de noticias
 */
export const getBookmarksByCategory = async (category) => {
  try {
    const allBookmarks = await getAllBookmarksByCategory();
    return allBookmarks[category] || [];
  } catch (error) {
    console.error(
      `Error obteniendo bookmarks de categoría ${category}:`,
      error
    );
    return [];
  }
};

/**
 * Obtiene todas las categorías que tienen bookmarks
 * @returns {Promise<Array>} - Array de nombres de categorías
 */
export const getBookmarkedCategories = async () => {
  try {
    const allBookmarks = await getAllBookmarksByCategory();
    return Object.keys(allBookmarks).sort();
  } catch (error) {
    console.error("Error obteniendo categorías:", error);
    return [];
  }
};

/**
 * Obtiene el conteo de bookmarks por categoría
 * @returns {Promise<Object>} - Objeto con categorías y sus conteos
 */
export const getBookmarkCounts = async () => {
  try {
    const allBookmarks = await getAllBookmarksByCategory();
    const counts = {};

    for (const category in allBookmarks) {
      counts[category] = allBookmarks[category].length;
    }

    return counts;
  } catch (error) {
    console.error("Error obteniendo conteos de bookmarks:", error);
    return {};
  }
};

/**
 * Obtiene el total de bookmarks
 * @returns {Promise<number>} - Número total de bookmarks
 */
export const getTotalBookmarks = async () => {
  try {
    const allBookmarks = await getAllBookmarksByCategory();
    let total = 0;

    for (const category in allBookmarks) {
      total += allBookmarks[category].length;
    }

    return total;
  } catch (error) {
    console.error("Error obteniendo total de bookmarks:", error);
    return 0;
  }
};

/**
 * Obtiene todos los detalles de noticias bookmarked
 * @returns {Promise<Array>} - Array de objetos de noticias
 */
export const getAllBookmarkedNewsDetails = async () => {
  try {
    const bookmarkedDetails = await AsyncStorage.getItem(BOOKMARKS_DETAILS_KEY);
    return bookmarkedDetails ? JSON.parse(bookmarkedDetails) : [];
  } catch (error) {
    console.error("Error obteniendo detalles de bookmarks:", error);
    return [];
  }
};

/**
 * Limpia todos los bookmarks
 * @returns {Promise<boolean>} - true si se limpiaron exitosamente
 */
export const clearAllBookmarks = async () => {
  try {
    await AsyncStorage.removeItem(BOOKMARKS_KEY);
    await AsyncStorage.removeItem(BOOKMARKS_DETAILS_KEY);
    console.log("✅ Todos los bookmarks han sido eliminados");
    return true;
  } catch (error) {
    console.error("Error limpiando bookmarks:", error);
    return false;
  }
};

/**
 * Función de debug para mostrar la estructura de bookmarks
 */
export const debugBookmarks = async () => {
  try {
    const bookmarksByCategory = await getAllBookmarksByCategory();
    const counts = await getBookmarkCounts();
    const total = await getTotalBookmarks();

    console.log("📊 ESTRUCTURA DE BOOKMARKS:");
    console.log("Por categoría:", bookmarksByCategory);
    console.log("Conteos:", counts);
    console.log("Total:", total);

    return {
      byCategory: bookmarksByCategory,
      counts,
      total,
    };
  } catch (error) {
    console.error("Error en debug de bookmarks:", error);
    return null;
  }
};
