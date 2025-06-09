import React from "react";
import {
  View,
  Text,
  useColorScheme,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { tStyles, fonts, colors } from "../../common/theme";
import { getStyles } from "../../styles/auth";
import BackHeader from "../../components/BackHeader";
import PillBtn from "../../components/PillBtn";
import VogueHeading from "../../components/VogueHeading";
import HazyTextInput from "../../components/HazyTextInput";
import MainBtn from "../../components/MainBtn";

const SignIn = ({ navigation }) => {
  const mode = useColorScheme();
  const [seePass, setSeePass] = React.useState(false);

  return (
    <SafeAreaView style={getStyles(mode).container}>
      <KeyboardAvoidingView behavior='height'>
        {/* Back Header */}
        <View style={{ paddingHorizontal: 15 }}>
          <BackHeader />
        </View>

        {/* SignIn SignUp Buttons */}
        <View style={[tStyles.row, { paddingHorizontal: 15, marginTop: 15 }]}>
          <PillBtn title='Iniciar sesión' />

          <PillBtn
            onPress={() => navigation.navigate("SignUp")}
            title='Registrarte'
            transparent={true}
          />
        </View>

        {/* Screen Heading */}
        <View style={{ paddingHorizontal: 15, marginTop: 45 }}>
          <VogueHeading f_line='Iniciar sesión' />
        </View>

        {/* Sign Up Form */}
        <View style={{ paddingHorizontal: 15, marginTop: 10 }}>
          <View style={{ marginTop: 15 }}>
            <HazyTextInput
              icon='mail'
              placeholder='Correo electrónico'
              keyboardType='email-address'
            />
          </View>

          <View style={{ marginTop: 15 }}>
            <HazyTextInput
              icon={!seePass ? "eye" : "eye-off"}
              placeholder='Contraseña'
              secureTextEntry={!seePass}
              iconPress={() => setSeePass((_) => !_)}
            />
          </View>

          {/* Terms Agreement */}
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
            style={{ marginTop: 12 }}
          >
            <Text style={getStyles(mode).dontHaveAccountText}>
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>

          {/* Sign Up Button */}
          <View style={{ marginTop: 80 }}>
            <MainBtn
              onPress={() => navigation.navigate("SelectTopics")}
              title='Iniciar Sesion'
            />
          </View>

          {/* Other Sign Up options */}
          <View style={{ paddingHorizontal: 15, marginTop: 30 }}>
            <Text
              style={[getStyles(mode).dontHaveAccountText, tStyles.selfcenter]}
            ></Text>

            <View style={[tStyles.spacedRow, { marginTop: 25 }]}>
              <View style={{ width: "48%" }}></View>

              <View style={{ width: "48%" }}></View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default SignIn;
