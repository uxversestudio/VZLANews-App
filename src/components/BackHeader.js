import React from "react";
import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import { colors, tStyles } from "../common/theme";
import { AntDesign } from "@expo/vector-icons";
import { getStyles } from "../styles/common";
import { useNavigation } from "@react-navigation/native";

const BackHeader = ({ skip }) => {
  const mode = useColorScheme();
  const navigation = useNavigation();

  return (
    <View style={[tStyles.spacedRow, { paddingVertical: 10 }]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <AntDesign name='arrowleft' size={22} color={colors.blueVogue} />
      </TouchableOpacity>

      {skip && (
        <TouchableOpacity onPress={skip}>
          <Text style={getStyles(mode).skipBtnText}>Omitir</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
export default BackHeader;
