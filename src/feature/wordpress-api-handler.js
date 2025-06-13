// WordPress API Data Fetcher and Processor for React Native
class WordPressAPIHandler {
  constructor(baseUrl = "https://venezuela-news.com/wp-json/wp/v2") {
    this.baseUrl = baseUrl;
    this.cache = {
      categories: {},
      posts: {},
      search: {},
    };
    this.pageCache = {};
  }

  // Fetch posts from WordPress API with pagination support
  async fetchPosts(params = {}, page = 1) {
    try {
      const queryParams = new URLSearchParams({
        per_page: 6, // Cargar 6 artículos por página
        _embed: true, // Include featured media and author info
        page: page,
        ...params,
      });

      // Crear una clave de caché única basada en los parámetros
      const cacheKey = `${JSON.stringify(params)}_page_${page}`;

      // Verificar si tenemos resultados en caché
      if (this.cache.posts[cacheKey]) {
        console.log(`🔄 Usando caché para: ${cacheKey}`);
        return {
          posts: this.cache.posts[cacheKey].posts,
          totalPages: this.cache.posts[cacheKey].totalPages,
          hasMore: this.cache.posts[cacheKey].hasMore,
        };
      }

      console.log(`🌐 Fetching: ${this.baseUrl}/posts?${queryParams}`);
      const response = await fetch(`${this.baseUrl}/posts?${queryParams}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Obtener el total de páginas del header
      const totalPages = parseInt(
        response.headers.get("X-WP-TotalPages") || "1",
        10
      );
      const posts = await response.json();
      const processedPosts = this.processPosts(posts);

      // Guardar en caché
      this.cache.posts[cacheKey] = {
        posts: processedPosts,
        totalPages: totalPages,
        hasMore: page < totalPages,
        timestamp: Date.now(),
      };

      return {
        posts: processedPosts,
        totalPages: totalPages,
        hasMore: page < totalPages,
      };
    } catch (error) {
      console.error("Error fetching WordPress posts:", error);
      throw error;
    }
  }

  // Process and clean WordPress posts data
  processPosts(posts) {
    return posts.map((post) => this.processPost(post));
  }

  // Process individual post
  processPost(post) {
    return {
      id: post.id,
      headline: this.decodeHtmlEntities(post.title.rendered),
      content: this.decodeHtmlEntities(post.excerpt.rendered),
      category: this.getPostCategory(post),
      img: this.getPostImage(post),
      time: post.date,
      read_time: this.calculateReadTime(post.content.rendered),
      bookmarked: false, // Default value
      slug: post.slug,
      link: post.link,
      author: this.getPostAuthor(post),
      tags: this.getPostTags(post),
    };
  }

  // Decode HTML entities for React Native (without document object)
  decodeHtmlEntities(text) {
    if (!text) return "";

    // HTML entity mappings
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

    // Handle numeric entities (&#123; format)
    decodedText = decodedText.replace(/&#(\d+);/g, (match, dec) => {
      return String.fromCharCode(dec);
    });

    // Remove HTML tags
    decodedText = decodedText.replace(/<[^>]*>/g, "");

    // Clean up extra whitespace
    decodedText = decodedText.replace(/\s+/g, " ").trim();

    return decodedText;
  }

  // Get post category
  getPostCategory(post) {
    if (post._embedded && post._embedded["wp:term"]) {
      const categories = post._embedded["wp:term"][0]; // Categories are usually first
      if (categories && categories.length > 0) {
        return categories[0].name;
      }
    }
    return "General";
  }

  // Get post featured image
  getPostImage(post) {
    if (post._embedded && post._embedded["wp:featuredmedia"]) {
      const media = post._embedded["wp:featuredmedia"][0];
      if (media) {
        // Intentar obtener la imagen en diferentes tamaños
        if (media.media_details && media.media_details.sizes) {
          const sizes = media.media_details.sizes;
          // Priorizar tamaños medianos para mejor rendimiento
          return (
            sizes.medium_large?.source_url ||
            sizes.medium?.source_url ||
            sizes.large?.source_url ||
            media.source_url
          );
        }
        return media.source_url;
      }
    }
    // Fallback image
    return "https://via.placeholder.com/400x200/cccccc/666666?text=Venezuela+News";
  }

  // Get post author
  getPostAuthor(post) {
    if (post._embedded && post._embedded.author) {
      const author = post._embedded.author[0];
      return {
        name: author.name,
        avatar: author.avatar_urls ? author.avatar_urls["96"] : null,
      };
    }
    return { name: "Venezuela News", avatar: null };
  }

  // Get post tags
  getPostTags(post) {
    if (
      post._embedded &&
      post._embedded["wp:term"] &&
      post._embedded["wp:term"][1]
    ) {
      return post._embedded["wp:term"][1].map((tag) => tag.name);
    }
    return [];
  }

  // Calculate estimated read time
  calculateReadTime(content) {
    if (!content) return 1;

    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, "");
    const wordCount = textContent
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return Math.max(1, readTime); // Minimum 1 minute
  }

  // Get posts by category with pagination
  async getPostsByCategory(categoryId, page = 1) {
    try {
      const category = categoryMapping[categoryId];

      if (categoryId === 1 || !category) {
        // "Lo último" - get latest posts with pagination
        const result = await this.fetchPosts({ per_page: 6 }, page);
        console.log(
          `📰 Posts for category ${categoryId} (latest) - Page ${page}:`,
          result.posts.length,
          `posts (Total pages: ${result.totalPages})`
        );
        return result;
      } else {
        // First get the category ID if we don't have it cached
        let wpCategoryId;

        const categoryCacheKey = `cat_${category.slug}`;
        if (this.cache.categories[categoryCacheKey]) {
          wpCategoryId = this.cache.categories[categoryCacheKey];
        } else {
          const categoriesResponse = await fetch(
            `${this.baseUrl}/categories?slug=${category.slug}`
          );
          const categoriesData = await categoriesResponse.json();

          if (categoriesData.length === 0) {
            console.warn(
              `⚠️ Category '${category.slug}' not found, returning latest posts`
            );
            return await this.fetchPosts({ per_page: 6 }, page);
          }

          wpCategoryId = categoriesData[0].id;
          this.cache.categories[categoryCacheKey] = wpCategoryId;
        }

        // Then get posts for that category with pagination
        const result = await this.fetchPosts(
          {
            categories: wpCategoryId,
            per_page: 6,
          },
          page
        );

        console.log(
          `📰 Posts for category ${categoryId} (${category.slug}) - Page ${page}:`,
          result.posts.length,
          `posts (Total pages: ${result.totalPages})`
        );

        return result;
      }
    } catch (error) {
      console.error(
        `❌ Failed to fetch posts for category ${categoryId}:`,
        error
      );
      return { posts: [], totalPages: 1, hasMore: false };
    }
  }

  // Get featured posts (you can customize this logic)
  async getFeaturedPosts(limit = 3) {
    const cacheKey = `featured_${limit}`;

    if (
      this.cache.posts[cacheKey] &&
      Date.now() - this.cache.posts[cacheKey].timestamp < 5 * 60 * 1000
    ) {
      // 5 minutos
      return this.cache.posts[cacheKey].posts;
    }

    const result = await this.fetchPosts({
      per_page: limit,
      orderby: "date",
      order: "desc",
    });

    return result.posts;
  }

  // Search posts with pagination
  async searchPosts(query, page = 1) {
    if (!query || query.length < 3) {
      return { posts: [], totalPages: 0, hasMore: false };
    }

    const cacheKey = `search_${query.toLowerCase().trim()}_page_${page}`;

    if (
      this.cache.search[cacheKey] &&
      Date.now() - this.cache.search[cacheKey].timestamp < 5 * 60 * 1000
    ) {
      return {
        posts: this.cache.search[cacheKey].posts,
        totalPages: this.cache.search[cacheKey].totalPages,
        hasMore: this.cache.search[cacheKey].hasMore,
      };
    }

    try {
      const result = await this.fetchPosts(
        {
          search: query,
          per_page: 6,
        },
        page
      );

      this.cache.search[cacheKey] = {
        posts: result.posts,
        totalPages: result.totalPages,
        hasMore: result.hasMore,
        timestamp: Date.now(),
      };

      return result;
    } catch (error) {
      console.error(`❌ Search error for "${query}":`, error);
      return { posts: [], totalPages: 0, hasMore: false };
    }
  }

  // Limpiar caché
  clearCache() {
    this.cache = {
      categories: {},
      posts: {},
      search: {},
    };
    console.log("🧹 Cache cleared");
  }
}

// Create instance
const wordpressAPI = new WordPressAPIHandler();

// Category mapping for your app
const categoryMapping = {
  1: { slug: "latest", title: "Lo último" },
  2: { slug: "nacionales", title: "Nacionales" },
  3: { slug: "internacionales", title: "Internacionales" },
  4: { slug: "opinion", title: "Opinion" },
  5: { slug: "politica", title: "Política" },
  6: { slug: "economia", title: "Economía" },
  7: { slug: "deportes", title: "Deportes" },
};

// Example: Fetch latest posts with pagination
async function getLatestNews(page = 1) {
  try {
    const result = await wordpressAPI.fetchPosts({ per_page: 6 }, page);
    console.log(
      `📰 Latest news fetched - Page ${page}:`,
      result.posts.length,
      "posts"
    );
    return result;
  } catch (error) {
    console.error("❌ Failed to fetch latest news:", error);
    return { posts: [], totalPages: 0, hasMore: false };
  }
}

// Example: Get featured posts for slider
async function getFeaturedNews() {
  try {
    const posts = await wordpressAPI.getFeaturedPosts(3);

    // Transform for slider format
    const sliderData = posts.map((post) => ({
      id: post.id,
      img: post.img,
      headline: post.headline,
      category: post.category,
      content: post.content,
      source: {
        logo: "https://venezuela-news.com/wp-content/uploads/2023/01/logo.png", // Your site logo
        name: "Venezuela News",
      },
      time: post.time,
      slug: post.slug,
      link: post.link,
    }));

    console.log("🎯 Featured news fetched:", sliderData.length, "posts");
    return sliderData;
  } catch (error) {
    console.error("❌ Failed to fetch featured news:", error);
    return [];
  }
}

// Function to get posts by category ID with pagination
async function getPostsByCategory(categoryId, page = 1) {
  try {
    return await wordpressAPI.getPostsByCategory(categoryId, page);
  } catch (error) {
    console.error(
      `❌ Failed to fetch posts for category ${categoryId}:`,
      error
    );
    return { posts: [], totalPages: 0, hasMore: false };
  }
}

// Search posts with pagination
async function searchPosts(query, page = 1) {
  return await wordpressAPI.searchPosts(query, page);
}

// Export for use in React Native
export {
  WordPressAPIHandler,
  wordpressAPI,
  getLatestNews,
  getFeaturedNews,
  getPostsByCategory,
  searchPosts,
  categoryMapping,
};
