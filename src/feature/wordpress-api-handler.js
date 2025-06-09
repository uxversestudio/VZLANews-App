// WordPress API Data Fetcher and Processor for React Native
class WordPressAPIHandler {
  constructor(baseUrl = "https://venezuela-news.com/wp-json/wp/v2") {
    this.baseUrl = baseUrl;
  }

  // Fetch posts from WordPress API
  async fetchPosts(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        per_page: 10,
        _embed: true, // Include featured media and author info
        ...params,
      });

      const response = await fetch(`${this.baseUrl}/posts?${queryParams}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const posts = await response.json();
      return this.processPosts(posts);
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
      "&sect;": "§",
      "&para;": "¶",
      "&dagger;": "†",
      "&Dagger;": "‡",
      "&permil;": "‰",
      "&lsaquo;": "‹",
      "&rsaquo;": "›",
      "&euro;": "€",
      "&pound;": "£",
      "&yen;": "¥",
      "&cent;": "¢",
      "&curren;": "¤",
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

    // Handle hex entities (&#x1F; format)
    decodedText = decodedText.replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => {
      return String.fromCharCode(Number.parseInt(hex, 16));
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
      if (media && media.source_url) {
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

  // Get posts by category
  async getPostsByCategory(categorySlug, limit = 10) {
    try {
      // First get the category ID
      const categoriesResponse = await fetch(
        `${this.baseUrl}/categories?slug=${categorySlug}`
      );
      const categories = await categoriesResponse.json();

      if (categories.length === 0) {
        console.warn(
          `Category '${categorySlug}' not found, returning latest posts`
        );
        return await this.fetchPosts({ per_page: limit });
      }

      const categoryId = categories[0].id;

      // Then get posts for that category
      return await this.fetchPosts({
        categories: categoryId,
        per_page: limit,
      });
    } catch (error) {
      console.error("Error fetching posts by category:", error);
      // Fallback to latest posts
      return await this.fetchPosts({ per_page: limit });
    }
  }

  // Get featured posts (you can customize this logic)
  async getFeaturedPosts(limit = 3) {
    return await this.fetchPosts({
      per_page: limit,
      orderby: "date",
      order: "desc",
    });
  }

  // Search posts
  async searchPosts(query, limit = 10) {
    return await this.fetchPosts({
      search: query,
      per_page: limit,
    });
  }
}

// Create instance
const wordpressAPI = new WordPressAPIHandler();

// Example: Fetch latest posts
async function getLatestNews() {
  try {
    const posts = await wordpressAPI.fetchPosts({ per_page: 5 });
    console.log("Latest news fetched:", posts.length, "posts");
    return posts;
  } catch (error) {
    console.error("Failed to fetch latest news:", error);
    return [];
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
      source: {
        logo: "https://venezuela-news.com/wp-content/uploads/2023/01/logo.png", // Your site logo
        name: "Venezuela News",
      },
      time: post.time,
    }));

    console.log("Featured news fetched:", sliderData.length, "posts");
    return sliderData;
  } catch (error) {
    console.error("Failed to fetch featured news:", error);
    return [];
  }
}

// Category mapping for your app
const categoryMapping = {
  1: { slug: "latest", title: "Lo último" },
  2: { slug: "nacionales", title: "Nacionales" },
  3: { slug: "internacionales", title: "internacionales" },
  4: { slug: "opinion", title: "Opinion" },
  5: { slug: "politica", title: "Política" },
  6: { slug: "economia", title: "Economía" },
  7: { slug: "deportes", title: "Deportes" },
};

// Function to get posts by category ID (for your existing category system)
async function getPostsByCategory(categoryId) {
  try {
    const category = categoryMapping[categoryId];

    if (categoryId === 1 || !category) {
      // "Lo último" - get latest posts
      const posts = await wordpressAPI.fetchPosts({ per_page: 10 });
      console.log(
        `Posts for category ${categoryId} (latest):`,
        posts.length,
        "posts"
      );
      return posts;
    } else {
      // Get posts by specific category
      const posts = await wordpressAPI.getPostsByCategory(category.slug, 10);
      console.log(
        `Posts for category ${categoryId} (${category.slug}):`,
        posts.length,
        "posts"
      );
      return posts;
    }
  } catch (error) {
    console.error(`Failed to fetch posts for category ${categoryId}:`, error);
    return [];
  }
}

// Export for use in React Native
export {
  WordPressAPIHandler,
  wordpressAPI,
  getLatestNews,
  getFeaturedNews,
  getPostsByCategory,
  categoryMapping,
};
