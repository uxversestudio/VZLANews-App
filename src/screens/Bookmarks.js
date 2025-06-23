"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  Alert,
  useColorScheme,
  StatusBar,
} from "react-native";
import VideoPlayerWebView from "../components/VideoPlayer";
import RadioPlayer from "../components/RadioPlayer";
import * as ScreenOrientation from "expo-screen-orientation";

const { width, height } = Dimensions.get("window");

const Icon = ({ name, size = 24, color = "#000", style }) => {
  const iconMap = {
    "arrow-left": "←",
    x: "✕",
    search: "🔍",
    bookmark: "🔖",
    plus: "+",
    expand: "⛶",
    radio: "📻",
    video: "📺",
    error: "⚠️",
  };

  return (
    <Text style={[{ fontSize: size, color, textAlign: "center" }, style]}>
      {iconMap[name] || "?"}
    </Text>
  );
};

const Bookmarks = () => {
  const [newModal, setNewModal] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [bookmarkTitle, setBookmarkTitle] = useState("");
  const [searchText, setSearchText] = useState("");
  const [mediaMode, setMediaMode] = useState("radio");
  const [videoError, setVideoError] = useState(false);
  const [videoErrorMessage, setVideoErrorMessage] = useState("");
  const mode = useColorScheme();
  const isDark = mode === "dark";

  const streamUrls = [
    "https://vcp15.myplaytv.com/venenews/venenews/playlist.m3u8",
    "https://vcp15.myplaytv.com/venenews/venenews/chunklist.m3u8",
    "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
  ];

  const [currentStreamUrl, setCurrentStreamUrl] = useState(streamUrls[0]);
  const [streamIndex, setStreamIndex] = useState(0);

  const bookmarks = [
    {
      id: 1,
      title: "Public",
      subtitle: "102 News",
      image:
        "https://images.stockcake.com/public/6/4/e/64e85ac8-fa25-4531-8456-fe578e14037a_large/rallying-national-pride-stockcake.jpg",
    },
    {
      id: 2,
      title: "Tech",
      subtitle: "50 News",
      image:
        "https://images.stockcake.com/public/c/b/9/cb99c622-332d-4cbb-ad65-672b615654e0_large/business-news-review-stockcake.jpg",
    },
    {
      id: 3,
      title: "Music",
      subtitle: "150 News",
      image:
        "https://images.stockcake.com/public/2/f/4/2f45d23b-9ba8-4b8a-9ff8-609021bbbde0_large/excited-sports-commentator-stockcake.jpg",
    },
    {
      id: 4,
      title: "Health",
      subtitle: "25 News",
      image:
        "https://images.stockcake.com/public/f/1/1/f1187ba6-4ea7-4dd5-9a3c-7f3990d15ea7_large/political-event-broadcast-stockcake.jpg",
    },
    {
      id: 5,
      title: "Religious",
      subtitle: "18 News",
      image:
        "https://images.stockcake.com/public/5/1/1/511aa674-0c8b-4241-bb42-1fe5d15cb077_large/educational-science-fun-stockcake.jpg",
    },
  ];

  const filteredBookmarks = bookmarks.filter((bookmark) =>
    bookmark.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleVideoError = (error) => {
    console.log("Stream error:", error);
    const errorMsg = error?.message || "Error de conexión de video";
    setVideoError(true);
    setVideoErrorMessage(errorMsg);

    if (streamIndex < streamUrls.length - 1) {
      const nextIndex = streamIndex + 1;
      setStreamIndex(nextIndex);
      setCurrentStreamUrl(streamUrls[nextIndex]);
      console.log(`Trying next stream: ${streamUrls[nextIndex]}`);

      setTimeout(() => {
        setVideoError(false);
      }, 2000);
    } else {
      Alert.alert(
        "Error de Video",
        "No se pudo cargar ningún stream de video. La radio está disponible.",
        [
          {
            text: "Reintentar Video",
            onPress: () => {
              setStreamIndex(0);
              setCurrentStreamUrl(streamUrls[0]);
              setVideoError(false);
            },
          },
          {
            text: "Usar Radio",
            onPress: () => {
              setMediaMode("radio");
              setVideoError(false);
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  const toggleMedia = () => {
    setShowVideo(!showVideo);
  };

  const switchMediaMode = (mode) => {
    console.log(`Switching media mode to: ${mode}`);
    setMediaMode(mode);
    setVideoError(false);
    setVideoErrorMessage("");
    if (!showVideo) {
      setShowVideo(true);
    }
  };

  const handleFullscreenToggle = async () => {
    try {
      setIsFullscreen(!isFullscreen);

      if (!isFullscreen) {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
      } else {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT
        );
      }
    } catch (error) {
      console.log("Error changing orientation:", error);
    }
  };

  const handleSaveBookmark = () => {
    if (bookmarkTitle.trim()) {
      console.log("Saving bookmark:", bookmarkTitle);
      setBookmarkTitle("");
      setNewModal(false);
      Alert.alert("Éxito", "Bookmark guardado correctamente");
    } else {
      Alert.alert("Error", "Por favor ingresa un título para el bookmark");
    }
  };

  const handleBookmarkPress = (bookmark) => {
    Alert.alert("Bookmark", `Seleccionaste: ${bookmark.title}`);
  };

  const styles = getStyles(isDark, isFullscreen);

  if (isFullscreen && mediaMode === "video") {
    return (
      <Modal
        visible={isFullscreen}
        animationType='fade'
        presentationStyle='fullScreen'
        statusBarTranslucent={true}
      >
        <View style={styles.fullscreenContainer}>
          <StatusBar hidden={true} />
          <VideoPlayerWebView
            source={{ uri: currentStreamUrl }}
            style={styles.fullscreenVideo}
            controls={true}
            resizeMode='contain'
            paused={false}
            onError={handleVideoError}
            isFullscreen={isFullscreen}
            onFullscreenToggle={handleFullscreenToggle}
          />
          <TouchableOpacity
            style={styles.exitFullscreenBtn}
            onPress={handleFullscreenToggle}
          >
            <Icon name='x' size={24} color='#fff' />
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {showVideo && (
          <View style={styles.mediaSelectorContainer}>
            <View style={styles.mediaSelector}>
              <TouchableOpacity
                style={[
                  styles.mediaSelectorBtn,
                  mediaMode === "video" && styles.mediaSelectorBtnActive,
                ]}
                onPress={() => switchMediaMode("video")}
              >
                <Icon
                  name='video'
                  size={16}
                  color={
                    mediaMode === "video" ? "#fff" : isDark ? "#fff" : "#000"
                  }
                />
                <Text
                  style={[
                    styles.mediaSelectorText,
                    mediaMode === "video" && styles.mediaSelectorTextActive,
                  ]}
                >
                  Video
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.mediaSelectorBtn,
                  mediaMode === "radio" && styles.mediaSelectorBtnActive,
                ]}
                onPress={() => switchMediaMode("radio")}
              >
                <Icon
                  name='radio'
                  size={16}
                  color={
                    mediaMode === "radio" ? "#fff" : isDark ? "#fff" : "#000"
                  }
                />
                <Text
                  style={[
                    styles.mediaSelectorText,
                    mediaMode === "radio" && styles.mediaSelectorTextActive,
                  ]}
                >
                  Radio
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {showVideo && (
          <View style={styles.centeredMediaContainer}>
            {mediaMode === "video" ? (
              <View style={styles.videoWrapper}>
                <VideoPlayerWebView
                  source={{ uri: currentStreamUrl }}
                  style={styles.centeredVideo}
                  controls={true}
                  resizeMode='contain'
                  paused={false}
                  onError={handleVideoError}
                  isFullscreen={isFullscreen}
                  onFullscreenToggle={handleFullscreenToggle}
                />
                <TouchableOpacity
                  style={styles.mediaCloseBtn}
                  onPress={toggleMedia}
                >
                  <Icon name='x' size={16} color='#fff' />
                </TouchableOpacity>
                {videoError && (
                  <View style={styles.errorOverlay}>
                    <Icon name='error' size={16} color='#fff' />
                    <Text style={styles.errorText}>
                      {videoErrorMessage || "Error de conexión"}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.radioWrapper}>
                <RadioPlayer isDark={isDark} />
                <TouchableOpacity
                  style={styles.mediaCloseBtn}
                  onPress={toggleMedia}
                >
                  <Icon name='x' size={16} color='#fff' />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {!showVideo && (
          <View style={styles.showMediaContainer}>
            <TouchableOpacity style={styles.showMediaBtn} onPress={toggleMedia}>
              <Icon
                name={mediaMode === "video" ? "video" : "radio"}
                size={20}
                color={isDark ? "#fff" : "#000"}
              />
              <Text style={styles.showMediaBtnText}>
                Mostrar {mediaMode === "video" ? "Video" : "Radio"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (isDark, isFullscreen) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#111827" : "#f9fafb",
    },
    fullscreenContainer: {
      flex: 1,
      backgroundColor: "#000",
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
    },
    fullscreenVideo: {
      width: "100%",
      height: "100%",
    },
    exitFullscreenBtn: {
      position: "absolute",
      top: 50,
      right: 20,
      backgroundColor: "rgba(0,0,0,0.8)",
      borderRadius: 25,
      width: 50,
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10000,
      elevation: 20,
    },
    scrollContainer: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    mediaSelectorContainer: {
      paddingHorizontal: 20,
      paddingTop: 40,
      paddingBottom: 10,
    },
    mediaSelector: {
      flexDirection: "row",
      backgroundColor: isDark ? "#374151" : "#f3f4f6",
      borderRadius: 12,
      padding: 4,
    },
    mediaSelectorBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      gap: 6,
    },
    mediaSelectorBtnActive: {
      backgroundColor: "#3b82f6",
    },
    mediaSelectorText: {
      fontSize: 14,
      fontWeight: "600",
      color: isDark ? "#fff" : "#000",
    },
    mediaSelectorTextActive: {
      color: "#fff",
    },
    centeredMediaContainer: {
      width: "100%",
      minHeight: height * 0.4,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 20,
      position: "relative",
    },
    videoWrapper: {
      position: "relative",
      width: Math.min(width * 0.9, 400),
      aspectRatio: 16 / 9,
      borderRadius: 16,
      overflow: "hidden",
      elevation: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      backgroundColor: "#000",
    },
    radioWrapper: {
      position: "relative",
      width: "100%",
      maxWidth: 400,
    },
    centeredVideo: {
      width: "100%",
      height: "100%",
    },
    mediaCloseBtn: {
      position: "absolute",
      top: 12,
      right: 12,
      backgroundColor: "rgba(0,0,0,0.8)",
      borderRadius: 20,
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      elevation: 5,
    },
    errorOverlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(239, 68, 68, 0.9)",
      padding: 12,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
    },
    errorText: {
      color: "#fff",
      fontSize: 12,
      fontWeight: "600",
    },
    showMediaContainer: {
      width: "100%",
      minHeight: 100,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 50,
    },
    showMediaBtn: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDark ? "#374151" : "#e5e7eb",
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderRadius: 30,
      gap: 12,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    showMediaBtnText: {
      color: isDark ? "#fff" : "#000",
      fontSize: 16,
      fontWeight: "600",
    },
  });

export default Bookmarks;
