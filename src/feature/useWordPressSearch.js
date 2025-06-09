"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";

/**
 * Hook optimizado para interactuar con la API de WordPress
 * - Cache de datos para evitar consultas repetidas
 * - Debouncing para búsquedas
 * - Consultas paralelas optimizadas
 * - Reducción de llamadas a la API
 */
const useWordPressSearch = () => {
  // Estados para categorías
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  // Estados para búsqueda
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Estado para mostrar/ocultar categorías
  const [showCategories, setShowCategories] = useState(true);

  // Referencias para optimización
  const searchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);
  const cacheRef = useRef({
    categories: null,
    searches: new Map(),
    lastCategoriesFetch: 0,
  });

  // Constantes
  const API_BASE_URL = "https://venezuela-news.com/wp-json/wp/v2";
  const DEFAULT_IMAGE =
    "https://venezuela-news.com/wp-content/uploads/2025/01/logo-VN-azul-2025.png";
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  const SEARCH_DEBOUNCE_DELAY = 300; // 300ms

  // Memoizar imágenes de categorías para evitar recrearlas
  const categoryImages = useMemo(
    () => ({
      Nacionales:
        "https://venezuela-news.com/wp-content/uploads/2023/01/nacionales.jpg",
      Internacionales:
        "https://venezuela-news.com/wp-content/uploads/2023/01/internacionales.jpg",
      Política:
        "https://venezuela-news.com/wp-content/uploads/2023/01/politica.jpg",
      Economía:
        "https://venezuela-news.com/wp-content/uploads/2023/01/economia.jpg",
      Deportes:
        "https://venezuela-news.com/wp-content/uploads/2023/01/deportes.jpg",
      Entretenimiento:
        "https://venezuela-news.com/wp-content/uploads/2023/01/entretenimiento.jpg",
      Tecnología:
        "https://venezuela-news.com/wp-content/uploads/2023/01/tecnologia.jpg",
      Salud: "https://venezuela-news.com/wp-content/uploads/2023/01/salud.jpg",
      Opinión:
        "https://venezuela-news.com/wp-content/uploads/2023/01/opinion.jpg",
    }),
    []
  );

  /**
   * Función optimizada para obtener categorías con conteos
   * Usa una sola consulta para obtener posts con categorías incluidas
   */
  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      setCategoriesError(null);

      // Verificar cache
      const now = Date.now();
      if (
        cacheRef.current.categories &&
        now - cacheRef.current.lastCategoriesFetch < CACHE_DURATION
      ) {
        console.log("📦 Using cached categories");
        setCategories(cacheRef.current.categories);
        setCategoriesLoading(false);
        return;
      }

      console.log("🚀 Fetching fresh categories data...");

      // Estrategia optimizada: obtener posts recientes con categorías embebidas
      // Esto nos da tanto las categorías como una estimación de su actividad
      const [categoriesResponse, recentPostsResponse] = await Promise.all([
        fetch(
          `${API_BASE_URL}/categories?per_page=50&hide_empty=true&orderby=count&order=desc`
        ),
        fetch(`${API_BASE_URL}/posts?per_page=100&_embed=wp:term`),
      ]);

      if (!categoriesResponse.ok || !recentPostsResponse.ok) {
        throw new Error("Error al obtener datos");
      }

      const [categoriesData, recentPosts] = await Promise.all([
        categoriesResponse.json(),
        recentPostsResponse.json(),
      ]);

      // Contar posts por categoría basado en posts recientes
      const categoryPostCounts = {};
      recentPosts.forEach((post) => {
        if (
          post._embedded &&
          post._embedded["wp:term"] &&
          post._embedded["wp:term"][0]
        ) {
          post._embedded["wp:term"][0].forEach((category) => {
            categoryPostCounts[category.id] =
              (categoryPostCounts[category.id] || 0) + 1;
          });
        }
      });

      // Combinar datos de categorías con conteos estimados
      const categoriesWithCounts = categoriesData
        .map((category) => ({
          id: category.id,
          title: category.name,
          subtitle: `${
            categoryPostCounts[category.id] || category.count || 0
          } Noticias`,
          count: categoryPostCounts[category.id] || category.count || 0,
          slug: category.slug,
          image: getDefaultCategoryImage(category.name),
        }))
        .filter((cat) => cat.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 20); // Limitar a las 20 categorías más activas

      // Guardar en cache
      cacheRef.current.categories = categoriesWithCounts;
      cacheRef.current.lastCategoriesFetch = now;

      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategoriesError(error.message);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  /**
   * Función de búsqueda optimizada con debouncing y cache
   */
  const searchPosts = useCallback(async (query) => {
    // No buscar si hay menos de 3 caracteres
    if (!query || query.length < 3) {
      setSearchResults([]);
      setShowCategories(true);
      setIsSearching(false);
      return;
    }

    // Cancelar búsqueda anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Verificar cache de búsqueda
    const cacheKey = query.toLowerCase().trim();
    if (cacheRef.current.searches.has(cacheKey)) {
      console.log("📦 Using cached search results for:", query);
      const cachedResults = cacheRef.current.searches.get(cacheKey);
      setSearchResults(cachedResults);
      setShowCategories(false);
      setIsSearching(true);
      return;
    }

    try {
      setSearchLoading(true);
      setSearchError(null);
      setIsSearching(true);
      setShowCategories(false);

      // Crear nuevo AbortController para esta búsqueda
      abortControllerRef.current = new AbortController();

      console.log("🔍 Searching for:", query);

      const searchResponse = await fetch(
        `${API_BASE_URL}/posts?search=${encodeURIComponent(
          query
        )}&per_page=20&_embed=1&_fields=id,title,excerpt,content,slug,date,link,_links,_embedded`,
        {
          signal: abortControllerRef.current.signal,
        }
      );

      if (!searchResponse.ok) {
        throw new Error("Error al realizar la búsqueda");
      }

      const searchData = await searchResponse.json();

      // Transformar los resultados de forma optimizada
      const formattedResults = searchData.map((post) => ({
        id: post.id,
        headline: post.title?.rendered || "Sin título",
        excerpt: post.excerpt?.rendered || "",
        content: post.content?.rendered || "",
        slug: post.slug,
        time: post.date,
        img: getPostFeaturedImageOptimized(post) || "",
        category: getCategoryNameFromPostOptimized(post),
        read_time: calculateReadTimeOptimized(post.content?.rendered || ""),
        link: post.link,
      }));
      const imx = searchData.map((post) => console.log(post));
      console.log(imx, "=============");

      // Guardar en cache (limitar cache a 50 búsquedas)
      if (cacheRef.current.searches.size >= 50) {
        const firstKey = cacheRef.current.searches.keys().next().value;
        cacheRef.current.searches.delete(firstKey);
      }
      cacheRef.current.searches.set(cacheKey, formattedResults);

      setSearchResults(formattedResults);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error searching posts:", error);
        setSearchError(error.message);
      }
    } finally {
      setSearchLoading(false);
    }
  }, []);

  /**
   * Función optimizada para manejar cambios en el input con debouncing
   */
  const handleSearchInputChange = useCallback(
    (text) => {
      setSearchQuery(text);

      // Limpiar timeout anterior
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      if (text.length >= 3) {
        // Debouncing: esperar antes de buscar
        searchTimeoutRef.current = setTimeout(() => {
          searchPosts(text);
        }, SEARCH_DEBOUNCE_DELAY);
      } else {
        setSearchResults([]);
        setShowCategories(true);
        setIsSearching(false);
      }
    },
    [searchPosts]
  );

  /**
   * Función para limpiar la búsqueda
   */
  const clearSearch = useCallback(() => {
    // Cancelar búsquedas pendientes
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setSearchQuery("");
    setSearchResults([]);
    setShowCategories(true);
    setIsSearching(false);
  }, []);

  /**
   * Función optimizada para obtener imagen destacada
   */ const getPostFeaturedImageOptimized = useCallback(
    (post) => {
      try {
        // Verificar si hay medios incrustados
        if (!post._embedded || !post._embedded["wp:featuredmedia"]) {
          return DEFAULT_IMAGE;
        }

        // Obtener el primer elemento de medios destacados
        const featuredMedia = post._embedded["wp:featuredmedia"][0];

        // Intentar obtener la imagen en diferentes tamaños (orden de prioridad)
        const imageSource =
          featuredMedia?.media_details?.sizes?.full?.source_url || // Tamaño completo
          featuredMedia?.media_details?.sizes?.large?.source_url || // Grande
          featuredMedia?.media_details?.sizes?.medium_large?.source_url || // Mediano grande
          featuredMedia?.media_details?.sizes?.medium?.source_url || // Mediano
          featuredMedia?.source_url || // URL original
          featuredMedia?.media_details?.sizes?.thumbnail?.source_url; // Miniatura

        // Si encontramos una imagen válida
        if (imageSource && typeof imageSource === "string") {
          // Asegurar HTTPS y limpiar la URL
          let imageUrl = imageSource.trim();
          if (imageUrl.startsWith("http://")) {
            imageUrl = imageUrl.replace("http://", "https://");
          }
          return imageUrl;
        }
      } catch (error) {
        console.warn("Error getting featured image:", error);
      }

      // Si todo falla, devolver la imagen por defecto
      return DEFAULT_IMAGE;
    },
    [DEFAULT_IMAGE]
  );
  /**
   * Función optimizada para obtener nombre de categoría
   */
  const getCategoryNameFromPostOptimized = useCallback((post) => {
    try {
      const terms = post._embedded?.["wp:term"]?.[0];
      if (terms && terms.length > 0) {
        return terms[0].name;
      }
    } catch (error) {
      console.warn("Error getting category name:", error);
    }
    return "General";
  }, []);

  /**
   * Función optimizada para calcular tiempo de lectura
   */
  const calculateReadTimeOptimized = useCallback((content) => {
    if (!content) return 1;

    try {
      // Usar regex más eficiente para eliminar HTML
      const text = content.replace(/<[^>]*>/g, "");
      const words = text.trim().split(/\s+/).length;
      const readTimeMinutes = Math.ceil(words / 200);
      return readTimeMinutes > 0 ? readTimeMinutes : 1;
    } catch (error) {
      return 1;
    }
  }, []);

  /**
   * Función para obtener imagen por defecto de categoría
   */
  const getDefaultCategoryImage = useCallback(
    (categoryName) => {
      return categoryImages[categoryName] || DEFAULT_IMAGE;
    },
    [categoryImages]
  );

  /**
   * Función para limpiar cache manualmente
   */
  const clearCache = useCallback(() => {
    cacheRef.current = {
      categories: null,
      searches: new Map(),
      lastCategoriesFetch: 0,
    };
    console.log("🗑️ Cache cleared");
  }, []);

  // Cargar categorías al montar el componente
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    // Datos
    categories,
    searchResults,
    searchQuery,
    showCategories,

    // Estados
    categoriesLoading,
    categoriesError,
    searchLoading,
    searchError,
    isSearching,

    // Funciones
    handleSearchInputChange,
    searchPosts,
    clearSearch,
    refreshCategories: fetchCategories,
    clearCache,

    // Constantes útiles
    DEFAULT_IMAGE,
  };
};

export default useWordPressSearch;
