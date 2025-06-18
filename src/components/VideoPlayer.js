"use client";

import { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import * as ScreenOrientation from "expo-screen-orientation";

const VideoPlayerWebView = ({
  source,
  style,
  controls = true,
  resizeMode = "contain",
  paused = false,
  onError,
  isFullscreen = false,
  onFullscreenToggle,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(!paused);
  const webViewRef = useRef(null);

  // URLs alternativas para el stream
  const alternativeStreams = [
    "https://vcp15.myplaytv.com/venenews/venenews/playlist.m3u8",
    "https://vcp15.myplaytv.com/venenews/venenews/chunklist.m3u8",
  ];

  const [currentStreamIndex, setCurrentStreamIndex] = useState(0);
  const [currentSource, setCurrentSource] = useState(source);

  // Función para manejar pantalla completa
  const handleFullscreenToggle = async () => {
    if (onFullscreenToggle) {
      console.log(isFullscreen, "=====");
      if (!isFullscreen) {
        // Siempre cambiar a horizontal al expandir
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
        );
      } else {
        // Volver a portrait al salir de pantalla completa
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT
        );
      }
      onFullscreenToggle();
    }
  };

  // HTML optimizado con botón de pantalla completa
  const getVideoHTML = (videoUrl) => `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <meta charset="utf-8">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                background-color: #000;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                overflow: hidden;
            }
            
            video {
                width: 100%;
                height: 100%;
                object-fit: ${resizeMode === "contain" ? "contain" : "cover"};
                background-color: #000;
            }
            
            .video-container {
                position: relative;
                width: 100%;
                height: 100%;
                background-color: #000;
            }
            
            .live-indicator {
                position: absolute;
                top: 10px;
                left: 10px;
                background-color: rgba(255,0,0,0.9);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: bold;
                z-index: 1000;
                font-family: inherit;
            }

            .fullscreen-btn {
                position: absolute;
                top: 12em;
                right: 10px;
                background-color: rgba(0,0,0,0.7);
                color: white;
                border: none;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 14px;
                cursor: pointer;
                z-index: 1000;
                font-family: inherit;
                display: flex;
                align-items: center;
                gap: 4px;
            }

            .fullscreen-btn:active {
                background-color: rgba(0,0,0,0.9);
            }
            
            .loading-container {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0,0,0,0.9);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: white;
                z-index: 999;
            }
            
            .spinner {
                border: 3px solid #333;
                border-top: 3px solid #fff;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                animation: spin 1s linear infinite;
                margin-bottom: 15px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .error-container {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #1a1a1a;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: white;
                text-align: center;
                padding: 20px;
                z-index: 999;
            }
            
            .error-icon {
                font-size: 48px;
                margin-bottom: 16px;
            }
            
            .error-title {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 8px;
            }
            
            .error-message {
                font-size: 14px;
                color: #ccc;
                margin-bottom: 20px;
                line-height: 1.4;
            }
            
            .retry-btn {
                background-color: #ff4444;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                font-size: 16px;
                cursor: pointer;
                font-family: inherit;
            }
            
            .retry-btn:active {
                background-color: #cc3333;
            }
            
            .hidden {
                display: none !important;
            }
        </style>
    </head>
    <body>
        <div class="video-container">
            <div class="loading-container" id="loading">
                <div class="spinner"></div>
                <p>Conectando al stream...</p>
            </div>
            
            <div class="live-indicator hidden" id="live-indicator">🔴 EN VIVO</div>
            
            <button class="fullscreen-btn hidden" id="fullscreen-btn" onclick="toggleFullscreen()">
                ${isFullscreen ? "📱 Vertical" : "📱 Horizontal"}
            </button>
            
            <video 
                id="video" 
                ${controls ? "controls" : ""} 
                ${!paused ? "autoplay" : ""} 
                muted 
                playsinline 
                webkit-playsinline
                class="hidden"
            >
                <source src="${videoUrl}" type="application/x-mpegURL">
                Tu navegador no soporta la reproducción de video.
            </video>
        </div>
        
        <script src="https://cdn.jsdelivr.net/npm/hls.js@1.4.12/dist/hls.min.js"></script>
        <script>
            const video = document.getElementById('video');
            const loading = document.getElementById('loading');
            const liveIndicator = document.getElementById('live-indicator');
            const fullscreenBtn = document.getElementById('fullscreen-btn');
            const videoSrc = '${videoUrl}';
            
            let loadTimeout;
            let retryCount = 0;
            const maxRetries = 3;
            
            function postMessage(data) {
                try {
                    if (window.ReactNativeWebView) {
                        window.ReactNativeWebView.postMessage(JSON.stringify(data));
                    }
                } catch (e) {
                    console.log('Error posting message:', e);
                }
            }

            function toggleFullscreen() {
                postMessage({
                    type: 'fullscreen',
                    message: 'Toggle fullscreen requested'
                });
            }
            
            function showError(message = 'No se pudo cargar el stream de video') {
                document.body.innerHTML = \`
                    <div class="error-container">
                        <div class="error-icon">⚠️</div>
                        <div class="error-title">Error de Conexión</div>
                        <div class="error-message">\${message}</div>
                        <button class="retry-btn" onclick="retryLoad()">Reintentar</button>
                    </div>
                \`;
                
                postMessage({
                    type: 'error',
                    message: message
                });
            }
            
            function showVideo() {
                loading.classList.add('hidden');
                video.classList.remove('hidden');
                liveIndicator.classList.remove('hidden');
                fullscreenBtn.classList.remove('hidden');
                
                postMessage({
                    type: 'loaded',
                    message: 'Video loaded successfully'
                });
            }
            
            function retryLoad() {
                location.reload();
            }
            
            function setupVideo() {
                if (loadTimeout) {
                    clearTimeout(loadTimeout);
                }
                
                loadTimeout = setTimeout(() => {
                    if (!video.classList.contains('hidden')) return;
                    
                    if (retryCount < maxRetries) {
                        retryCount++;
                        console.log(\`Retry attempt \${retryCount}/\${maxRetries}\`);
                        setupVideo();
                    } else {
                        showError('Tiempo de espera agotado. El stream puede no estar disponible.');
                    }
                }, 15000);
                
                if (window.Hls && Hls.isSupported()) {
                    const hls = new Hls({
                        enableWorker: true,
                        lowLatencyMode: true,
                        backBufferLength: 90,
                        maxBufferLength: 30,
                        maxBufferSize: 60 * 1000 * 1000,
                        maxBufferHole: 0.5,
                        maxFragLookUpTolerance: 0.25,
                        liveSyncDurationCount: 3,
                        liveMaxLatencyDurationCount: 10,
                        liveDurationInfinity: false,
                        debug: false
                    });
                    
                    hls.loadSource(videoSrc);
                    hls.attachMedia(video);
                    
                    hls.on(Hls.Events.MANIFEST_PARSED, function() {
                        console.log('HLS manifest parsed successfully');
                        clearTimeout(loadTimeout);
                        showVideo();
                    });
                    
                    hls.on(Hls.Events.ERROR, function(event, data) {
                        console.error('HLS error:', data);
                        clearTimeout(loadTimeout);
                        
                        if (data.fatal) {
                            switch(data.type) {
                                case Hls.ErrorTypes.NETWORK_ERROR:
                                    showError('Error de red. Verifica tu conexión a internet.');
                                    break;
                                case Hls.ErrorTypes.MEDIA_ERROR:
                                    showError('Error de reproducción de media.');
                                    break;
                                default:
                                    showError('Error en el stream de video.');
                                    break;
                            }
                        }
                    });
                    
                } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = videoSrc;
                    
                    video.addEventListener('loadedmetadata', function() {
                        console.log('Safari: Video metadata loaded');
                        clearTimeout(loadTimeout);
                        showVideo();
                    });
                    
                    video.addEventListener('error', function(e) {
                        console.error('Safari video error:', e);
                        clearTimeout(loadTimeout);
                        showError('Error al cargar el video.');
                    });
                    
                } else {
                    clearTimeout(loadTimeout);
                    showError('Tu navegador no soporta la reproducción de streams HLS.');
                }
            }
            
            video.addEventListener('play', function() {
                postMessage({ type: 'play', message: 'Video started playing' });
            });
            
            video.addEventListener('pause', function() {
                postMessage({ type: 'pause', message: 'Video paused' });
            });
            
            video.addEventListener('waiting', function() {
                postMessage({ type: 'buffering', message: 'Video buffering' });
            });
            
            video.addEventListener('canplay', function() {
                postMessage({ type: 'canplay', message: 'Video can play' });
            });
            
            setupVideo();
        </script>
    </body>
    </html>
  `;

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      switch (data.type) {
        case "loaded":
          setIsLoading(false);
          setHasError(false);
          break;
        case "error":
          handleError(data.message);
          break;
        case "play":
          setIsPlaying(true);
          break;
        case "pause":
          setIsPlaying(false);
          break;
        case "buffering":
          break;
        case "canplay":
          setIsLoading(false);
          break;
        case "fullscreen":
          handleFullscreenToggle();
          break;
      }
    } catch (error) {
      console.log("Error parsing WebView message:", error);
    }
  };

  const handleError = (errorMessage) => {
    setIsLoading(false);
    setHasError(true);

    if (currentStreamIndex < alternativeStreams.length - 1) {
      const nextIndex = currentStreamIndex + 1;
      setCurrentStreamIndex(nextIndex);
      setCurrentSource({ uri: alternativeStreams[nextIndex] });
      setIsLoading(true);
      setHasError(false);
      console.log(
        `Trying alternative stream ${nextIndex + 1}:`,
        alternativeStreams[nextIndex]
      );
    } else {
      if (onError) {
        onError({ message: errorMessage || "All streams failed" });
      }
      Alert.alert(
        "Error de Conexión",
        "No se pudo conectar al stream de video. Esto puede deberse a:\n\n• Restricciones geográficas\n• Firewall o proxy\n• Problemas de conectividad\n• Stream temporalmente no disponible",
        [
          { text: "Reintentar", onPress: retryConnection },
          { text: "Cancelar", style: "cancel" },
        ]
      );
    }
  };

  const retryConnection = () => {
    setCurrentStreamIndex(0);
    setCurrentSource(source);
    setHasError(false);
    setIsLoading(true);
  };

  if (hasError && currentStreamIndex >= alternativeStreams.length - 1) {
    return (
      <View style={[styles.videoContainer, style]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Error de Conexión</Text>
          <Text style={styles.errorMessage}>
            No se pudo cargar el stream de video
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={retryConnection}
          >
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.videoContainer, style]}>
      <WebView
        ref={webViewRef}
        source={{ html: getVideoHTML(currentSource.uri) }}
        style={styles.webView}
        onMessage={handleWebViewMessage}
        onLoadStart={() => setIsLoading(true)}
        onError={() => handleError("WebView error")}
        allowsInlineMediaPlaybook={true}
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        scalesPageToFit={false}
        scrollEnabled={false}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        mixedContentMode='compatibility'
        allowsFullscreenVideo={true}
        originWhitelist={["*"]}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        allowFileAccessFromFileURLs={true}
      />

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size='large' color='#fff' />
          <Text style={styles.loadingText}>
            {currentStreamIndex > 0
              ? `Probando conexión alternativa ${currentStreamIndex + 1}...`
              : "Conectando al stream..."}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    backgroundColor: "#000",
    position: "relative",
  },
  webView: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 20,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  errorMessage: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: "#ff4444",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default VideoPlayerWebView;
