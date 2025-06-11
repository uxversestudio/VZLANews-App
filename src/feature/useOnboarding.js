"use client";

import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "@onboarding_completed";

/**
 * Hook personalizado para manejar el estado del onboarding
 * @returns {Object} Estado y funciones para manejar el onboarding
 */
export const useOnboarding = () => {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(null); // null = loading, true/false = estado
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Verificar si el onboarding ya fue completado
   */
  const checkOnboardingStatus = async () => {
    try {
      setIsLoading(true);
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      const completed = value === "true";
      setIsOnboardingCompleted(completed);
      console.log(
        "📱 Onboarding status:",
        completed ? "Completado" : "Pendiente"
      );
    } catch (error) {
      console.error("❌ Error checking onboarding status:", error);
      setIsOnboardingCompleted(false); // Por defecto, mostrar onboarding si hay error
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Marcar el onboarding como completado
   */
  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
      setIsOnboardingCompleted(true);
      console.log("✅ Onboarding marcado como completado");
    } catch (error) {
      console.error("❌ Error saving onboarding status:", error);
    }
  };

  /**
   * Resetear el onboarding (útil para testing o configuraciones)
   */
  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
      setIsOnboardingCompleted(false);
      console.log("🔄 Onboarding reseteado");
    } catch (error) {
      console.error("❌ Error resetting onboarding:", error);
    }
  };

  // Verificar el estado al montar el hook
  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  return {
    isOnboardingCompleted,
    isLoading,
    completeOnboarding,
    resetOnboarding,
    checkOnboardingStatus,
  };
};
