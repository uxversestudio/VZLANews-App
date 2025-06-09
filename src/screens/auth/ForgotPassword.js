import React from "react";
import {
  View,
  Text,
  useColorScheme,
  Image,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getStyles } from "../../styles/auth";
import BackHeader from "../../components/BackHeader";
import VogueHeading from "../../components/VogueHeading";
import HazyTextInput from "../../components/HazyTextInput";
import MainBtn from "../../components/MainBtn";
import { tStyles } from "../../common/theme";

const ForgotPassword = ({ navigation }) => {
  const mode = useColorScheme();

  return (
    <SafeAreaView style={getStyles(mode).container}>
      <KeyboardAvoidingView
        behavior='height'
        style={[tStyles.flex1, { justifyContent: "space-between" }]}
      >
        {/* Back Header */}
        <View style={{ paddingHorizontal: 15 }}>
          <BackHeader />
        </View>

        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          {/* Screen Heading */}
          <View style={[{ paddingHorizontal: 15 }]}>
            <Image
              source={require("../../assets/images/forgot.png")}
              style={[
                tStyles.selfcenter,
                { width: 220, height: 220, marginBottom: 30 },
              ]}
            />

            <VogueHeading f_line='Olvide la' s_line='Contraseña' />
            <Text
              style={[
                getStyles(mode).dontHaveAccountText,
                { fontSize: 13, marginTop: 10 },
              ]}
            >
              Ingresa tu email para enviarte el código de validación
            </Text>

            {/* Email Input */}
            <View style={[tStyles.centerx, tStyles.centery]}>
              <View style={{ marginTop: 15, width: "100%" }}>
                <HazyTextInput
                  icon='mail'
                  placeholder='Email address'
                  keyboardType='email-address'
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Continue Button */}
        <View
          style={[
            tStyles.endx,
            { marginTop: 80, marginBottom: 25, paddingHorizontal: 15 },
          ]}
        >
          <MainBtn
            onPress={() => navigation.navigate("EnterOTP")}
            title='Siguiente'
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default ForgotPassword;
