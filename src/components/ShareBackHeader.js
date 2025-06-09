import React from "react";
import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import { colors, tStyles } from "../common/theme";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { getStyles } from "../styles/common";
import { useNavigation } from "@react-navigation/native";

const ShareBackHeader = ({ color, addBookmark, share }) => {
  const mode = useColorScheme();
  const navigation = useNavigation();

  const isBookmarked = () => false;
  const handleGoBack = () => {
    console.log("presione aca");
    navigation.goBack();
  };

  return (
    <View style={[tStyles.spacedRow, { paddingVertical: 20 }]}>
      <TouchableOpacity onPress={handleGoBack}>
        <AntDesign name='arrowleft' size={22} color={color} />
      </TouchableOpacity>

      <View style={tStyles.row}>
        <TouchableOpacity
          onPress={() => addBookmark(true)}
          style={{ marginRight: 15 }}
        ></TouchableOpacity>

        <TouchableOpacity onPress={share}>
          <AntDesign name='sharealt' size={20} color={color} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default ShareBackHeader;
