import React from "react";
import { View, Text, Image } from "react-native";
import { fonts } from "../common/theme";

const Logo = () => {
  return (
    <Image
      source={require("../assets/images/logoCompleto.png")}
      style={{ width: "40%", height: 35, marginBottom: -20 }}
      resizeMode='contain'
    />
  );
};
export default Logo;
