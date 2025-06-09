import React from "react";
import { View, Text, useColorScheme } from "react-native";
import { getStyles } from "../styles/common";

const VogueHeading = ({ f_line, s_line }) => {
  const mode = useColorScheme();

  return (
    <>
      <Text style={getStyles(mode).vogueHeading}>{f_line}</Text>
    </>
  );
};
export default VogueHeading;
