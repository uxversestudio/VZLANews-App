"use client";

import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import ActivaFMService from "../feature/AudioService";

const Icon = ({ name, size = 24, color = "#000" }) => {
  const iconMap = {
    play: "▶️",
    pause: "⏸️",
    volume: "🔊",
    radio: "📻",
    error: "⚠️",
    refresh: "🔄",
    info: "ℹ️",
    wifi: "📶",
    venezuela: "🇻🇪",
  };

  return (
    <Text style={{ fontSize: size, color, textAlign: "center" }}>
      {iconMap[name] || "?"}
    </Text>
  );
};

const RadioPlayer = ({ isDark = false, style }) => {
  const [station, setStation] = useState(ActivaFMService.getCurrentTrack());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);

  const updateState = useCallback((state) => {
    console.log("🎵 UI Update:", {
      playing: state.isPlaying,
      loading: state.isLoading,
      error: state.error ? "Yes" : "No",
    });

    setIsPlaying(state.isPlaying);
    setIsLoading(state.isLoading);
    setStation(state.currentTrack);
    setError(state.error);
  }, []);

  useEffect(() => {
    const initializeService = async () => {
      try {
        console.log("🎵 Initializing Activa 104.9 FM Player...");
        setIsLoading(true);
        setError(null);

        const success = await ActivaFMService.setupAudio();
        if (success) {
          console.log("✅ Activa FM service initialized");
          setStation(ActivaFMService.getCurrentTrack());
          ActivaFMService.addListener(updateState);
          setIsInitialized(true);
        } else {
          setError("No se pudo inicializar el reproductor de Activa 104.9 FM");
        }
      } catch (error) {
        console.error("❌ Initialization error:", error);
        setError("Error al configurar Activa 104.9 FM: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    initializeService();

    return () => {
      console.log("🧹 Cleaning up Activa FM Player...");
      ActivaFMService.removeListener(updateState);
      ActivaFMService.cleanup();
    };
  }, [updateState]);

  const handlePlayPause = async () => {
    try {
      console.log(`🎵 ${isPlaying ? "Pause" : "Play"} Activa 104.9 FM`);
      setError(null);
      if (isPlaying) {
        await ActivaFMService.pause();
      } else {
        await ActivaFMService.play();
      }
    } catch (error) {
      console.error("❌ Play/Pause error:", error);
      setError("Error de reproducción: " + error.message);
      Alert.alert(
        "Error",
        "No se pudo reproducir Activa 104.9 FM. Verifica tu conexión a internet."
      );
    }
  };

  const handleRetry = async () => {
    try {
      console.log("🔄 Manual retry for Activa 104.9 FM");
      setError(null);
      await ActivaFMService.retry();
    } catch (error) {
      console.error("❌ Retry error:", error);
      setError("Error al reintentar: " + error.message);
    }
  };

  const handleInfo = () => {
    Alert.alert(
      "📻 Activa 104.9 FM",
      `🇻🇪 Altagracia de Orituco, Venezuela
📡 Frecuencia: 104.9 FM
🌐 Web: activafmaltagracia.blogspot.com
📍 Estado Guárico

ℹ️ Nota: Usando streams de prueba mientras se obtiene la URL oficial de la emisora.`,
      [{ text: "OK", style: "default" }]
    );
  };

  const styles = getActivaFMStyles(isDark);

  if (!isInitialized && isLoading) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='#e53e3e' />
          <Text style={styles.loadingText}>
            Conectando a Activa 104.9 FM...
          </Text>
          <Text style={styles.loadingNote}>Configurando audio...</Text>
        </View>
      </View>
    );
  }

  if (!isInitialized && error) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.errorContainer}>
          <Icon name='error' size={40} color='#e53e3e' />
          <Text style={styles.errorTitle}>Error de Configuración</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Icon name='refresh' size={16} color='#fff' />
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.radioCard}>
        <View style={styles.header}>
          <Icon name='venezuela' size={24} />
          <Text style={styles.headerText}>Venezuela</Text>
        </View>

        <View style={styles.artworkContainer}>
          <View style={styles.artworkWrapper}>
            <Image
              source={{ uri: station?.artwork }}
              style={styles.artwork}
              onError={() => console.log("Error loading artwork")}
            />
            <View style={styles.logoOverlay}>
              <Text style={styles.logoText}>ACTIVA</Text>
              <Text style={styles.frequencyText}>104.9 FM</Text>
            </View>
          </View>
          {isLoading && (
            <View style={styles.bufferingOverlay}>
              <ActivityIndicator size='small' color='#fff' />
              <Text style={styles.bufferingText}>Conectando...</Text>
            </View>
          )}
        </View>

        <View style={styles.stationInfo}>
          <Text style={styles.stationTitle}>Activa 104.9 FM</Text>

          {isPlaying && !isLoading && !error && (
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>REPRODUCIENDO</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorIndicator}>
              <Icon name='wifi' size={12} color='#e53e3e' />
              <Text style={styles.errorIndicatorText}>Error de conexión</Text>
            </View>
          )}

          {isLoading && (
            <View style={styles.loadingIndicator}>
              <ActivityIndicator size='small' color='#e53e3e' />
              <Text style={styles.loadingIndicatorText}>Conectando...</Text>
            </View>
          )}
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[
              styles.controlButton,
              isLoading && styles.controlButtonDisabled,
            ]}
            onPress={handleInfo}
            disabled={isLoading}
          >
            <Icon name='info' size={20} color={isDark ? "#fff" : "#000"} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.playButton,
              isPlaying && styles.playButtonActive,
              isLoading && styles.playButtonLoading,
            ]}
            onPress={handlePlayPause}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size='small' color='#fff' />
            ) : (
              <Icon
                name={isPlaying ? "pause" : "play"}
                size={28}
                color='#fff'
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.controlButton,
              isLoading && styles.controlButtonDisabled,
            ]}
            onPress={handleRetry}
            disabled={isLoading}
          >
            <Icon
              name='refresh'
              size={20}
              color={isLoading ? "#ccc" : isDark ? "#fff" : "#000"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.statusContainer}>
          <Icon name='volume' size={16} color={isDark ? "#888" : "#666"} />
          <Text style={styles.statusText}>
            {error
              ? "Error de conexión"
              : isLoading
              ? "Conectando a Venezuela..."
              : isPlaying
              ? "🇻🇪 Transmitiendo desde Guárico"
              : "Listo para reproducir"}
          </Text>
          {error && (
            <TouchableOpacity
              style={styles.retrySmallButton}
              onPress={handleRetry}
            >
              <Icon name='refresh' size={12} color='#e53e3e' />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const getActivaFMStyles = (isDark) =>
  StyleSheet.create({
    container: {
      width: "100%",
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    loadingContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 50,
    },
    loadingText: {
      marginTop: 15,
      fontSize: 18,
      fontWeight: "bold",
      color: isDark ? "#fff" : "#000",
    },
    loadingSubtext: {
      marginTop: 5,
      fontSize: 14,
      color: isDark ? "#9ca3af" : "#6b7280",
    },
    loadingNote: {
      marginTop: 8,
      fontSize: 12,
      color: "#e53e3e",
      fontStyle: "italic",
    },
    errorContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 50,
      paddingHorizontal: 20,
    },
    errorTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#e53e3e",
      marginTop: 15,
      marginBottom: 10,
    },
    errorMessage: {
      fontSize: 14,
      color: isDark ? "#9ca3af" : "#6b7280",
      textAlign: "center",
      marginBottom: 25,
      lineHeight: 22,
    },
    retryButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#e53e3e",
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 25,
      gap: 8,
    },
    retryButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "700",
    },
    radioCard: {
      backgroundColor: isDark ? "#1f2937" : "#ffffff",
      borderRadius: 24,
      padding: 24,
      elevation: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      alignItems: "center",
      borderWidth: 2,
      borderColor: "#e53e3e20",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
      gap: 8,
    },
    headerText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#e53e3e",
    },
    artworkContainer: {
      position: "relative",
      marginBottom: 20,
    },
    artworkWrapper: {
      position: "relative",
    },
    artwork: {
      width: 140,
      height: 140,
      borderRadius: 70,
      borderWidth: 3,
      borderColor: "#e53e3e",
    },
    logoOverlay: {
      position: "absolute",
      bottom: -5,
      right: -5,
      backgroundColor: "#e53e3e",
      borderRadius: 25,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderWidth: 2,
      borderColor: "#fff",
    },
    logoText: {
      color: "#fff",
      fontSize: 12,
      fontWeight: "bold",
      textAlign: "center",
    },
    frequencyText: {
      color: "#fff",
      fontSize: 10,
      fontWeight: "600",
      textAlign: "center",
    },
    bufferingOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.7)",
      borderRadius: 70,
      justifyContent: "center",
      alignItems: "center",
    },
    bufferingText: {
      color: "#fff",
      fontSize: 11,
      marginTop: 5,
      fontWeight: "600",
    },
    stationInfo: {
      alignItems: "center",
      marginBottom: 25,
      width: "100%",
    },
    stationTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: isDark ? "#fff" : "#000",
      textAlign: "center",
      marginBottom: 5,
    },
    stationLocation: {
      fontSize: 15,
      color: isDark ? "#9ca3af" : "#6b7280",
      textAlign: "center",
      marginBottom: 10,
    },
    liveIndicator: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#10b981",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 15,
      marginTop: 5,
    },
    liveDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#fff",
      marginRight: 6,
    },
    liveText: {
      color: "#fff",
      fontSize: 12,
      fontWeight: "bold",
    },
    errorIndicator: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fee2e2",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 15,
      marginTop: 5,
      gap: 6,
    },
    errorIndicatorText: {
      color: "#e53e3e",
      fontSize: 12,
      fontWeight: "600",
    },
    loadingIndicator: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDark ? "#374151" : "#f3f4f6",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 15,
      marginTop: 5,
      gap: 6,
    },
    loadingIndicatorText: {
      color: "#e53e3e",
      fontSize: 12,
      fontWeight: "600",
    },
    controls: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
      gap: 25,
    },
    controlButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: isDark ? "#374151" : "#f3f4f6",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: isDark ? "#4b5563" : "#d1d5db",
    },
    controlButtonDisabled: {
      opacity: 0.5,
    },
    playButton: {
      width: 75,
      height: 75,
      borderRadius: 37.5,
      backgroundColor: "#e53e3e",
      justifyContent: "center",
      alignItems: "center",
      elevation: 8,
      shadowColor: "#e53e3e",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
    },
    playButtonActive: {
      backgroundColor: "#c53030",
    },
    playButtonLoading: {
      backgroundColor: "#9ca3af",
    },
    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    statusText: {
      fontSize: 13,
      color: isDark ? "#9ca3af" : "#6b7280",
      fontWeight: "500",
      textAlign: "center",
    },
    retrySmallButton: {
      padding: 5,
    },
  });

export default RadioPlayer;
