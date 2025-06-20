import {
  View,
  Text,
  Pressable,
  ImageBackground,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { getStyles } from "../styles/common";
import { tStyles, colors } from "../common/theme";

const ImageCatItem = ({ item, selected, setSelected, wide }) => {
  const mode = useColorScheme();
  const isSelected = () =>
    selected != null ? selected.includes(item.id) : false;
  const { width } = useWindowDimensions();
  const _width = wide ? wide : width;

  function toggleSelected(element) {
    if (selected != null) {
      let sel = [...selected];
      const index = sel.indexOf(element);
      if (index === -1) {
        sel.push(element);
      } else {
        sel.splice(index, 1);
      }
      setSelected(sel);
    }
  }
  return (
    <Pressable
      onPress={() => toggleSelected(item.id)}
      style={[{ width: (_width - 45) * 0.5, height: _width * 0.61 }]}
    >
      <ImageBackground
        source={{ uri: item.image }}
        style={[
          isSelected()
            ? getStyles(mode).topicItemSelected
            : getStyles(mode).topicItem,
        ]}
        imageStyle={{ borderRadius: 40 }}
      >
        <View style={[tStyles.flex1, { justifyContent: "space-between" }]}>
          <View
            style={[tStyles.endy, { paddingTop: 25, paddingRight: 20 }]}
          ></View>

          <LinearGradient
            colors={["transparent", "rgba(25,46,81,0.8)"]}
            style={getStyles(mode).topicNameContainer}
          >
            <Text style={getStyles(mode).topicName}>{item.title}</Text>
            {item.subtitle && (
              <Text style={getStyles(mode).topicSubtitle}>{item.subtitle}</Text>
            )}
          </LinearGradient>
        </View>
      </ImageBackground>
    </Pressable>
  );
};

export default ImageCatItem;
