import { Share, Platform } from "react-native";

/**
 * Utility function to share content using the native share dialog
 * @param {Object} options - Share options
 * @param {string} options.title - Title of the content to share
 * @param {string} options.url - URL to share
 * @param {string} options.message - Message to include with the share
 * @returns {Promise} - Result of the share action
 */
export const shareContent = async ({ title, url, message }) => {
  try {
    const shareOptions = {
      title: title || "Compartir noticia",
      message: message || "Mira esta noticia interesante",
    };

    // Add URL based on platform
    if (url) {
      if (Platform.OS === "ios") {
        shareOptions.url = url;
      } else {
        // On Android, we need to include the URL in the message
        shareOptions.message = `${shareOptions.message}\n\n${url}`;
      }
    }

    const result = await Share.share(shareOptions);

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // Shared with activity type of result.activityType
        console.log(`Shared with ${result.activityType}`);
      } else {
        // Shared
        console.log("Shared successfully");
      }
    } else if (result.action === Share.dismissedAction) {
      // Dismissed
      console.log("Share dismissed");
    }

    return result;
  } catch (error) {
    console.error("Error sharing content:", error);
    throw error;
  }
};
