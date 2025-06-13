"use client";

import { useState, useEffect, useRef } from "react";

const useWordPressSearch = () => {
  // Estados para categorías
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);
  const [hasMoreCategories, setHasMoreCategories] = useState(true);
  const [loadingMoreCategories, setLoadingMoreCategories] = useState(false);

  // Estados para búsqueda con SCROLL INFINITO ARREGLADO
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [hasMoreSearchResults, setHasMoreSearchResults] = useState(false);
  const [loadingMoreSearchResults, setLoadingMoreSearchResults] =
    useState(false);
  const [searchPage, setSearchPage] = useState(1);

  // Estado para mostrar/ocultar categorías
  const [showCategories, setShowCategories] = useState(true);

  // Referencias para optimización
  const searchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);
  const searchTimerRef = useRef(null);
  const cacheRef = useRef({
    categories: null,
    searches: new Map(),
    lastCategoriesFetch: 0,
  });

  // Referencias para evitar dependencias circulares
  const allCategoriesRef = useRef([]);
  const hasMoreCategoriesRef = useRef(true);
  const loadingMoreCategoriesRef = useRef(false);
  const isInitializedRef = useRef(false);
  const isMountedRef = useRef(true);

  // Referencias para búsqueda infinita ARREGLADAS
  const currentSearchQueryRef = useRef("");
  const allSearchResultsRef = useRef([]);
  const hasMoreSearchResultsRef = useRef(false);
  const loadingMoreSearchResultsRef = useRef(false);
  const currentSearchPageRef = useRef(1);

  // Constantes OPTIMIZADAS para búsqueda rápida
  const API_BASE_URL = "https://venezuela-news.com/wp-json/wp/v2";
  const DEFAULT_IMAGE =
    "https://imagizer.imageshack.com/img923/6210/PHKISx.jpg";
  const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos
  const SEARCH_DEBOUNCE_DELAY = 100; // 100ms para respuesta más rápida
  const CATEGORIES_PER_PAGE = 3; // Para categorías
  const INITIAL_SEARCH_RESULTS = 5; // Primeros 5 resultados
  const LOAD_MORE_SEARCH_RESULTS = 20; // 20 más al hacer scroll
  const SEARCH_MAX_TIME = 5000; // 5 segundos máximo para búsqueda

  // Sistema de imágenes por categoría
  const categoryImages = {
    Deportes: "https://imagizer.imageshack.com/img923/1453/dN2piG.png",
    deportes: "https://imagizer.imageshack.com/img923/1453/dN2piG.png",
    Destacado: "https://imagizer.imageshack.com/img923/9990/X9BBcE.png",
    destacado: "https://imagizer.imageshack.com/img923/9990/X9BBcE.png",
    Farandula: "https://imagizer.imageshack.com/img924/4678/3GdO9U.png",
    farandula: "https://imagizer.imageshack.com/img924/4678/3GdO9U.png",
    Entretenimiento: "https://imagizer.imageshack.com/img923/470/2kXrWu.png",
    entretenimiento: "https://imagizer.imageshack.com/img923/470/2kXrWu.png",
    Gastronomia: "https://imagizer.imageshack.com/img923/811/8e7Go9.png",
    gastronomia: "https://imagizer.imageshack.com/img923/811/8e7Go9.png",
    Cultura: "https://imagizer.imageshack.com/img924/4586/UzLk6g.png",
    cultura: "https://imagizer.imageshack.com/img924/4586/UzLk6g.png",
    Turismo: "https://imagizer.imageshack.com/img923/5573/iP0DmU.png",
    turismo: "https://imagizer.imageshack.com/img923/5573/iP0DmU.png",
    Viral: "https://imagizer.imageshack.com/img923/8189/ekbUPa.png",
    viral: "https://imagizer.imageshack.com/img923/8189/ekbUPa.png",
    LVBP: "https://imagizer.imageshack.com/img924/4418/gmx2C0.png",
    lvbp: "https://imagizer.imageshack.com/img924/4418/gmx2C0.png",
    Salud: "https://imagizer.imageshack.com/img924/6206/tehlaA.png",
    salud: "https://imagizer.imageshack.com/img924/6206/tehlaA.png",
    Opinion: "https://imagizer.imageshack.com/img924/705/VlQM2M.png",
    opinion: "https://imagizer.imageshack.com/img924/705/VlQM2M.png",
    "Redes Sociales": "https://imagizer.imageshack.com/img924/6135/ZbKSvo.png",
    "redes sociales": "https://imagizer.imageshack.com/img924/6135/ZbKSvo.png",
    Noticias: "https://imagizer.imageshack.com/img923/6210/PHKISx.jpg",
    noticias: "https://imagizer.imageshack.com/img923/6210/PHKISx.jpg",
  };

  // Función para obtener imagen de categoría
  const getCategoryImage = (categoryName) => {
    if (!categoryName) return DEFAULT_IMAGE;

    const exactMatch = categoryImages[categoryName];
    if (exactMatch) return exactMatch;

    const lowerMatch = Object.keys(categoryImages).find(
      (key) => key.toLowerCase() === categoryName.toLowerCase()
    );

    return lowerMatch ? categoryImages[lowerMatch] : DEFAULT_IMAGE;
  };

  // Función para obtener todas las categorías
  const fetchAllCategories = async () => {
    if (isInitializedRef.current || !isMountedRef.current) {
      console.log("🛑 Evitando llamada duplicada a fetchAllCategories");
      return;
    }

    console.log("🚀 Iniciando fetchAllCategories...");
    isInitializedRef.current = true;

    try {
      setCategoriesLoading(true);
      setCategoriesError(null);

      const now = Date.now();
      if (
        cacheRef.current.categories &&
        now - cacheRef.current.lastCategoriesFetch < CACHE_DURATION
      ) {
        console.log("📦 Usando categorías en caché");
        const cachedCategories = cacheRef.current.categories;

        if (!isMountedRef.current) return;

        allCategoriesRef.current = cachedCategories;
        hasMoreCategoriesRef.current =
          cachedCategories.length > CATEGORIES_PER_PAGE;

        setAllCategories(cachedCategories);
        setCategories(cachedCategories.slice(0, CATEGORIES_PER_PAGE));
        setHasMoreCategories(cachedCategories.length > CATEGORIES_PER_PAGE);
        setCategoriesLoading(false);
        return;
      }

      console.log("🌐 Obteniendo categorías desde API...");

      const categoriesResponse = await fetch(
        `${API_BASE_URL}/categories?per_page=100&hide_empty=true&orderby=count&order=desc`
      );

      if (!categoriesResponse.ok) {
        throw new Error("Error al obtener categorías");
      }

      const categoriesData = await categoriesResponse.json();

      if (!isMountedRef.current) return;

      const processedCategories = categoriesData
        .map((category) => ({
          id: category.id,
          title: category.name,
          name: category.name,
          subtitle: `${category.count || 0} Noticias`,
          count: category.count || 0,
          slug: category.slug,
          image: getCategoryImage(category.name),
          hasCustomImage: getCategoryImage(category.name) !== DEFAULT_IMAGE,
          originalName: category.name,
        }))
        .filter((cat) => cat.count > 0)
        .sort((a, b) => b.count - a.count);

      cacheRef.current.categories = processedCategories;
      cacheRef.current.lastCategoriesFetch = now;

      if (!isMountedRef.current) return;

      allCategoriesRef.current = processedCategories;
      hasMoreCategoriesRef.current =
        processedCategories.length > CATEGORIES_PER_PAGE;

      setAllCategories(processedCategories);
      setCategories(processedCategories.slice(0, CATEGORIES_PER_PAGE));
      setHasMoreCategories(processedCategories.length > CATEGORIES_PER_PAGE);

      console.log(
        `✅ ${processedCategories.length} categorías cargadas exitosamente`
      );
    } catch (error) {
      console.error("❌ Error al obtener categorías:", error);
      if (isMountedRef.current) {
        setCategoriesError(error.message);
      }
    } finally {
      if (isMountedRef.current) {
        setCategoriesLoading(false);
      }
    }
  };

  // Función para cargar más categorías (3 por vez)
  const loadMoreCategories = () => {
    if (
      loadingMoreCategoriesRef.current ||
      !hasMoreCategoriesRef.current ||
      !isMountedRef.current
    )
      return;

    console.log("📄 Cargando 3 categorías más...");
    loadingMoreCategoriesRef.current = true;
    setLoadingMoreCategories(true);

    setTimeout(() => {
      if (!isMountedRef.current) return;

      setCategories((prevCategories) => {
        const currentLength = prevCategories.length;
        const nextCategories = allCategoriesRef.current.slice(
          currentLength,
          currentLength + CATEGORIES_PER_PAGE
        );
        const newCategories = [...prevCategories, ...nextCategories];

        const stillHasMore =
          currentLength + CATEGORIES_PER_PAGE < allCategoriesRef.current.length;
        hasMoreCategoriesRef.current = stillHasMore;
        setHasMoreCategories(stillHasMore);

        loadingMoreCategoriesRef.current = false;
        setLoadingMoreCategories(false);

        console.log(
          `✅ Cargadas ${nextCategories.length} categorías adicionales (total: ${newCategories.length})`
        );
        return newCategories;
      });
    }, 200);
  };

  // FUNCIÓN DE BÚSQUEDA ARREGLADA - 5 iniciales, scroll infinito para el resto
  const searchPosts = async (query, page = 1, isLoadMore = false) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      setShowCategories(true);
      setIsSearching(false);
      setHasMoreSearchResults(false);
      setSearchPage(1);
      currentSearchQueryRef.current = "";
      allSearchResultsRef.current = [];
      currentSearchPageRef.current = 1;
      hasMoreSearchResultsRef.current = false;
      return;
    }

    // Si es una nueva búsqueda, resetear todo
    if (!isLoadMore) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Limpiar el timer anterior si existe
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }

      setSearchPage(1);
      currentSearchQueryRef.current = query;
      allSearchResultsRef.current = [];
      currentSearchPageRef.current = 1;
      hasMoreSearchResultsRef.current = false;
    }

    // Determinar cuántos resultados cargar
    const resultsPerPage = isLoadMore
      ? LOAD_MORE_SEARCH_RESULTS
      : INITIAL_SEARCH_RESULTS;

    const cacheKey = `${query
      .toLowerCase()
      .trim()}_page_${page}_${resultsPerPage}`;
    if (cacheRef.current.searches.has(cacheKey) && !isLoadMore) {
      console.log("⚡ Usando resultados de búsqueda en caché");
      const cachedResults = cacheRef.current.searches.get(cacheKey);
      setSearchResults(cachedResults.results);
      setHasMoreSearchResults(cachedResults.hasMore);
      setShowCategories(false);
      setIsSearching(true);
      allSearchResultsRef.current = cachedResults.results;
      hasMoreSearchResultsRef.current = cachedResults.hasMore;
      currentSearchPageRef.current = 1;
      return;
    }

    try {
      const startTime = performance.now();

      if (!isLoadMore) {
        setSearchLoading(true);
        setSearchError(null);
        setIsSearching(true);
        setShowCategories(false);
      } else {
        setLoadingMoreSearchResults(true);
        loadingMoreSearchResultsRef.current = true;
      }

      abortControllerRef.current = new AbortController();

      // Configurar un timer para abortar la búsqueda después de 5 segundos
      searchTimerRef.current = setTimeout(() => {
        if (abortControllerRef.current) {
          console.log("⏱️ Búsqueda abortada por límite de tiempo (5s)");
          abortControllerRef.current.abort();
        }
      }, SEARCH_MAX_TIME);

      // URL optimizada con cantidad variable de resultados
      const searchUrl = `${API_BASE_URL}/posts?search=${encodeURIComponent(
        query
      )}&per_page=${resultsPerPage}&page=${page}&_fields=id,title,excerpt,slug,date,link,featured_media,_links&_embed=wp:featuredmedia,wp:term`;

      console.log(
        `🔍 Búsqueda - Página ${page}, Query: "${query}", Resultados: ${resultsPerPage}, IsLoadMore: ${isLoadMore}`
      );

      const searchResponse = await fetch(searchUrl, {
        signal: abortControllerRef.current.signal,
      });

      // Limpiar el timer ya que la búsqueda se completó
      clearTimeout(searchTimerRef.current);

      if (!searchResponse.ok) {
        throw new Error("Error al realizar la búsqueda");
      }

      const searchData = await searchResponse.json();

      // Obtener información de paginación
      const totalPages = parseInt(
        searchResponse.headers.get("X-WP-TotalPages") || "1"
      );
      const totalPosts = parseInt(
        searchResponse.headers.get("X-WP-Total") || "0"
      );
      const currentPage = page;

      // Determinar si hay más resultados (lógica ARREGLADA)
      const hasMoreByPages = currentPage < totalPages;
      const hasMoreByResults = searchData.length === resultsPerPage;
      const hasMore =
        hasMoreByPages &&
        hasMoreByResults &&
        totalPosts > allSearchResultsRef.current.length + searchData.length;

      console.log(
        `📊 Paginación ARREGLADA - Página: ${currentPage}/${totalPages}, Posts: ${searchData.length}, Total: ${totalPosts}, HasMore: ${hasMore}`
      );

      // Procesar resultados con optimización de imagen
      const formattedResults = searchData.map((post) => ({
        id: post.id,
        headline: post.title?.rendered || "Sin título",
        excerpt: post.excerpt?.rendered || "",
        content: "",
        slug: post.slug,
        time: post.date,
        img: getPostFeaturedImageOptimized(post),
        category: getPostCategory(post),
        categoryImage: DEFAULT_IMAGE,
        read_time: calculateReadTime(post.excerpt?.rendered || ""),
        link: post.link,
      }));

      // Gestión de resultados ARREGLADA
      if (isLoadMore) {
        const newResults = [
          ...allSearchResultsRef.current,
          ...formattedResults,
        ];
        allSearchResultsRef.current = newResults;
        setSearchResults(newResults);
        setSearchPage(page);
        currentSearchPageRef.current = page;
      } else {
        allSearchResultsRef.current = formattedResults;
        setSearchResults(formattedResults);
        setSearchPage(1);
        currentSearchPageRef.current = 1;
      }

      setHasMoreSearchResults(hasMore);
      hasMoreSearchResultsRef.current = hasMore;

      // Gestión de caché optimizada
      if (cacheRef.current.searches.size >= 50) {
        const firstKey = cacheRef.current.searches.keys().next().value;
        cacheRef.current.searches.delete(firstKey);
      }
      cacheRef.current.searches.set(cacheKey, {
        results: isLoadMore
          ? [...allSearchResultsRef.current]
          : formattedResults,
        hasMore: hasMore,
        timestamp: Date.now(),
      });

      const endTime = performance.now();
      console.log(
        `⚡ Búsqueda completada en ${(endTime - startTime).toFixed(2)}ms - ${
          formattedResults.length
        } resultados`
      );
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error en búsqueda:", error);
        setSearchError("Error en la búsqueda. Intenta de nuevo.");
      } else {
        console.log("⏱️ Búsqueda cancelada por límite de tiempo (5s)");
        // Si tenemos resultados parciales, mostrarlos
        if (allSearchResultsRef.current.length > 0) {
          setSearchResults(allSearchResultsRef.current);
          setHasMoreSearchResults(true);
          hasMoreSearchResultsRef.current = true;
        } else {
          setSearchError(
            "La búsqueda tomó demasiado tiempo. Intenta con términos más específicos."
          );
        }
      }
    } finally {
      // Limpiar el timer si aún existe
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }

      if (!isLoadMore) {
        setSearchLoading(false);
      } else {
        setLoadingMoreSearchResults(false);
        loadingMoreSearchResultsRef.current = false;
      }
    }
  };

  // Función para obtener la categoría del post
  const getPostCategory = (post) => {
    try {
      if (post._embedded && post._embedded["wp:term"]) {
        const categories = post._embedded["wp:term"].find(
          (terms) => terms.length > 0 && terms[0].taxonomy === "category"
        );
        if (categories && categories.length > 0) {
          return categories[0].name;
        }
      }
      return "General";
    } catch (error) {
      console.warn("Error obteniendo categoría:", error);
      return "General";
    }
  };

  // Función ARREGLADA para cargar más resultados de búsqueda
  const loadMoreSearchResults = () => {
    console.log("🔍 Intentando cargar más resultados...");
    console.log(
      "loadingMoreSearchResultsRef.current:",
      loadingMoreSearchResultsRef.current
    );
    console.log(
      "hasMoreSearchResultsRef.current:",
      hasMoreSearchResultsRef.current
    );
    console.log(
      "currentSearchQueryRef.current:",
      currentSearchQueryRef.current
    );
    console.log("isMountedRef.current:", isMountedRef.current);

    if (
      loadingMoreSearchResultsRef.current ||
      !hasMoreSearchResultsRef.current ||
      !currentSearchQueryRef.current ||
      !isMountedRef.current
    ) {
      console.log(
        "🛑 No se pueden cargar más resultados - condiciones no cumplidas"
      );
      return;
    }

    console.log("🔍 Cargando más resultados de búsqueda...");
    loadingMoreSearchResultsRef.current = true;
    const nextPage = currentSearchPageRef.current + 1;
    console.log("Página siguiente:", nextPage);
    searchPosts(currentSearchQueryRef.current, nextPage, true);
  };

  // Manejar cambios en el input de búsqueda - OPTIMIZADO
  const handleSearchInputChange = (text) => {
    setSearchQuery(text);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (text.length >= 3) {
      searchTimeoutRef.current = setTimeout(() => {
        searchPosts(text, 1, false); // Nueva búsqueda desde página 1
      }, SEARCH_DEBOUNCE_DELAY); // 100ms para respuesta más rápida
    } else {
      setSearchResults([]);
      setShowCategories(true);
      setIsSearching(false);
      setHasMoreSearchResults(false);
      setSearchPage(1);
      currentSearchQueryRef.current = "";
      allSearchResultsRef.current = [];
      currentSearchPageRef.current = 1;
      hasMoreSearchResultsRef.current = false;
    }
  };

  // Limpiar búsqueda
  const clearSearch = () => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setSearchQuery("");
    setSearchResults([]);
    setShowCategories(true);
    setIsSearching(false);
    setHasMoreSearchResults(false);
    setSearchPage(1);
    currentSearchQueryRef.current = "";
    allSearchResultsRef.current = [];
    currentSearchPageRef.current = 1;
    hasMoreSearchResultsRef.current = false;
    loadingMoreSearchResultsRef.current = false;
  };

  // Función OPTIMIZADA para obtener imagen destacada del post
  const getPostFeaturedImageOptimized = (post) => {
    try {
      if (post._embedded?.["wp:featuredmedia"]?.[0]) {
        const featuredMedia = post._embedded["wp:featuredmedia"][0];

        // Priorizar tamaños más pequeños para carga rápida
        const imageSource =
          featuredMedia?.media_details?.sizes?.thumbnail?.source_url || // Más pequeña primero
          featuredMedia?.media_details?.sizes?.medium?.source_url ||
          featuredMedia?.media_details?.sizes?.medium_large?.source_url ||
          featuredMedia?.source_url ||
          featuredMedia?.guid?.rendered;

        if (imageSource && typeof imageSource === "string") {
          let imageUrl = imageSource.trim();
          if (imageUrl.startsWith("http://")) {
            imageUrl = imageUrl.replace("http://", "https://");
          }
          return imageUrl;
        }
      }
      return DEFAULT_IMAGE;
    } catch (error) {
      console.warn(`❌ Error obteniendo imagen para post ${post.id}:`, error);
      return DEFAULT_IMAGE;
    }
  };

  // Función para calcular tiempo de lectura
  const calculateReadTime = (content) => {
    if (!content) return 1;
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200)); // 200 palabras por minuto
  };

  // Limpiar caché
  const clearCache = () => {
    cacheRef.current = {
      categories: null,
      searches: new Map(),
      lastCategoriesFetch: 0,
    };
    isInitializedRef.current = false;
    console.log("🗑️ Caché limpiado");
  };

  // useEffect principal
  useEffect(() => {
    console.log("🔄 Hook montado, iniciando carga de categorías...");
    fetchAllCategories();

    return () => {
      console.log("🔄 Hook desmontado, limpiando recursos...");
      isMountedRef.current = false;

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    // Estados
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

    // Funciones principales
    handleSearchInputChange,
    searchPosts,
    clearSearch,
    fetchCategories: fetchAllCategories,
    refreshCategories: fetchAllCategories,
    loadMoreCategories,
    loadMoreSearchResults,
    clearCache,

    // Utilidades
    DEFAULT_IMAGE,
    categoryImages,
    getCategoryImage,
    INITIAL_SEARCH_RESULTS,
    LOAD_MORE_SEARCH_RESULTS,
    SEARCH_MAX_TIME,
  };
};

export default useWordPressSearch;
