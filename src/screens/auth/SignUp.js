import React from "react";
import {
  View,
  Text,
  useColorScheme,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getStyles } from "../../styles/auth";
import BackHeader from "../../components/BackHeader";
import { tStyles, fonts, colors } from "../../common/theme";
import PillBtn from "../../components/PillBtn";
import VogueHeading from "../../components/VogueHeading";
import HazyTextInput from "../../components/HazyTextInput";
import MainBtn from "../../components/MainBtn";
import SecBtn from "../../components/SecBtn";

const SignUp = ({ navigation }) => {
  const mode = useColorScheme();
  const [seePass, setSeePass] = React.useState(false);

  return (
    <SafeAreaView style={getStyles(mode).container}>
      <KeyboardAvoidingView behavior='height'>
        {/* Back Header */}
        <View style={{ paddingHorizontal: 15 }}></View>

        {/* SignIn SignUp Buttons */}
        <View style={[tStyles.row, { paddingHorizontal: 15, marginTop: 15 }]}>
          <PillBtn
            onPress={() => navigation.navigate("SignIn")}
            title='Iniciar sesion'
            transparent={true}
          />

          <PillBtn title='Registrarte' />
        </View>

        {/* Screen Heading */}
        <View style={{ paddingHorizontal: 15, marginTop: 25 }}>
          <VogueHeading s_line='Crea una cuenta' />
        </View>

        {/* Sign Up Form */}
        <View style={{ paddingHorizontal: 15, marginTop: 10 }}>
          <View style={{ marginTop: 15 }}>
            <HazyTextInput icon='user' placeholder='Tu nombre' />
          </View>

          <View style={{ marginTop: 15 }}>
            <HazyTextInput
              icon='mail'
              placeholder='Correo electronico'
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
          <View style={{ marginTop: 12 }}>
            <Text style={getStyles(mode).dontHaveAccountText}>
              Acepto que he leído los{" "}
              <Text
                onPress={() => navigation.navigate("Terms")}
                style={[fonts.semibold, { color: colors.primary }]}
              >
                Términos y condiciones
              </Text>{" "}
              y{" "}
              <Text
                onPress={() => navigation.navigate("Terms")}
                style={[fonts.semibold, { color: colors.primary }]}
              >
                Política y privacidad
              </Text>
            </Text>
          </View>

          {/* Sign Up Button */}
          <View style={{ marginTop: 50 }}>
            <MainBtn
              onPress={() => navigation.navigate("EnterOTP")}
              title='Registrarte'
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default SignUp;
