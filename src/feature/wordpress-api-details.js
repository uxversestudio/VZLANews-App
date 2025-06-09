"use client";

import { useState, useCallback } from "react";

const usePostDetails = (
  baseUrl = "https://venezuela-news.com/wp-json/wp/v2"
) => {
  const [postDetails, setPostDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasDetailedContent, setHasDetailedContent] = useState(false);

  // Decode HTML entities for React Native
  const decodeHtmlEntities = (text) => {
    if (!text) return "";

    const entityMap = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#039;": "'",
      "&apos;": "'",
      "&nbsp;": " ",
      "&copy;": "©",
      "&reg;": "®",
      "&trade;": "™",
      "&hellip;": "…",
      "&mdash;": "—",
      "&ndash;": "–",
      "&lsquo;": "'",
      "&rsquo;": "'",
      "&ldquo;": '"',
      "&rdquo;": '"',
      "&bull;": "•",
      "&middot;": "·",
    };

    let decodedText = text;

    // Replace HTML entities
    Object.keys(entityMap).forEach((entity) => {
      const regex = new RegExp(entity, "g");
      decodedText = decodedText.replace(regex, entityMap[entity]);
    });

    // Handle numeric entities
    decodedText = decodedText.replace(/&#(\d+);/g, (match, dec) => {
      return String.fromCharCode(dec);
    });

    // Handle hex entities
    decodedText = decodedText.replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => {
      return String.fromCharCode(Number.parseInt(hex, 16));
    });

    // Procesar párrafos y saltos de línea de manera más precisa
    // Primero, convertir párrafos a marcadores temporales
    decodedText = decodedText.replace(
      /<\/p>\s*<p[^>]*>/gi,
      "|||PARAGRAPH_BREAK|||"
    );
    decodedText = decodedText.replace(/<p[^>]*>/gi, "");
    decodedText = decodedText.replace(/<\/p>/gi, "|||PARAGRAPH_BREAK|||");

    // Convertir breaks a saltos de línea
    decodedText = decodedText.replace(/<br\s*\/?>/gi, "\n");

    // Eliminar todas las demás etiquetas HTML
    decodedText = decodedText.replace(/<[^>]*>/g, "");

    // Convertir marcadores de párrafo a dobles saltos de línea
    decodedText = decodedText.replace(/\|\|\|PARAGRAPH_BREAK\|\|\|/g, "\n\n");

    // Limpiar espacios en blanco dentro de las líneas pero preservar saltos de línea
    decodedText = decodedText
      .split("\n")
      .map((line) => line.replace(/\s+/g, " ").trim())
      .join("\n");

    // Eliminar múltiples saltos de línea consecutivos (más de 2)
    decodedText = decodedText.replace(/\n{3,}/g, "\n\n");

    // Eliminar saltos de línea al inicio y final
    decodedText = decodedText.replace(/^\n+|\n+$/g, "");

    return decodedText;
  };

  // Process detailed post data
  const processDetailedPost = (post) => {
    return {
      id: post.id,
      headline: decodeHtmlEntities(post.title.rendered),
      content: decodeHtmlEntities(post.content.rendered),
      excerpt: decodeHtmlEntities(post.excerpt.rendered),
      category: getPostCategory(post),
      img: getPostImage(post),
      time: post.date,
      modified: post.modified,
      read_time: calculateReadTime(post.content.rendered),
      author: getPostAuthor(post),
      tags: getPostTags(post),
      slug: post.slug,
      link: post.link,
      status: post.status,
      featured: post.featured_media > 0,
      comment_status: post.comment_status,
      ping_status: post.ping_status,
      sticky: post.sticky,
      format: post.format,
      meta: post.meta || {},
      categories: post.categories || [],
      tags_ids: post.tags || [],
    };
  };

  // Get post category
  const getPostCategory = (post) => {
    if (post._embedded && post._embedded["wp:term"]) {
      const categories = post._embedded["wp:term"][0];
      if (categories && categories.length > 0) {
        return categories[0].name;
      }
    }
    return "General";
  };

  // Get post featured image
  const getPostImage = (post) => {
    if (post._embedded && post._embedded["wp:featuredmedia"]) {
      const media = post._embedded["wp:featuredmedia"][0];
      if (media && media.source_url) {
        return media.source_url;
      }
    }
    return null;
  };

  // Get post author
  const getPostAuthor = (post) => {
    if (post._embedded && post._embedded.author) {
      const author = post._embedded.author[0];
      return {
        name: author.name,
        avatar: author.avatar_urls ? author.avatar_urls["96"] : null,
        description: author.description || "",
        url: author.url || "",
        id: author.id,
      };
    }
    return {
      name: "Venezuela News",
      avatar: null,
      description: "",
      url: "",
      id: 1,
    };
  };

  // Get post tags
  const getPostTags = (post) => {
    if (
      post._embedded &&
      post._embedded["wp:term"] &&
      post._embedded["wp:term"][1]
    ) {
      return post._embedded["wp:term"][1].map((tag) => tag.name);
    }
    return [];
  };

  // Calculate estimated read time
  const calculateReadTime = (content) => {
    if (!content) return 1;

    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, "");
    const wordCount = textContent
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return Math.max(1, readTime);
  };

  // Fetch detailed post by ID
  const fetchPostDetails = useCallback(
    async (postId) => {
      if (!postId) {
        console.error("No post ID provided");
        return null;
      }

      try {
        setLoading(true);
        setError(null);

        console.log(`🔍 Fetching detailed post data for ID: ${postId}`);

        const response = await fetch(`${baseUrl}/posts/${postId}?_embed=true`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const post = await response.json();
        console.log("📰 Raw post data received:", post);

        const processedPost = processDetailedPost(post);
        console.log("✅ Processed post data:", processedPost);

        setPostDetails(processedPost);
        setHasDetailedContent(true);

        return processedPost;
      } catch (error) {
        console.error("❌ Error fetching post details:", error);
        setError(error.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [baseUrl]
  );

  // Reset hook state
  const resetPostDetails = useCallback(() => {
    setPostDetails(null);
    setLoading(false);
    setError(null);
    setHasDetailedContent(false);
  }, []);

  return {
    postDetails,
    loading,
    error,
    hasDetailedContent,
    fetchPostDetails,
    resetPostDetails,
  };
};

export default usePostDetails;
