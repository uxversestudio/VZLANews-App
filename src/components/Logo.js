import React from "react";
import { View, Text, Image } from "react-native";
import { fonts } from "../common/theme";

const Logo = () => {
  return (
    <Image
      source={require("../assets/images/logoCompleto.png")}
      style={{ width: 95, height: 25 }}
      resizeMode='contain'
    />
  );
};
export default Logo;
