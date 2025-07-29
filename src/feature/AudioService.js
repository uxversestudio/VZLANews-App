import { Audio } from "expo-av";
import { Platform } from "react-native";

class ActivaFMServiceFixed {
  constructor() {
    this.sound = null;
    this.isPlaying = false;
    this.isLoading = false;
    this.station = {
      id: "activa-104-9-fm",
      title: "Activa 104.9 FM",
      artist: "Venezuela news",
      frequency: "104.9 FM",
      artwork: "https://static.mytuner.mobi/media/tvos_radios/2dtqy3cdjvxt.png",
      // URLs potenciales basadas en patrones comunes de radios venezolanas
      streamUrls: [
        "https://stream-162.zeno.fm/t31pbasum7zuv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJ0MzFwYmFzdW03enV2IiwiaG9zdCI6InN0cmVhbS0xNjIuemVuby5mbSIsInJ0dGwiOjUsImp0aSI6IlVXT2NPd0JxU2gtSVlnRnZDUzl1VHciLCJpYXQiOjE3MzcwODQwOTEsImV4cCI6MTczNzA4NDE1MX0.qbI74VVctZggX1XkanMsqFBcYDO89s08M65XxUBo2L4", // URL potencial 3
      ],
    };
    this.currentUrlIndex = 0;
    this.listeners = [];
    this.retryCount = 0;
    this.maxRetries = 2;
  }

