import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { tStyles } from "../common/theme";
import { ellipString } from "../common/helpers";

const SearchResultItem = ({ item, onPress }) => {
  const navigation = useNavigation();
  const mode = "light"; // Puedes usar useColorScheme() si lo prefieres

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return "Reciente";

    try {
      return moment(dateString).fromNow();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Reciente";
    }
  };

  // Función para navegar a los detalles de la noticia
  const handlePress = () => {
    if (onPress) {
      onPress(item);
    } else {
      navigation.navigate("NewsDetail", { post: item });
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.container}
      activeOpacity={0.7}
    >
      <Image
        source={require("../assets/images/logo.jpeg")}
        style={styles.image}
        resizeMode='cover'
      />

      <View style={styles.contentContainer}>
        <View style={tStyles.spacedRow}>
          <Text style={styles.category}>
            {item.category || "General"}{" "}
            <Text style={styles.readTime}>
              • {item.read_time || 3} min lectura
            </Text>
          </Text>
        </View>

        <Text style={styles.headline}>
          {ellipString(item.headline || "Sin título", 60)}
        </Text>

        <Text style={styles.time}>{formatDate(item.time)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 100,
    height: "100%",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  contentContainer: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  category: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  readTime: {
    color: "#999",
  },
  headline: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginVertical: 5,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
});

export default SearchResultItem;
