import AsyncStorage from "@react-native-async-storage/async-storage";

// Smart WordPress API with Adaptive Timeouts and Fallback Strategies
class SmartWordPressAPI {
  constructor(baseUrl = "https://venezuela-news.com/wp-json/wp/v2") {
    this.baseUrl = baseUrl;

    // Multi-tier caching
    this.memoryCache = new Map();
    this.imageCache = new Map();
    this.categoryCache = new Map();
    this.maxCacheSize = 150;
    this.cacheTTL = 5 * 60 * 1000; // 5 minutes

    // Adaptive timeout system
    this.timeouts = {
      fast: 3000, // 3s for fast connections
      normal: 8000, // 8s for normal connections
      slow: 15000, // 15s for slow connections
      current: 8000, // Start with normal
    };

    // Connection quality tracking
    this.connectionMetrics = {
      avgResponseTime: 5000,
      successRate: 100,
      timeoutCount: 0,
      totalRequests: 0,
    };

    // Request pools
    this.requestPool = new Map();
    this.retryQueue = new Map();

    // Performance metrics
    this.metrics = {
      requests: 0,
      cacheHits: 0,
      timeouts: 0,
      retries: 0,
      avgResponseTime: 0,
    };

    // Optimized regex
    this.htmlStripRegex = /<[^>]*>/g;
    this.entityRegex = /&[a-zA-Z0-9#]+;/g;
    this.whitespaceRegex = /\s+/g;

    // Initialize smart systems
    this.initSmartSystems();
  }

  // Initialize smart systems
  initSmartSystems() {
    // Load cache immediately
    this.loadCache();

    // Start with conservative prefetch
    setTimeout(() => this.smartPrefetch(), 1000);

    // Adaptive optimization every minute
    setInterval(() => this.adaptiveOptimization(), 60000);

    // Connection quality monitoring
    this.startConnectionMonitoring();
  }

  // Adaptive timeout based on connection quality
  getAdaptiveTimeout() {
    const avgTime = this.connectionMetrics.avgResponseTime;
    const successRate = this.connectionMetrics.successRate;

    if (avgTime < 2000 && successRate > 95) {
      this.timeouts.current = this.timeouts.fast;
      return this.timeouts.fast;
    } else if (avgTime < 5000 && successRate > 85) {
      this.timeouts.current = this.timeouts.normal;
      return this.timeouts.normal;
    } else {
      this.timeouts.current = this.timeouts.slow;
      return this.timeouts.slow;
    }
  }

  // Smart cache management
  setCache(key, value, type = "memory", priority = "normal") {
    const cacheData = {
      data: value,
      timestamp: Date.now(),
      priority,
      accessCount: 1,
    };

    let targetCache = this.memoryCache;
    switch (type) {
      case "image":
        targetCache = this.imageCache;
        break;
      case "category":
        targetCache = this.categoryCache;
        break;
    }

    // Smart eviction
    if (targetCache.size >= this.maxCacheSize) {
      this.smartEviction(targetCache);
    }

    targetCache.set(key, cacheData);

    // Persist important data
    if (priority === "high" || type === "category") {
      this.persistCache(key, cacheData);
    }
  }

  getCache(key, type = "memory") {
    let targetCache = this.memoryCache;
    switch (type) {
      case "image":
        targetCache = this.imageCache;
        break;
      case "category":
        targetCache = this.categoryCache;
        break;
    }

    const cached = targetCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      cached.accessCount++;
      this.metrics.cacheHits++;
      return cached.data;
    }

    return null;
  }

  // Smart cache eviction
  smartEviction(cache) {
    const entries = Array.from(cache.entries());
    const now = Date.now();

    // Sort by score (age, priority, access count)
    entries.sort(([, a], [, b]) => {
      const scoreA = this.calculateCacheScore(a, now);
      const scoreB = this.calculateCacheScore(b, now);
      return scoreA - scoreB;
    });

    // Remove 20% of lowest scoring entries
    const toRemove = Math.floor(entries.length * 0.2);
    for (let i = 0; i < toRemove; i++) {
      cache.delete(entries[i][0]);
    }
  }

  calculateCacheScore(cacheItem, now) {
    const age = now - cacheItem.timestamp;
    const priorityWeight =
      cacheItem.priority === "high"
        ? 10000
        : cacheItem.priority === "normal"
        ? 1000
        : 100;
    const accessWeight = cacheItem.accessCount * 500;
    return age - priorityWeight - accessWeight;
  }