  async setupAudio() {
    try {
      console.log("🎵 Setting up audio for Activa 104.9 FM...");

      // Configuración básica sin constantes problemáticas
      const basicConfig = {
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      };

      // Usar valores numéricos directos en lugar de constantes
      if (Platform.OS === "ios") {
        // Valor numérico para iOS DoNotMix
        basicConfig.interruptionModeIOS = 1;
      } else if (Platform.OS === "android") {
        // Valor numérico para Android DoNotMix
        basicConfig.interruptionModeAndroid = 1;
      }

      await Audio.setAudioModeAsync(basicConfig);
      console.log("✅ Audio configuration successful");
      return true;
    } catch (error) {
      console.error("❌ Audio setup error:", error);

      // Fallback 1: Sin modos de interrupción
      try {
        console.log("🔄 Trying fallback configuration...");
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        console.log("✅ Fallback audio configuration successful");
        return true;
      } catch (fallbackError) {
        console.error("❌ Fallback failed:", fallbackError);

        // Fallback 2: Configuración mínima
        try {
          console.log("🔄 Trying minimal configuration...");
          await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
          });
          console.log("✅ Minimal audio configuration successful");
          return true;
        } catch (minimalError) {
          console.error("❌ All audio configurations failed:", minimalError);
          return false;
        }
      }
    }
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }

  notifyListeners() {
    this.listeners.forEach((callback) =>
      callback({
        isPlaying: this.isPlaying,
        isLoading: this.isLoading,
        currentTrack: this.station,
        error: this.lastError,
      })
    );
  }

  async testConnection(url) {
    try {
      console.log(`🔍 Testing: ${url}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(url, {
        method: "HEAD",
        signal: controller.signal,
        headers: {
          "User-Agent": "RadioApp/1.0",
          Accept: "audio/*",
        },
      });

      clearTimeout(timeoutId);
      const isWorking = response.ok || response.status === 200;
      console.log(
        `${isWorking ? "✅" : "❌"} ${url} - Status: ${response.status}`
      );
      return isWorking;
    } catch (error) {
      if (error.name === "AbortError") {
        console.log(`⏱️ Timeout: ${url}`);
      } else {
        console.log(`❌ Connection failed: ${url} - ${error.message}`);
      }
      return false;
    }
  }

  async findWorkingStream() {
    console.log("🔍 Searching for working Activa 104.9 FM stream...");

    for (let i = 0; i < this.station.streamUrls.length; i++) {
      const url = this.station.streamUrls[i];

      if (await this.testConnection(url)) {
        console.log(`✅ Found working stream: ${url}`);
        this.currentUrlIndex = i;
        return url;
      }
    }

    console.log("❌ No working streams found");
    return null;
  }

  async play() {
    try {
      console.log("▶️ Play requested for Activa 104.9 FM");
      if (this.sound) {
        const status = await this.sound.getStatusAsync();
        if (status.isLoaded && !status.error) {
          await this.sound.playAsync();
          this.isPlaying = true;
          this.notifyListeners();
          return;
        }
      }
      await this.loadAndPlay();
    } catch (error) {
      console.error("❌ Play error:", error);
      this.handlePlaybackError(error);
    }
  }

  async loadAndPlay() {
    try {
      this.isLoading = true;
      this.lastError = null;
      this.notifyListeners();

      // Limpiar audio anterior
      if (this.sound) {
        try {
          await this.sound.unloadAsync();
        } catch (e) {
          console.log("Warning: Error unloading previous sound");
        }
        this.sound = null;
      }

      // Buscar stream que funcione
      let workingUrl;
      if (this.retryCount === 0) {
        // Primera vez, usar la URL actual
        workingUrl = this.station.streamUrls[this.currentUrlIndex];
        console.log(`📻 Trying current stream: ${workingUrl}`);
      } else {
        // Buscar alternativa
        workingUrl = await this.findWorkingStream();
      }

      if (!workingUrl) {
        throw new Error(
          "No se pudo encontrar un stream disponible para Activa 104.9 FM"
        );
      }

      console.log(`🎵 Loading Activa 104.9 FM from: ${workingUrl}`);

      const { sound } = await Audio.Sound.createAsync(
        { uri: workingUrl },
        {
          shouldPlay: true,
          isLooping: false,
          volume: 1.0,
          progressUpdateIntervalMillis: 3000,
        },
        this.onPlaybackStatusUpdate.bind(this)
      );

      this.sound = sound;
      this.isPlaying = true;
      this.isLoading = false;
      this.retryCount = 0;
      console.log("✅ Activa 104.9 FM loaded successfully!");
      this.notifyListeners();
    } catch (error) {
      console.error("❌ Load error:", error);
      this.handlePlaybackError(error);
    }
  }

  onPlaybackStatusUpdate(status) {
    if (status.isLoaded) {
      const wasPlaying = this.isPlaying;
      const wasLoading = this.isLoading;

      this.isPlaying = status.isPlaying && !status.isBuffering;
      this.isLoading = status.isBuffering;

      if (wasPlaying !== this.isPlaying || wasLoading !== this.isLoading) {
        this.notifyListeners();
      }

      if (status.error) {
        console.error("❌ Playback error:", status.error);
        this.handlePlaybackError(new Error(status.error));
      }
    } else if (status.error) {
      console.error("❌ Load error:", status.error);
      this.handlePlaybackError(new Error(status.error));
    }
  }

  async handlePlaybackError(error) {
    console.log(`🚨 Handling error: ${error.message}`);
    this.isLoading = false;
    this.isPlaying = false;
    this.lastError = `Error de conexión con Activa 104.9 FM: ${error.message}`;

    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      console.log(
        `🔄 Retry ${this.retryCount}/${this.maxRetries} for Activa 104.9 FM`
      );

      setTimeout(() => {
        this.loadAndPlay();
      }, 3000);
    } else {
      console.log("❌ Max retries reached for Activa 104.9 FM");
      this.lastError =
        "No se pudo conectar a Activa 104.9 FM. Verifica tu conexión a internet.";
    }

    this.notifyListeners();
  }

  async pause() {
    try {
      if (this.sound) {
        await this.sound.pauseAsync();
        this.isPlaying = false;
        console.log("⏸️ Activa 104.9 FM paused");
        this.notifyListeners();
      }
    } catch (error) {
      console.error("❌ Pause error:", error);
    }
  }

  async stop() {
    try {
      if (this.sound) {
        await this.sound.stopAsync();
        this.isPlaying = false;
        console.log("⏹️ Activa 104.9 FM stopped");
        this.notifyListeners();
      }
    } catch (error) {
      console.error("❌ Stop error:", error);
    }
  }

  async retry() {
    console.log("🔄 Manual retry requested");
    this.retryCount = 0;
    this.lastError = null;
    await this.loadAndPlay();
  }

  async cleanup() {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
      }
      this.isPlaying = false;
      this.isLoading = false;
      this.listeners = [];
      this.retryCount = 0;
      console.log("🧹 Activa FM service cleaned up");
    } catch (error) {
      console.error("❌ Cleanup error:", error);
    }
  }

  getCurrentTrack() {
    return this.station;
  }

  getIsPlaying() {
    return this.isPlaying;
  }

  getIsLoading() {
    return this.isLoading;
  }

  getLastError() {
    return this.lastError;
  }
}

// Singleton instance
const activaFMServiceFixed = new ActivaFMServiceFixed();
export default activaFMServiceFixed;
