"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
  Image,
  Alert,
  useColorScheme,
  StatusBar,
} from "react-native";
import VideoPlayerWebView from "../components/VideoPlayer";
import * as ScreenOrientation from "expo-screen-orientation";

const { width, height } = Dimensions.get("window");

// Componente de icono simple usando emojis y símbolos
const Icon = ({ name, size = 24, color = "#000", style }) => {
  const iconMap = {
    "arrow-left": "←",
    x: "✕",
    search: "🔍",
    bookmark: "🔖",
    plus: "+",
    expand: "⛶",
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
  const mode = useColorScheme();
  const isDark = mode === "dark";

  // URLs de streams alternativos para probar
  const streamUrls = [
    "https://vcp15.myplaytv.com/venenews/venenews/playlist.m3u8",
    "https://vcp15.myplaytv.com/venenews/venenews/chunklist.m3u8",
  ];

  const [currentStreamUrl, setCurrentStreamUrl] = useState(streamUrls[0]);

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
  };

  const toggleVideo = () => {
    setShowVideo(!showVideo);
  };

  const handleFullscreenToggle = async () => {
    try {
      setIsFullscreen(!isFullscreen);

      // También cambiar la orientación de la pantalla
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

  // SOLUCIÓN: Usar Modal para pantalla completa en lugar de View condicional
  if (isFullscreen) {
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
        {/* Video perfectamente centrado */}
        {showVideo && (
          <View style={styles.centeredVideoContainer}>
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
                style={styles.videoCloseBtn}
                onPress={toggleVideo}
              >
                <Icon name='x' size={16} color='#fff' />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Botón para mostrar video cuando está oculto */}
        {!showVideo && (
          <View style={styles.showVideoContainer}>
            <TouchableOpacity style={styles.showVideoBtn} onPress={toggleVideo}>
              <Icon name='expand' size={20} color={isDark ? "#fff" : "#000"} />
              <Text style={styles.showVideoBtnText}>Mostrar Video</Text>
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
    centeredVideoContainer: {
      width: "100%",
      minHeight: height * 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 30,
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
    centeredVideo: {
      width: "100%",
      height: "100%",
    },
    videoCloseBtn: {
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
    showVideoContainer: {
      width: "100%",
      minHeight: 100,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 30,
    },
    showVideoBtn: {
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
    showVideoBtnText: {
      color: isDark ? "#fff" : "#000",
      fontSize: 16,
      fontWeight: "600",
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 40,
    },
    headingContainer: {
      marginBottom: 24,
      alignItems: "center",
    },
    heading: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 8,
      textAlign: "center",
    },
    subheading: {
      fontSize: 16,
      textAlign: "center",
    },
    searchContainer: {
      marginBottom: 24,
    },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 16,
      paddingHorizontal: 20,
      height: 56,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    searchIcon: {
      marginRight: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
    },
    bookmarkGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      paddingBottom: 20,
    },
    bookmarkCard: {
      width: (width - 60) / 2,
      aspectRatio: 4 / 3,
      marginBottom: 20,
      borderRadius: 16,
      overflow: "hidden",
      position: "relative",
      elevation: 6,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
    },
    bookmarkImage: {
      width: "100%",
      height: "100%",
    },
    bookmarkOverlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: "60%",
      backgroundColor: "rgba(0,0,0,0.7)",
    },
    bookmarkContent: {
      position: "absolute",
      bottom: 16,
      left: 16,
      right: 16,
    },
    bookmarkTitle: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 4,
    },
    bookmarkSubtitle: {
      color: "rgba(255,255,255,0.8)",
      fontSize: 14,
    },
    addBookmarkCard: {
      width: (width - 60) / 2,
      aspectRatio: 4 / 3,
      marginBottom: 20,
      borderRadius: 16,
      borderWidth: 2,
      borderStyle: "dashed",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isDark
        ? "rgba(55, 65, 81, 0.3)"
        : "rgba(243, 244, 246, 0.5)",
    },
    addBookmarkText: {
      fontSize: 14,
      marginTop: 8,
      fontWeight: "600",
      textAlign: "center",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.7)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    modalContent: {
      width: "100%",
      maxWidth: 400,
      borderRadius: 20,
      padding: 28,
      elevation: 15,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 28,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 16,
      paddingHorizontal: 20,
      height: 56,
      marginBottom: 28,
    },
    inputIcon: {
      marginRight: 12,
    },
    textInput: {
      flex: 1,
      fontSize: 16,
    },
    modalButtons: {
      flexDirection: "row",
      gap: 16,
    },
    cancelBtn: {
      flex: 1,
      backgroundColor: "#e5e7eb",
      height: 52,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
    },
    cancelBtnText: {
      color: "#374151",
      fontWeight: "600",
      fontSize: 16,
    },
    saveBtn: {
      flex: 1,
      backgroundColor: "#3b82f6",
      height: 52,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
    },
    saveBtnText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 16,
    },
  });

export default Bookmarks;