  // Smart fetch with retry logic and adaptive timeouts
  async smartFetch(url, options = {}, retryCount = 0) {
    const startTime = Date.now();
    const timeout = this.getAdaptiveTimeout();

    console.log(
      `🔄 Smart fetch: ${url} (timeout: ${timeout}ms, retry: ${retryCount})`
    );

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error(`Smart timeout after ${timeout}ms`)),
        timeout
      );
    });

    try {
      const fetchPromise = fetch(url, {
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate",
          "Cache-Control": "max-age=300",
          Connection: "keep-alive",
          ...options.headers,
        },
        ...options,
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Update connection metrics
      const responseTime = Date.now() - startTime;
      this.updateConnectionMetrics(responseTime, true);

      console.log(`✅ Smart fetch success: ${responseTime}ms`);
      return response;
    } catch (error) {
      const responseTime = Date.now() - startTime;

      if (error.message.includes("timeout")) {
        this.metrics.timeouts++;
        this.connectionMetrics.timeoutCount++;
        console.warn(`⏰ Timeout after ${responseTime}ms`);
      }

      this.updateConnectionMetrics(responseTime, false);

      // Retry logic with exponential backoff
      if (retryCount < 2) {
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        console.log(`🔄 Retrying in ${delay}ms...`);

        await new Promise((resolve) => setTimeout(resolve, delay));
        this.metrics.retries++;
        return this.smartFetch(url, options, retryCount + 1);
      }

      console.error(
        `❌ Smart fetch failed after ${retryCount + 1} attempts:`,
        error.message
      );
      throw error;
    }
  }

  // Update connection quality metrics
  updateConnectionMetrics(responseTime, success) {
    this.connectionMetrics.totalRequests++;

    // Update average response time
    this.connectionMetrics.avgResponseTime =
      (this.connectionMetrics.avgResponseTime + responseTime) / 2;

    // Update success rate
    const successCount = Math.floor(
      (this.connectionMetrics.successRate / 100) *
        this.connectionMetrics.totalRequests
    );
    const newSuccessCount = success ? successCount + 1 : successCount;
    this.connectionMetrics.successRate =
      (newSuccessCount / this.connectionMetrics.totalRequests) * 100;

    // Update metrics
    this.metrics.requests++;
    this.metrics.avgResponseTime =
      (this.metrics.avgResponseTime + responseTime) / 2;
  }

  // Fast HTML cleaning
  fastCleanHtml(text) {
    if (!text) return "";
    return text
      .replace(this.htmlStripRegex, " ")
      .replace(this.entityRegex, " ")
      .replace(this.whitespaceRegex, " ")
      .trim()
      .substring(0, 200);
  }

  // Smart image processing
  async smartImageProcess(media) {
    if (!media) {
      return "https://via.placeholder.com/400x200/e2e8f0/64748b?text=News";
    }

    const imageKey = `img_${media.id || Date.now()}`;
    const cached = this.getCache(imageKey, "image");

    if (cached) {
      return cached;
    }

    try {
      let imageUrl = null;

      // Strategy 1: Direct source_url
      if (media.source_url) {
        imageUrl = media.source_url;
      }
      // Strategy 2: Media details sizes
      else if (media.media_details?.sizes) {
        const sizes = media.media_details.sizes;
        imageUrl =
          sizes.medium_large?.source_url ||
          sizes.large?.source_url ||
          sizes.medium?.source_url ||
          sizes.thumbnail?.source_url;
      }
      // Strategy 3: GUID fallback
      else if (media.guid?.rendered) {
        imageUrl = media.guid.rendered;
      }

      if (!imageUrl) {
        imageUrl =
          "https://via.placeholder.com/400x200/e2e8f0/64748b?text=News";
      }

      // Cache with high priority
      this.setCache(imageKey, imageUrl, "image", "high");
      return imageUrl;
    } catch (error) {
      const fallback =
        "https://via.placeholder.com/400x200/e2e8f0/64748b?text=News";
      this.setCache(imageKey, fallback, "image");
      return fallback;
    }
  }

  // Smart category processing
  async smartCategoryProcess(post, embedded) {
    const categoryKey = `cat_${post.id}`;
    const cached = this.getCache(categoryKey, "category");

    if (cached) {
      return cached;
    }

    let categoryName = "General";

    try {
      // Method 1: Direct categories with embedded lookup
      if (
        post.categories &&
        Array.isArray(post.categories) &&
        post.categories.length > 0
      ) {
        const categoryId = post.categories[0];
        const terms = embedded?.["wp:term"];

        if (terms && Array.isArray(terms) && terms.length > 0) {
          const categories = terms[0];
          if (categories && Array.isArray(categories)) {
            const category = categories.find((cat) => cat.id === categoryId);
            if (category?.name) {
              categoryName = category.name;
            }
          }
        }
      }

      // Method 2: Direct from embedded terms
      if (categoryName === "General") {
        const terms = embedded?.["wp:term"];
        if (terms && Array.isArray(terms) && terms.length > 0) {
          const categories = terms[0];
          if (
            categories &&
            Array.isArray(categories) &&
            categories.length > 0
          ) {
            categoryName = categories[0].name || "General";
          }
        }
      }

      this.setCache(categoryKey, categoryName, "category", "high");
      return categoryName;
    } catch (error) {
      this.setCache(categoryKey, "General", "category");
      return "General";
    }
  }

  // Smart post processing
  async smartProcessPost(post) {
    const embedded = post._embedded || {};
    const media = embedded["wp:featuredmedia"]?.[0];
    const author = embedded.author?.[0];

    // Parallel processing with error handling
    const [imageUrl, categoryName] = await Promise.allSettled([
      this.smartImageProcess(media),
      this.smartCategoryProcess(post, embedded),
    ]).then((results) => [
      results[0].status === "fulfilled"
        ? results[0].value
        : "https://via.placeholder.com/400x200/e2e8f0/64748b?text=News",
      results[1].status === "fulfilled" ? results[1].value : "General",
    ]);

    return {
      id: post.id,
      headline: this.fastCleanHtml(post.title?.rendered),
      content: this.fastCleanHtml(post.excerpt?.rendered),
      category: categoryName,
      img: imageUrl,
      time: post.date,
      read_time: this.fastReadTime(post.excerpt?.rendered),
      slug: post.slug,
      link: post.link,
      author: author?.name || "Venezuela News",
      bookmarked: false,
    };
  }

  // Fast read time calculation
  fastReadTime(content) {
    if (!content) return 1;
    return Math.max(1, Math.ceil(content.length / 1000));
  }

  // Smart posts fetching
  async smartFetchPosts(params = {}, page = 1) {
    const startTime = Date.now();
    const cacheKey = `posts_${JSON.stringify(params)}_${page}`;

    // Check cache first
    const cached = this.getCache(cacheKey);
    if (cached) {
      console.log(`🚀 Cache hit: ${Date.now() - startTime}ms`);
      return cached;
    }

    // Deduplicate requests
    if (this.requestPool.has(cacheKey)) {
      console.log(`🔄 Request already in progress: ${cacheKey}`);
      return this.requestPool.get(cacheKey);
    }

    const promise = this.executeSmartFetch(params, page, cacheKey, startTime);
    this.requestPool.set(cacheKey, promise);

    promise.finally(() => {
      this.requestPool.delete(cacheKey);
    });

    return promise;
  }

  async executeSmartFetch(params, page, cacheKey, startTime) {
    const queryParams = new URLSearchParams({
      per_page: 6,
      _embed: true,
      page,
      ...params,
    });

    const url = `${this.baseUrl}/posts?${queryParams}`;

    try {
      const response = await this.smartFetch(url);
      const totalPages = Number.parseInt(
        response.headers.get("X-WP-TotalPages") || "1",
        10
      );
      const posts = await response.json();

      console.log(`📊 Received ${posts.length} posts`);

      // Process posts with error handling
      const processedPosts = await Promise.allSettled(
        posts.map((post) => this.smartProcessPost(post))
      ).then((results) =>
        results
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value)
      );

      const result = {
        posts: processedPosts,
        totalPages,
        hasMore: page < totalPages,
      };

      // Cache the result
      const priority = page === 1 ? "high" : "normal";
      this.setCache(cacheKey, result, "memory", priority);

      const totalTime = Date.now() - startTime;
      console.log(
        `✅ Smart loaded: ${processedPosts.length} posts in ${totalTime}ms`
      );

      // Background preload next page (only if connection is good)
      if (
        result.hasMore &&
        page === 1 &&
        this.connectionMetrics.successRate > 80
      ) {
        setTimeout(() => {
          this.smartFetchPosts(params, page + 1).catch(() => {});
        }, 2000);
      }

      return result;
    } catch (error) {
      console.error(`❌ Smart fetch failed for ${cacheKey}:`, error.message);

      // Try to return cached data even if expired
      const expiredCache = this.memoryCache.get(cacheKey);
      if (expiredCache) {
        console.log(`🔄 Returning expired cache for ${cacheKey}`);
        return expiredCache.data;
      }

      throw error;
    }
  }

  // Smart category posts
  async smartCategoryPosts(categoryId, page = 1) {
    const category = categoryMapping[categoryId];

    if (categoryId === 1 || !category) {
      return this.smartFetchPosts({ per_page: 6 }, page);
    }

    // Smart category ID resolution
    const categoryCacheKey = `cat_id_${category.slug}`;
    let wpCategoryId = this.getCache(categoryCacheKey, "category");

    if (!wpCategoryId) {
      try {
        const response = await this.smartFetch(
          `${this.baseUrl}/categories?slug=${category.slug}`
        );
        const categoriesData = await response.json();

        if (categoriesData.length === 0) {
          console.warn(`Category ${category.slug} not found`);
          return this.smartFetchPosts({ per_page: 6 }, page);
        }

        wpCategoryId = categoriesData[0].id;
        this.setCache(categoryCacheKey, wpCategoryId, "category", "high");
      } catch (error) {
        console.warn(
          `Category lookup failed for ${category.slug}:`,
          error.message
        );
        return this.smartFetchPosts({ per_page: 6 }, page);
      }
    }

    return this.smartFetchPosts(
      { categories: wpCategoryId, per_page: 6 },
      page
    );
  }

  // Smart prefetch (conservative)
  async smartPrefetch() {
    console.log("🚀 Starting smart prefetch...");

    // Only prefetch if connection quality is good
    if (this.connectionMetrics.successRate < 70) {
      console.log("⚠️ Skipping prefetch due to poor connection");
      return;
    }

    const prefetchPromises = [
      this.smartFetchPosts({ per_page: 6 }, 1), // Latest posts
      this.smartCategoryPosts(2, 1), // Nacionales
    ];

    try {
      await Promise.allSettled(prefetchPromises);
      console.log("✅ Smart prefetch completed");
    } catch (error) {
      console.warn("Smart prefetch failed:", error.message);
    }
  }

  // Adaptive optimization
  adaptiveOptimization() {
    const metrics = this.getConnectionQuality();
    console.log("📊 Connection quality:", metrics);

    // Adjust cache TTL based on connection quality
    if (metrics.quality === "poor") {
      this.cacheTTL = 10 * 60 * 1000; // 10 minutes for poor connections
    } else if (metrics.quality === "good") {
      this.cacheTTL = 3 * 60 * 1000; // 3 minutes for good connections
    } else {
      this.cacheTTL = 5 * 60 * 1000; // 5 minutes for normal connections
    }

    // Clean expired cache
    this.cleanExpiredCache();
  }

  // Get connection quality assessment
  getConnectionQuality() {
    const avgTime = this.connectionMetrics.avgResponseTime;
    const successRate = this.connectionMetrics.successRate;

    let quality = "normal";
    if (avgTime < 3000 && successRate > 90) {
      quality = "good";
    } else if (avgTime > 8000 || successRate < 70) {
      quality = "poor";
    }

    return {
      quality,
      avgResponseTime: `${avgTime.toFixed(0)}ms`,
      successRate: `${successRate.toFixed(1)}%`,
      timeouts: this.connectionMetrics.timeoutCount,
      currentTimeout: `${this.timeouts.current}ms`,
    };
  }

  // Start connection monitoring
  startConnectionMonitoring() {
    setInterval(() => {
      const quality = this.getConnectionQuality();
      console.log(
        `📡 Connection: ${quality.quality} (${quality.avgResponseTime}, ${quality.successRate})`
      );
    }, 30000);
  }

  // Persist cache
  async persistCache(key, data) {
    try {
      await AsyncStorage.setItem(`smart_${key}`, JSON.stringify(data));
    } catch (error) {
      // Silent fail
    }
  }

  // Load cache
  async loadCache() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const smartKeys = keys.filter((key) => key.startsWith("smart_"));

      if (smartKeys.length === 0) return;

      const items = await AsyncStorage.multiGet(smartKeys);
      let loaded = 0;

      items.forEach(([key, value]) => {
        try {
          const cacheKey = key.replace("smart_", "");
          const cached = JSON.parse(value);

          if (Date.now() - cached.timestamp < this.cacheTTL * 2) {
            if (cacheKey.includes("img_")) {
              this.imageCache.set(cacheKey, cached);
            } else if (cacheKey.includes("cat_")) {
              this.categoryCache.set(cacheKey, cached);
            } else {
              this.memoryCache.set(cacheKey, cached);
            }
            loaded++;
          }
        } catch (error) {
          // Invalid cache, ignore
        }
      });

      console.log(`🚀 Loaded ${loaded} cached items`);
    } catch (error) {
      console.warn("Cache load failed:", error.message);
    }
  }

  // Clean expired cache
  cleanExpiredCache() {
    const now = Date.now();
    let cleaned = 0;
    [this.memoryCache, this.imageCache, this.categoryCache].forEach((cache) => {
      for (const [key, value] of cache.entries()) {
        if (now - value.timestamp > this.cacheTTL) {
          cache.delete(key);
          cleaned++;
        }
      }
    });

    if (cleaned > 0) {
      console.log(`🧹 Cleaned ${cleaned} expired items`);
    }
  }

  // Get performance metrics
  getMetrics() {
    const cacheHitRate =
      this.metrics.requests > 0
        ? ((this.metrics.cacheHits / this.metrics.requests) * 100).toFixed(1)
        : 0;

    return {
      ...this.metrics,
      cacheHitRate: `${cacheHitRate}%`,
      avgResponseTime: `${this.metrics.avgResponseTime.toFixed(0)}ms`,
      connectionQuality: this.getConnectionQuality(),
      cacheSize:
        this.memoryCache.size + this.imageCache.size + this.categoryCache.size,
    };
  }
}

