"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";

const useWordPressSearch = () => {
  // Estados para categorías
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);
  const [categoryComparison, setCategoryComparison] = useState(null);

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
    "https://imagizer.imageshack.com/img923/6210/PHKISx.jpg";
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  const SEARCH_DEBOUNCE_DELAY = 300; // 300ms

  // Memoizar imágenes de categorías locales
  // Corregido LVPB a LVBP
  const categoryImages = useMemo(
    () => ({
      arte_nacional: "https://imagizer.imageshack.com/img924/225/sjViST.png",
      Deportes: "https://imagizer.imageshack.com/img923/1453/dN2piG.png",
      Destacado: "https://imagizer.imageshack.com/img923/9990/X9BBcE.png",
      Farandula: "https://imagizer.imageshack.com/img924/4678/3GdO9U.png",
      Entretenimiento: "https://imagizer.imageshack.com/img923/470/2kXrWu.png",
      Gastronomia: "https://imagizer.imageshack.com/img923/811/8e7Go9.png",
      Cultura: "https://imagizer.imageshack.com/img924/4586/UzLk6g.png",
      Turismo: "https://imagizer.imageshack.com/img923/5573/iP0DmU.png",
      Viral: "https://imagizer.imageshack.com/img923/8189/ekbUPa.png",
      LVBP: "https://imagizer.imageshack.com/img924/4418/gmx2C0.png", // Corregido de LVPB a LVBP
      Salud: "https://imagizer.imageshack.com/img924/6206/tehlaA.png",
      Opinion: "https://imagizer.imageshack.com/img924/705/VlQM2M.png",
      Redes_Sociales: "https://imagizer.imageshack.com/img924/6135/ZbKSvo.png",
      Drone: "https://imagizer.imageshack.com/img924/5678/UOsnaf.png",
      Portada: "https://imagizer.imageshack.com/img923/3411/zfkCNX.png",
      Escena: "https://imagizer.imageshack.com/img924/6054/tiLRnm.png",
      // Agregar aliases para variaciones comunes
      "Arte Nacional": "https://imagizer.imageshack.com/img924/225/sjViST.png",
      Farándula: "https://imagizer.imageshack.com/img924/4678/3GdO9U.png",
      Gastronomía: "https://imagizer.imageshack.com/img923/811/8e7Go9.png",
      Opinión: "https://imagizer.imageshack.com/img924/705/VlQM2M.png",
      "Redes Sociales":
        "https://imagizer.imageshack.com/img924/6135/ZbKSvo.png",
    }),
    []
  );

  /**
   * Función para obtener imagen de categoría con fallback
   * Versión mejorada y corregida para manejar mejor las variaciones
   */
  const getLocalCategoryImage = useCallback(
    (categoryName) => {
      try {
        if (!categoryName) return DEFAULT_IMAGE;

        // 1. Buscar coincidencia exacta primero
        if (categoryImages[categoryName]) {
          console.log(`✅ Coincidencia exacta para "${categoryName}"`);
          return categoryImages[categoryName];
        }

        // 2. Normalizar el nombre de la categoría (eliminar acentos, espacios, etc.)
        const normalizedName = categoryName
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, "")
          .toLowerCase();

        // 3. Buscar por nombre normalizado
        const matchingKey = Object.keys(categoryImages).find(
          (key) => key.toLowerCase().replace(/\s+/g, "") === normalizedName
        );

        if (matchingKey) {
          console.log(
            `🔄 Coincidencia normalizada para "${categoryName}" → "${matchingKey}"`
          );
          return categoryImages[matchingKey];
        }

        // 4. Manejar casos especiales y acrónimos
        if (normalizedName === "lvbp" || normalizedName === "lvpb") {
          console.log(
            `🔤 Coincidencia de acrónimo para "${categoryName}" → "LVBP"`
          );
          return categoryImages["LVBP"];
        }

        // 5. Buscar coincidencias parciales (si el nombre de la categoría contiene la clave)
        for (const key of Object.keys(categoryImages)) {
          const normalizedKey = key.toLowerCase().replace(/\s+/g, "");
          if (
            normalizedName.includes(normalizedKey) ||
            normalizedKey.includes(normalizedName)
          ) {
            console.log(
              `🔍 Coincidencia parcial para "${categoryName}" → "${key}"`
            );
            return categoryImages[key];
          }
        }

        // 6. Buscar por palabras clave
        const keywordMap = {
          deporte: "Deportes",
          futbol: "Deportes",
          beisbol: "LVBP",
          baseball: "LVBP",
          arte: "arte_nacional",
          cultura: "Cultura",
          turismo: "Turismo",
          viral: "Viral",
          salud: "Salud",
          opinion: "Opinion",
          redes: "Redes_Sociales",
          social: "Redes_Sociales",
          drone: "Drone",
          portada: "Portada",
          escena: "Escena",
          farandula: "Farandula",
          entretenimiento: "Entretenimiento",
          gastronomia: "Gastronomia",
        };

        for (const [keyword, category] of Object.entries(keywordMap)) {
          if (normalizedName.includes(keyword)) {
            console.log(
              `🔑 Coincidencia por palabra clave para "${categoryName}" → "${category}"`
            );
            return categoryImages[category];
          }
        }

        // 7. Si no encuentra la imagen, devolver la por defecto
        console.log(
          `❌ Sin coincidencia para "${categoryName}" → usando imagen por defecto`
        );
        return DEFAULT_IMAGE;
      } catch (error) {
        console.warn(
          `Error loading image for category ${categoryName}:`,
          error
        );
        return DEFAULT_IMAGE;
      }
    },
    [categoryImages, DEFAULT_IMAGE]
  );

  /**
   * Función para generar un reporte visual de categorías e imágenes
   */
  const generateCategoryImageReport = useCallback(() => {
    if (!categories || categories.length === 0) return [];

    return categories.map((category) => {
      const categoryName = category.name || category.title;
      const normalizedName = categoryName
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "")
        .toLowerCase();

      // Buscar coincidencia exacta
      let matchType = "none";
      let matchedKey = null;
      let imageUrl = DEFAULT_IMAGE;

      if (categoryImages[categoryName]) {
        matchType = "exact";
        matchedKey = categoryName;
        imageUrl = categoryImages[categoryName];
      } else {
        // Buscar por nombre normalizado
        const key = Object.keys(categoryImages).find(
          (k) => k.toLowerCase().replace(/\s+/g, "") === normalizedName
        );

        if (key) {
          matchType = "normalized";
          matchedKey = key;
          imageUrl = categoryImages[key];
        } else {
          // Manejar casos especiales
          if (normalizedName === "lvbp" || normalizedName === "lvpb") {
            matchType = "acronym";
            matchedKey = "LVBP";
            imageUrl = categoryImages["LVBP"];
          } else {
            // Buscar coincidencias parciales
            for (const k of Object.keys(categoryImages)) {
              const normalizedKey = k.toLowerCase().replace(/\s+/g, "");
              if (
                normalizedName.includes(normalizedKey) ||
                normalizedKey.includes(normalizedName)
              ) {
                matchType = "partial";
                matchedKey = k;
                imageUrl = categoryImages[k];
                break;
              }
            }
          }
        }
      }

      return {
        id: category.id,
        name: categoryName,
        normalizedName,
        matchType,
        matchedKey,
        image: imageUrl,
        isDefault: imageUrl === DEFAULT_IMAGE,
        count: category.count,
        slug: category.slug,
      };
    });
  }, [categories, categoryImages, DEFAULT_IMAGE]);

  /**
   * Función optimizada para obtener categorías con conteos
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

      // Combinar datos de categorías con conteos estimados e imágenes
      const categoriesWithCounts = categoriesData
        .map((category) => {
          // Obtener la imagen correspondiente o la imagen por defecto
          const image = getLocalCategoryImage(category.name);
          return {
            id: category.id,
            title: category.name,
            name: category.name,
            subtitle: `${
              categoryPostCounts[category.id] || category.count || 0
            } Noticias`,
            count: categoryPostCounts[category.id] || category.count || 0,
            slug: category.slug,
            image: image,
            hasCustomImage: image !== DEFAULT_IMAGE,
          };
        })
        .filter((cat) => cat.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);

      // Generar reporte de imágenes
      const report = generateCategoryImageReport();

      // Mostrar reporte en consola
      console.log("📊 REPORTE DE IMÁGENES DE CATEGORÍAS:");
      console.log(
        "✅ Categorías con imagen personalizada:",
        report.filter((item) => !item.isDefault).length
      );
      console.log(
        "❌ Categorías con imagen por defecto:",
        report.filter((item) => item.isDefault).length
      );

      console.log("\n📋 DETALLE DE CATEGORÍAS:");
      report.forEach((item) => {
        const icon = item.isDefault ? "❌" : "✅";
        const matchInfo =
          item.matchType !== "none"
            ? `(${item.matchType}: "${item.matchedKey}")`
            : "";
        console.log(`${icon} "${item.name}" ${matchInfo}`);
      });

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
  }, [getLocalCategoryImage, generateCategoryImageReport]);

  /**
   * Función de búsqueda optimizada con debouncing y cache
   */
  const searchPosts = useCallback(
    async (query) => {
      if (!query || query.length < 3) {
        setSearchResults([]);
        setShowCategories(true);
        setIsSearching(false);
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

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

        const formattedResults = searchData.map((post) => {
          const category = getCategoryNameFromPostOptimized(post);
          return {
            id: post.id,
            headline: post.title?.rendered || "Sin título",
            excerpt: post.excerpt?.rendered || "",
            content: post.content?.rendered || "",
            slug: post.slug,
            time: post.date,
            img: getPostFeaturedImageOptimized(post) || "",
            category: category,
            categoryImage: getLocalCategoryImage(category), // Agregar imagen de categoría
            read_time: calculateReadTimeOptimized(post.content?.rendered || ""),
            link: post.link,
          };
        });

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
    },
    [getLocalCategoryImage]
  );

  /**
   * Función optimizada para manejar cambios en el input con debouncing
   */
  const handleSearchInputChange = useCallback(
    (text) => {
      setSearchQuery(text);

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      if (text.length >= 3) {
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
   */
  const getPostFeaturedImageOptimized = useCallback(
    (post) => {
      try {
        if (!post._embedded || !post._embedded["wp:featuredmedia"]) {
          return DEFAULT_IMAGE;
        }

        const featuredMedia = post._embedded["wp:featuredmedia"][0];

        const imageSource =
          featuredMedia?.media_details?.sizes?.full?.source_url ||
          featuredMedia?.media_details?.sizes?.large?.source_url ||
          featuredMedia?.media_details?.sizes?.medium_large?.source_url ||
          featuredMedia?.media_details?.sizes?.medium?.source_url ||
          featuredMedia?.source_url ||
          featuredMedia?.media_details?.sizes?.thumbnail?.source_url;

        if (imageSource && typeof imageSource === "string") {
          let imageUrl = imageSource.trim();
          if (imageUrl.startsWith("http://")) {
            imageUrl = imageUrl.replace("http://", "https://");
          }
          return imageUrl;
        }
      } catch (error) {
        console.warn("Error getting featured image:", error);
      }

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
      const text = content.replace(/<[^>]*>/g, "");
      const words = text.trim().split(/\s+/).length;
      const readTimeMinutes = Math.ceil(words / 200);
      return readTimeMinutes > 0 ? readTimeMinutes : 1;
    } catch (error) {
      return 1;
    }
  }, []);

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
    categories,
    searchResults,
    searchQuery,
    showCategories,
    categoriesLoading,
    categoriesError,
    searchLoading,
    searchError,
    isSearching,
    categoryComparison,
    handleSearchInputChange,
    searchPosts,
    clearSearch,
    refreshCategories: fetchCategories,
    clearCache,
    DEFAULT_IMAGE,
    getLocalCategoryImage,
    generateCategoryImageReport,
  };
};

export default useWordPressSearch;
