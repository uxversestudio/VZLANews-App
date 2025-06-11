import React from "react";
import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import { colors, tStyles } from "../common/theme";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ShareBackHeader = ({ color, addBookmark, share }) => {
  const mode = useColorScheme();
  const navigation = useNavigation();
  const handleGoBack = () => {
    console.log("presione aca");
    navigation.goBack();
  };

  const handleShare = async () => {
    try {
      // If a custom share function is provided, use it
      if (typeof share === "function") {
        share();
        return;
      }

      // Otherwise use the default share functionality
      await Share.share({
        message: "Mira esta noticia interesante",
        url: "https://venezuela-news.com/article-url", // This should be dynamically set with the actual article URL
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <View style={[tStyles.spacedRow, { paddingVertical: 25 }]}>
      <TouchableOpacity onPress={handleGoBack}>
        <AntDesign name='arrowleft' size={22} color={color} />
      </TouchableOpacity>

      <View style={tStyles.row}>
        <TouchableOpacity
          onPress={() => addBookmark(true)}
          style={{ marginRight: 15 }}
        ></TouchableOpacity>

        <TouchableOpacity onPress={handleShare}>
          <AntDesign name='sharealt' size={20} color={color} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default ShareBackHeader;
