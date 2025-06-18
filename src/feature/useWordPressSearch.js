"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const useWordPressSearch = () => {
  // Estados para categorías
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);
  const [hasMoreCategories, setHasMoreCategories] = useState(true);
  const [loadingMoreCategories, setLoadingMoreCategories] = useState(false);

  // Estados para búsqueda con SCROLL INFINITO OPTIMIZADO
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

  // Referencias para optimización MEJORADAS
  const searchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);
  const searchTimerRef = useRef(null);
  const preloadControllerRef = useRef(null);
  const cacheRef = useRef({
    categories: null,
    searches: new Map(),
    preloadedSearches: new Map(),
    lastCategoriesFetch: 0,
    searchMetrics: new Map(), // Para tracking de performance
  });

  // Referencias para evitar dependencias circulares
  const allCategoriesRef = useRef([]);
  const hasMoreCategoriesRef = useRef(true);
  const loadingMoreCategoriesRef = useRef(false);
  const isInitializedRef = useRef(false);
  const isMountedRef = useRef(true);

  // Referencias para búsqueda infinita OPTIMIZADAS
  const currentSearchQueryRef = useRef("");
  const allSearchResultsRef = useRef([]);
  const hasMoreSearchResultsRef = useRef(false);
  const loadingMoreSearchResultsRef = useRef(false);
  const currentSearchPageRef = useRef(1);
  const lastSearchTimeRef = useRef(0);
  const searchSequenceRef = useRef(0);

  // Constantes ULTRA OPTIMIZADAS para búsqueda súper rápida
  const API_BASE_URL = "https://venezuela-news.com/wp-json/wp/v2";
  const DEFAULT_IMAGE =
    "https://imagizer.imageshack.com/img923/6210/PHKISx.jpg";
  const CACHE_DURATION = 15 * 60 * 1000; // 15 minutos (más tiempo)
  const SEARCH_DEBOUNCE_DELAY = 30; // 50ms - MÁS RÁPIDO
  const CATEGORIES_PER_PAGE = 3;
  const INITIAL_SEARCH_RESULTS = 8; // Más resultados iniciales
  const LOAD_MORE_SEARCH_RESULTS = 15; // Menos para cargas más rápidas
  const SEARCH_MAX_TIME = 3000; // 3 segundos - MÁS RÁPIDO
  const PRELOAD_DELAY = 200; // Precargar después de 200ms
  const MAX_CACHE_SIZE = 100; // Más caché
  const PRIORITY_SEARCH_THRESHOLD = 1; // Caracteres para búsqueda prioritaria

  // Sistema de imágenes por categoría (mantenido igual)
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

  // Función memoizada para obtener imagen de categoría
  const getCategoryImage = useCallback((categoryName) => {
    if (!categoryName) return DEFAULT_IMAGE;

    const exactMatch = categoryImages[categoryName];
    if (exactMatch) return exactMatch;

    const lowerMatch = Object.keys(categoryImages).find(
      (key) => key.toLowerCase() === categoryName.toLowerCase()
    );

    return lowerMatch ? categoryImages[lowerMatch] : DEFAULT_IMAGE;
  }, []);

  // NUEVA: Función para precargar búsquedas populares
  const preloadPopularSearches = useCallback(async (query) => {
    if (query.length < PRIORITY_SEARCH_THRESHOLD) return;
    const popularTerms = [
      query + "s",
      query.slice(0, -1),
      query + " venezuela",
      query + " noticias",
    ];

    popularTerms.forEach((term) => {
      if (term.length >= 3 && !cacheRef.current.preloadedSearches.has(term)) {
        setTimeout(() => {
          fetch(
            `${API_BASE_URL}/posts?search=${encodeURIComponent(
              term
            )}&per_page=3&_fields=id,title,excerpt,slug,date,link,featured_media,_links&_embed=wp:featuredmedia,wp:term`
          )
            .then((res) => res.json())
            .then((data) => {
              cacheRef.current.preloadedSearches.set(term, {
                data,
                timestamp: Date.now(),
              });
            });
        }, 200);
      }
    });
  }, []);

  // Función para obtener todas las categorías (mantenida igual pero optimizada)
  const fetchAllCategories = useCallback(async () => {
    if (isInitializedRef.current || !isMountedRef.current) {
      console.log("🛑 Evitando llamada duplicada a fetchAllCategories");
      return;
    }

    console.log("🚀 Iniciando fetchAllCategories OPTIMIZADO...");
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

      console.log("🌐 Obteniendo categorías desde API OPTIMIZADO...");

      // URL optimizada con menos campos
      const categoriesResponse = await fetch(
        `${API_BASE_URL}/categories?per_page=100&hide_empty=true&orderby=count&order=desc&_fields=id,name,count,slug`
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
        `✅ ${processedCategories.length} categorías cargadas SÚPER RÁPIDO`
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
  }, [getCategoryImage]);

  // Función para cargar más categorías (optimizada)
  const loadMoreCategories = useCallback(() => {
    if (
      loadingMoreCategoriesRef.current ||
      !hasMoreCategoriesRef.current ||
      !isMountedRef.current
    )
      return;

    console.log("📄 Cargando 3 categorías más RÁPIDO...");
    loadingMoreCategoriesRef.current = true;
    setLoadingMoreCategories(true);

    // Usar requestAnimationFrame para mejor performance
    requestAnimationFrame(() => {
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
          `⚡ Cargadas ${nextCategories.length} categorías ULTRA RÁPIDO`
        );
        return newCategories;
      });
    });
  }, []);

  // FUNCIÓN DE BÚSQUEDA ULTRA OPTIMIZADA
  const searchPosts = useCallback(
    async (query, page = 1, isLoadMore = false) => {
      if (!query || query.length < 1) return;
      const perPage = isLoadMore
        ? LOAD_MORE_SEARCH_RESULTS
        : INITIAL_SEARCH_RESULTS;
      const url = `${API_BASE_URL}/posts?search=${encodeURIComponent(
        query
      )}&per_page=${perPage}&page=${page}&_fields=id,title,excerpt,slug,date,link,featured_media,_links&_embed=wp:featuredmedia,wp:term`;

      try {
        if (!isLoadMore) {
          setSearchLoading(true);
          setIsSearching(true);
          setSearchPage(1);
          allSearchResultsRef.current = [];
          currentSearchQueryRef.current = query;
          currentSearchPageRef.current = 1;
        } else {
          setLoadingMoreSearchResults(true);
          loadingMoreSearchResultsRef.current = true;
        }

        const res = await fetch(url);
        const data = await res.json();

        const formatted = data.map((post) => ({
          id: post.id,
          headline: post.title?.rendered || "Sin título",
          excerpt: post.excerpt?.rendered || "",
          slug: post.slug,
          time: post.date,
          img: getPostFeaturedImageOptimized(post),
          category: getPostCategory(post),
          categoryImage: DEFAULT_IMAGE,
          read_time: 1,
          link: post.link,
        }));

        const combinedResults = isLoadMore
          ? [...allSearchResultsRef.current, ...formatted]
          : formatted;
        allSearchResultsRef.current = combinedResults;

        setSearchResults(combinedResults);
        setHasMoreSearchResults(data.length === perPage);
        hasMoreSearchResultsRef.current = data.length === perPage;
        setSearchPage(page);
        currentSearchPageRef.current = page;
      } catch (err) {
        console.error("Error en búsqueda:", err);
      } finally {
        if (!isLoadMore) {
          setSearchLoading(false);
        } else {
          setLoadingMoreSearchResults(false);
          loadingMoreSearchResultsRef.current = false;
        }
      }
    },
    [getPostCategory, getPostFeaturedImageOptimized]
  );

  // Función para obtener la categoría del post (optimizada)
  const getPostCategory = useCallback((post) => {
    try {
      const terms = post._embedded?.["wp:term"]?.find(
        (t) => t[0]?.taxonomy === "category"
      );
      return terms?.[0]?.name || "General";
    } catch {
      return "General";
    }
  }, []);

  // Función optimizada para cargar más resultados de búsqueda
  const loadMoreSearchResults = useCallback(() => {
    if (
      loadingMoreSearchResultsRef.current ||
      !hasMoreSearchResultsRef.current ||
      !currentSearchQueryRef.current ||
      !isMountedRef.current
    ) {
      return;
    }

    console.log("🔍 Cargando más resultados OPTIMIZADO...");
    loadingMoreSearchResultsRef.current = true;
    const nextPage = currentSearchPageRef.current + 1;
    searchPosts(currentSearchQueryRef.current, nextPage, true);
  }, [searchPosts]);

  // Manejar cambios en el input de búsqueda - ULTRA OPTIMIZADO
  const handleSearchInputChange = useCallback(
    (text) => {
      setSearchQuery(text);

      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

      if (text.length >= 1) {
        const key = `${text.toLowerCase().trim()}_quick`;
        if (cacheRef.current.searches.has(key)) {
          setSearchResults(cacheRef.current.searches.get(key).results);
          setIsSearching(true);
          setShowCategories(false);
          return;
        }

        preloadPopularSearches(text);
        searchTimeoutRef.current = setTimeout(() => {
          searchPosts(text);
        }, SEARCH_DEBOUNCE_DELAY);
      } else {
        setSearchResults([]);
        setShowCategories(true);
        setIsSearching(false);
      }
    },
    [searchPosts, preloadPopularSearches]
  );

  // Limpiar búsqueda (optimizada)
  const clearSearch = useCallback(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (preloadControllerRef.current) {
      preloadControllerRef.current.abort();
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
  }, []);

  // Función ULTRA OPTIMIZADA para obtener imagen destacada del post
  const getPostFeaturedImageOptimized = useCallback((post) => {
    try {
      if (post._embedded?.["wp:featuredmedia"]?.[0]) {
        const media = post._embedded["wp:featuredmedia"][0];
        return (
          media?.media_details?.sizes?.thumbnail?.source_url ||
          media?.media_details?.sizes?.medium?.source_url ||
          media?.source_url ||
          media?.guid?.rendered ||
          DEFAULT_IMAGE
        );
      }
      return DEFAULT_IMAGE;
    } catch {
      return DEFAULT_IMAGE;
    }
  }, []);

  // Función para calcular tiempo de lectura (optimizada)
  const calculateReadTime = useCallback((content) => {
    if (!content) return 1;
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }, []);

  // Limpiar caché (mejorada)
  const clearCache = useCallback(() => {
    cacheRef.current = {
      categories: null,
      searches: new Map(),
      preloadedSearches: new Map(),
      lastCategoriesFetch: 0,
      searchMetrics: new Map(),
    };
    isInitializedRef.current = false;
    console.log("🗑️ Caché OPTIMIZADO limpiado");
  }, []);

  // Métricas de performance memoizadas
  const performanceMetrics = useMemo(() => {
    const metrics = Array.from(cacheRef.current.searchMetrics.entries());
    return {
      averageSearchTime:
        metrics.length > 0
          ? metrics.reduce((acc, [, data]) => acc + data.time, 0) /
            metrics.length
          : 0,
      totalSearches: metrics.length,
      cacheHitRate:
        cacheRef.current.searches.size > 0
          ? (cacheRef.current.searches.size /
              (cacheRef.current.searches.size + metrics.length)) *
            100
          : 0,
    };
  }, [searchResults.length]); // Recalcular cuando cambien los resultados

  // useEffect principal optimizado
  useEffect(() => {
    console.log("🔄 Hook OPTIMIZADO montado, iniciando carga de categorías...");
    fetchAllCategories();

    return () => {
      console.log("🔄 Hook OPTIMIZADO desmontado, limpiando recursos...");
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
      if (preloadControllerRef.current) {
        preloadControllerRef.current.abort();
      }
    };
  }, [fetchAllCategories]);

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

    // Funciones principales optimizadas
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

    // NUEVAS: Métricas de performance
    performanceMetrics,

    // NUEVAS: Funciones de optimización
    preloadPopularSearches,
  };
};

export default useWordPressSearch;