// Category mapping
const categoryMapping = Object.freeze({
  1: { slug: "latest", title: "Lo último" },
  2: { slug: "nacionales", title: "Nacionales" },
  3: { slug: "internacionales", title: "Internacionales" },
  4: { slug: "opinion", title: "Opinion" },
  5: { slug: "politica", title: "Política" },
  6: { slug: "economia", title: "Economía" },
  7: { slug: "deportes", title: "Deportes" },
});

// Create smart instance
const smartAPI = new SmartWordPressAPI();

// Smart helper functions
export const getLatestNews = async (page = 1) => {
  try {
    const startTime = Date.now();
    const result = await smartAPI.smartFetchPosts({ per_page: 6 }, page);
    console.log(`⚡ getLatestNews: ${Date.now() - startTime}ms`);
    return result;
  } catch (error) {
    console.error("❌ Error loading latest news:", error.message);
    return { posts: [], totalPages: 0, hasMore: false };
  }
};

export const getFeaturedNews = async () => {
  try {
    const startTime = Date.now();
    const result = await smartAPI.smartFetchPosts({
      per_page: 3,
      orderby: "date",
      order: "desc",
    });

    const featured = result.posts.map((post) => ({
      ...post,
      source: {
        logo: "https://venezuela-news.com/wp-content/uploads/2023/01/logo.png",
        name: "Venezuela News",
      },
    }));

    console.log(`⚡ getFeaturedNews: ${Date.now() - startTime}ms`);
    return featured;
  } catch (error) {
    console.error("❌ Error loading featured news:", error.message);
    return [];
  }
};

export const getPostsByCategory = async (categoryId, page = 1) => {
  try {
    const startTime = Date.now();
    const result = await smartAPI.smartCategoryPosts(categoryId, page);
    console.log(
      `⚡ getPostsByCategory ${categoryId}: ${Date.now() - startTime}ms`
    );
    return result;
  } catch (error) {
    console.error(`❌ Error loading category ${categoryId}:`, error.message);
    return { posts: [], totalPages: 0, hasMore: false };
  }
};

export const searchPosts = async (query, page = 1) => {
  if (!query || query.length < 3) {
    return { posts: [], totalPages: 0, hasMore: false };
  }

  try {
    const startTime = Date.now();
    const result = await smartAPI.smartFetchPosts(
      { search: query.toLowerCase().trim(), per_page: 6 },
      page
    );
    console.log(`⚡ searchPosts "${query}": ${Date.now() - startTime}ms`);
    return result;
  } catch (error) {
    console.error(`❌ Error searching "${query}":`, error.message);
    return { posts: [], totalPages: 0, hasMore: false };
  }
};

export const getPerformanceMetrics = () => smartAPI.getMetrics();

// Export everything
export { SmartWordPressAPI, smartAPI as wordpressAPI, categoryMapping };
