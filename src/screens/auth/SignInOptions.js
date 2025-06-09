import React from "react";
import {
  View,
  Text,
  ImageBackground,
  useWindowDimensions,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { tStyles, fonts, colors } from "../../common/theme";
import { getStyles } from "../../styles/auth";
import BackHeader from "../../components/BackHeader";
import MainBtn from "../../components/MainBtn";
import SecBtn from "../../components/SecBtn";

const SignInOptions = ({ navigation }) => {
  const { height } = useWindowDimensions();
  const mode = useColorScheme();

  return (
    <SafeAreaView style={getStyles(mode).container}>
      {/* Back Header */}
      <View style={{ paddingHorizontal: 15 }}>
        <BackHeader skip={() => navigation.navigate("BottomTabNavigator")} />
      </View>

      {/* Hero Image */}
      <View style={{ paddingHorizontal: 15, marginTop: 10 }}>
        <ImageBackground
          source={require("../../assets/images/sign_in.jpg")}
          style={{ width: "100%", height: height * 0.5 }}
          imageStyle={{ borderRadius: 30 }}
        >
          <View style={getStyles(mode).onboardingTint}>
            <Text style={getStyles(mode).authHeading}>Ingresar</Text>
            <Text style={getStyles(mode).authHeading}>Opciones</Text>
          </View>
        </ImageBackground>
      </View>

      {/* Action Buttons */}
      <View style={{ paddingHorizontal: 15, marginTop: 20 }}>
        <MainBtn
          onPress={() => navigation.navigate("SignIn")}
          title='Continuar con email'
          icon='mail-outline'
        />
      </View>

      <View style={{ paddingHorizontal: 15, marginTop: 15 }}></View>

      <View style={{ paddingHorizontal: 15, marginTop: 15 }}>
        {/*<SecBtn
          onPress={() => navigation.navigate("OauthSuccess")}
          title='Sign in with Apple'
          icon='apple'
        />*/}
      </View>

      {/* Dont Have Account Text */}
      <View style={[tStyles.centery, { paddingHorizontal: 15, marginTop: 30 }]}>
        <Text style={getStyles(mode).dontHaveAccountText}>
          No tienes cuenta?{" "}
          <Text
            onPress={() => navigation.navigate("SignUp")}
            style={[fonts.semibold, { color: colors.primary }]}
          >
            Registrate
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};
export default SignInOptions;
