import React from 'react';
import { View, Text, useColorScheme, Image, KeyboardAvoidingView, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStyles } from '../../styles/auth';
import BackHeader from '../../components/BackHeader';
import VogueHeading from '../../components/VogueHeading';
import HazyTextInput from '../../components/HazyTextInput';
import MainBtn from '../../components/MainBtn';
import { tStyles } from '../../common/theme';


const SetPassword = ({ navigation }) => {
    const mode = useColorScheme();
    const [seePass, setSeePass] = React.useState(false);

    return(
        <SafeAreaView style={ getStyles(mode).container }>
            <KeyboardAvoidingView behavior='height' style={[ tStyles.flex1, { justifyContent: 'space-between' } ]}>
                {/* Back Header */}
                <View style={{ paddingHorizontal: 15 }}>
                    <BackHeader />
                </View>

                
                <ScrollView 
                    bounces={ false }
                    showsVerticalScrollIndicator={ false }
                >
                    {/* Screen Heading */}
                    <View style={[{ paddingHorizontal: 15 }]}>
                        <Image
                            source={ require('../../assets/images/set_password.png') }
                            style={[tStyles.selfcenter, { width: 260, height: 200, marginBottom: 30 }]}
                        />

                        <VogueHeading f_line="Update" s_line="Password" />


                        {/* Passwors Input */}
                        <View style={{ marginTop: 15 }}>
                            <HazyTextInput 
                                icon={ !seePass ? "eye" : "eye-off" } 
                                placeholder="New Password" 
                                secureTextEntry={ !seePass } 
                                iconPress={ () => setSeePass((_) => !_) } 
                            />
                        </View>


                        <View style={{ marginTop: 15 }}>
                            <HazyTextInput 
                                icon={ !seePass ? "eye" : "eye-off" } 
                                placeholder="Confirm Password" 
                                secureTextEntry={ !seePass } 
                                iconPress={ () => setSeePass((_) => !_) } 
                            />
                        </View>

                    </View>

                </ScrollView>

                
                {/* Continue Button */}
                <View style={[ tStyles.endx, { marginTop: 80, marginBottom: 25, paddingHorizontal: 15 }]}>
                    <MainBtn onPress={() => { navigation.navigate('BottomTabNavigator') }} title="Submit" />
                </View>
            </KeyboardAvoidingView> 
        </SafeAreaView>
    )
}
export default SetPassword;