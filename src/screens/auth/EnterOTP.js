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
import OtpTextInput from "react-native-text-input-otp";
import MainBtn from "../../components/MainBtn";
import { colors, fonts, tStyles } from "../../common/theme";

const EnterOTP = ({ navigation }) => {
  const mode = useColorScheme();
  const [otp, setOtp] = React.useState("");

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
          <View style={[{ paddingHorizontal: 15, marginTop: 30 }]}>
            <VogueHeading f_line='Verificacion del Otp' s_line='' />
            <Text
              style={[
                getStyles(mode).dontHaveAccountText,
                { fontSize: 13, marginTop: 10, paddingRight: 40 },
              ]}
            >
              Introduce el código de verificación que acabamos de enviarte por
              correo electrónico.
            </Text>

            {/* OTP Input */}
            <View style={{ marginTop: 20 }}>
              <OtpTextInput
                otp={otp}
                setOtp={setOtp}
                digits={5}
                style={{
                  backgroundColor: colors.gray8,
                  borderWidth: 0,
                  ...tStyles.centerx,
                  ...tStyles.centery,
                }}
                fontStyle={[fonts.bold]}
                focusedStyle={{
                  backgroundColor: colors.white,
                  borderWidth: 2,
                  borderColor: colors.lynch,
                }}
              />
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
          <Text
            style={[
              getStyles(mode).dontHaveAccountText,
              tStyles.selfcenter,
              { marginBottom: 10 },
            ]}
          >
            No has recibido ningun codigo?{" "}
            <Text
              onPress={() => {}}
              style={[fonts.bold, { color: colors.primary }]}
            >
              Reenviar codigo
            </Text>
          </Text>
          <MainBtn
            onPress={() => navigation.navigate("BottomTabNavigator")}
            title='Validar'
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default EnterOTP;
