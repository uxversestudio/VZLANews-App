"use client";

import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  useColorScheme,
  FlatList,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { tStyles, colors } from "../common/theme";
import { getStyles } from "../styles/selectpreferences";
import BackHeader from "../components/BackHeader";
import VogueHeading from "../components/VogueHeading";
import HazyTextInput from "../components/HazyTextInput";
import ImageCatItem from "../components/ImageCatItem";
import MainBtn from "../components/MainBtn";

const SelectTopics = ({ navigation }) => {
  const mode = useColorScheme();
  const topics = [
    {
      id: 1,
      title: "Nacional",
      image:
        "https://images.stockcake.com/public/6/4/e/64e85ac8-fa25-4531-8456-fe578e14037a_large/rallying-national-pride-stockcake.jpg",
    },
    {
      id: 2,
      title: "Negocio",
      image:
        "https://images.stockcake.com/public/c/b/9/cb99c622-332d-4cbb-ad65-672b615654e0_large/business-news-review-stockcake.jpg",
    },
    {
      id: 3,
      title: "Deportes",
      image:
        "https://images.stockcake.com/public/2/f/4/2f45d23b-9ba8-4b8a-9ff8-609021bbbde0_large/excited-sports-commentator-stockcake.jpg",
    },
    {
      id: 4,
      title: "Politica",
      image:
        "https://images.stockcake.com/public/f/1/1/f1187ba6-4ea7-4dd5-9a3c-7f3990d15ea7_large/political-event-broadcast-stockcake.jpg",
    },
    {
      id: 5,
      title: "Ciencia",
      image:
        "https://images.stockcake.com/public/5/1/1/511aa674-0c8b-4241-bb42-1fe5d15cb077_large/educational-science-fun-stockcake.jpg",
    },
    {
      id: 6,
      title: "Tecnologia",
      image:
        "https://images.stockcake.com/public/7/a/f/7af222ad-e1ef-43d1-acb2-f8f0510e63f9_large/child-exploring-technology-stockcake.jpg",
    },
  ];

  const [selected, setSelected] = React.useState([2, 3, 5]);
  const [isLoading, setIsLoading] = React.useState(false);

  // Función para cargar los temas guardados al inicializar el componente
  React.useEffect(() => {
    loadSavedTopics();
  }, []);

  const loadSavedTopics = async () => {
    try {
      const savedTopics = await AsyncStorage.getItem("selectedTopics");
      if (savedTopics) {
        const parsedTopics = JSON.parse(savedTopics);
        setSelected(parsedTopics);
        console.log("Temas cargados desde AsyncStorage:", parsedTopics);
      }
    } catch (error) {
      console.error("Error al cargar los temas guardados:", error);
    }
  };

  // Función para guardar los temas seleccionados
  const saveSelectedTopics = async () => {
    try {
      setIsLoading(true);

      // Validar que al menos un tema esté seleccionado
      if (selected.length === 0) {
        Alert.alert(
          "Selección requerida",
          "Por favor selecciona al menos un tema de interés antes de continuar.",
          [{ text: "OK" }]
        );
        setIsLoading(false);
        return;
      }

      // Obtener los detalles completos de los temas seleccionados
      const selectedTopicsDetails = topics.filter((topic) =>
        selected.includes(topic.id)
      );

      // Crear objeto con información completa para guardar
      const topicsToSave = {
        selectedIds: selected,
        selectedTopics: selectedTopicsDetails,
        savedAt: new Date().toISOString(),
        totalSelected: selected.length,
      };

      // Guardar en AsyncStorage
      await AsyncStorage.setItem("selectedTopics", JSON.stringify(selected));
      await AsyncStorage.setItem(
        "selectedTopicsDetails",
        JSON.stringify(topicsToSave)
      );

      console.log("Temas guardados exitosamente:", {
        ids: selected,
        topics: selectedTopicsDetails.map((t) => t.title),
        count: selected.length,
      });

      navigation.navigate("BottomTabNavigator");
    } catch (error) {
      console.error("Error al guardar los temas:", error);
      Alert.alert(
        "Error",
        "No se pudieron guardar las preferencias. Por favor intenta nuevamente.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Función para obtener los nombres de los temas seleccionados (para debugging)
  const getSelectedTopicsNames = () => {
    return topics
      .filter((topic) => selected.includes(topic.id))
      .map((topic) => topic.title);
  };

  // Función para manejar el skip (saltar selección)
  const handleSkip = async () => {
    try {
      // Guardar que el usuario saltó la selección
      await AsyncStorage.setItem("topicsSkipped", "true");
      await AsyncStorage.setItem("topicsSkippedAt", new Date().toISOString());

      console.log("Usuario saltó la selección de temas");
      navigation.navigate("BottomTabNavigator");
    } catch (error) {
      console.error("Error al guardar skip:", error);
      navigation.navigate("BottomTabNavigator");
    }
  };

  return (
    <SafeAreaView style={getStyles(mode).container}>
      <KeyboardAvoidingView
        behavior='height'
        style={[tStyles.flex1, { justifyContent: "space-between" }]}
      >
        {/* Back Header */}
        <View style={{ paddingHorizontal: 15 }}>
          <BackHeader skip={handleSkip} />
        </View>

        {/* Screen Heading */}
        <View style={[{ paddingHorizontal: 15, marginBottom: 10 }]}>
          <VogueHeading f_line='Selecciona tus temas de interés' />

          {/* Mostrar contador de temas seleccionados */}
          {selected.length > 0 && (
            <Text
              style={{
                marginTop: 0,
                fontSize: 14,
                color: "#FFF",
                opacity: 0.7,
              }}
            >
              {selected.length} tema{selected.length > 1 ? "s" : ""}{" "}
              seleccionado{selected.length > 1 ? "s" : ""}
            </Text>
          )}

          {/* Search Country Input */}
          <View style={{ marginTop: 0 }}>
            <HazyTextInput
              icon='search'
              placeholder='Buscar temas'
              reverse={true}
            />
          </View>
        </View>

        {/* Topics Listing */}
        <FlatList
          showsVerticalScrollIndicator={false}
          data={topics}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ImageCatItem
              item={item}
              selected={selected}
              setSelected={setSelected}
            />
          )}
          contentContainerStyle={[{ paddingHorizontal: 15, paddingTop: 10 }]}
          numColumns={2}
          columnWrapperStyle={tStyles.spacedRow}
          ItemSeparatorComponent={<View style={{ height: 15 }} />}
        />

        {/* Continue Button */}
        <View
          style={[
            tStyles.endx,
            { marginTop: 15, marginBottom: 25, paddingHorizontal: 15 },
          ]}
        >
          <MainBtn
            onPress={saveSelectedTopics}
            title={isLoading ? "Guardando..." : "Continuar"}
            disabled={isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SelectTopics;
