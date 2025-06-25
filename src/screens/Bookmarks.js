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
  useColorScheme,
  StatusBar,
} from "react-native";
import VideoPlayerWebView from "../components/VideoPlayer";
import RadioPlayer from "../components/RadioPlayer";
import * as ScreenOrientation from "expo-screen-orientation";
import ModalCustom from "../components/Modal";

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
  const [mediaMode, setMediaMode] = useState("radio");
  const [videoError, setVideoError] = useState(false);
  const [videoErrorMessage, setVideoErrorMessage] = useState("");
  const mode = useColorScheme();
  const isDark = mode === "dark";
  const streamUrls = [
    "https://vcp15.myplaytv.com/venenews/venenews/playlist.m3u8",
  ];

  const [currentStreamUrl, setCurrentStreamUrl] = useState(streamUrls[0]);
  const [streamIndex, setStreamIndex] = useState(0);

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
      // Mostrar el modal cuando todos los streams fallan
      setNewModal(true);
    }
  };

  const handleRetryVideo = () => {
    setStreamIndex(0);
    setCurrentStreamUrl(streamUrls[0]);
    setVideoError(false);
    setNewModal(false);
  };

  const handleUseRadio = () => {
    setMediaMode("radio");
    setVideoError(false);
    setNewModal(false);
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

      {/* Modal de Error de Video */}
      {newModal && (
        <ModalCustom setStatus={setNewModal} height='50%'>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Stream no disponible en este momento
              </Text>
              <Text style={styles.modalMessage}>
                Parece que no hay transmisión en vivo en este momento. Pero
                puedes seguir escuchando las noticias en modo radio.
              </Text>
              <Text style={[styles.modalMessage, styles.modalMessage2]}></Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.retryButton]}
                onPress={handleUseRadio}
              >
                <Text style={styles.radioButtonText}>
                  Escuchar en modo radio
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.radioButton]}
                onPress={handleRetryVideo}
              >
                <Text style={styles.retryButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ModalCustom>
      )}
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
      minHeight: height * 0.8,
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
    // Estilos para el contenido del modal
    modalContent: {
      flex: 1,
      justifyContent: "space-between",
      paddingVertical: 20,
    },
    modalHeader: {
      alignItems: "center",
      paddingHorizontal: 20,
      marginTop: 0,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#000",
      marginTop: 8,
      marginBottom: 12,
      textAlign: "center",
    },
    modalMessage: {
      fontSize: 14,
      color: "#6b7280",
      textAlign: "justify",
      lineHeight: 18,
    },
    modalMessage2: {
      marginLeft: -20,
      marginBottom: 0,
    },
    modalButtons: {
      paddingHorizontal: 20,
      gap: 12,
    },
    modalButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      gap: 8,
    },
    retryButton: {
      backgroundColor: "#3b82f6",
    },
    radioButton: {
      backgroundColor: "#fff",
      borderWidth: 1,
    },
    retryButtonText: {
      color: "#000",
      fontSize: 16,
      fontWeight: "600",
    },
    radioButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
  });

export default Bookmarks;
